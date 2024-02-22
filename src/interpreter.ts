import * as parser from './parser'
import type * as ast from './ast'
import * as rt from './runtimeTypes'

export interface Execution {
	print: (text: string) => void
	shouldInterrupt: () => boolean
}

class LexEnv {
	vars = new Map<string, rt.Value>()
	prev: LexEnv

	constructor (prev?: LexEnv) {
		if (prev === undefined) {
			this.prev = this
		} else {
			this.prev = prev
		}
	}

	get (k: string): rt.Value {
		let cur: LexEnv = this
		while (true) {
			if (cur.vars.has(k)) {
				return cur.vars.get(k)!
			}
			if (cur.prev === cur) {
				break
			}
			cur = cur.prev
		}
		// not found
		return null
	}

	set (k: string, v: rt.Value): void {
		let cur: LexEnv = this
		while (true) {
			if (cur.vars.has(k)) {
				cur.vars.set(k, v)
				return
			}
			if (cur.prev === cur) {
				break
			}
			cur = cur.prev
		}
		// not found
		this.vars.set(k, v)
	}
}

enum FrameKind {
	REGULAR,
	WHILE,
	SET,
	PROG,
	RETURN,
	IF
}

class Frame {
	kind: FrameKind
	lexEnv: LexEnv
	pc: number
	list: rt.List
	traceAlso?: Frame
	ignoreAutoPush: boolean = false
	prevValues: number = -1
	isWhile: boolean = false

	constructor (kind: FrameKind, lexEnv: LexEnv, pc: number, list: rt.List, traceAlso?: Frame) {
		this.kind = kind
		this.lexEnv = lexEnv
		this.pc = pc
		this.list = list
		this.traceAlso = traceAlso
	}
}

class InterpreterFn extends rt.Fn {
	lexEnv: LexEnv
	params: Array<string>
	body: rt.List
	pos?: ast.PosInfo

	constructor (lexEnv: LexEnv, params: Array<string>, body: rt.List, pos?: ast.PosInfo) {
		super()
		this.lexEnv = lexEnv
		this.params = params
		this.body = body
		this.pos = pos
	}

	toString (): string {
		return `<func ${JSON.stringify(this.pos)}>`
	}
}

class Interpreter {
	exec: Execution
	globalLexEnv: LexEnv
	valuesStack: Array<rt.Value> = []
	frames: Array<Frame> = []

	result: ast.Value = null
	baseScope: { returnedValue: ast.Value }

	constructor (exec: Execution) {
		this.exec = exec
		this.globalLexEnv = new LexEnv()
	}

	fillBuiltins (): void {
		this.globalLexEnv.set('print', new rt.RuntimeFn((vls): rt.Value => {
			for (const o of vls) {
				this.exec.print(`${rt.reprType(o)}\n`)
			}
			return null
		}, 'print'))
		this.globalLexEnv.set('print-top-scope', new rt.RuntimeFn((vls): rt.Value => {
			for (const o of vls) {
				if (o === null) {
					continue
				}
				this.exec.print(`${rt.reprType(o)}\n`)
			}
			return null
		}, 'print-top-scope'))
		const addBop = (name: string, fn: (a: any, b: any) => rt.Value): void => {
			this.globalLexEnv.set(name, new rt.RuntimeFn((vls): rt.Value => {
				this.expectLen(vls.length, 2)
				if (typeof vls[0] !== typeof vls[1]) {
					this.error('wrong arg types')
				}
				return fn(vls[0], vls[1])
			}, name))
		}

		const addUop = (name: string, fn: (a: any) => rt.Value): void => {
			this.globalLexEnv.set(name, new rt.RuntimeFn((vls): rt.Value => {
				this.expectLen(vls.length, 1)
				return fn(vls[0])
			}, name))
		}

		addBop('plus', (a, b) => a + b)
		addBop('minus', (a, b) => a - b)
		addBop('times', (a, b) => a * b)
		addBop('divide', (a, b) => a / b)

		addBop('equal', (a, b) => a === b)
		addBop('nonequal', (a, b) => a !== b)
		addBop('less', (a, b) => a < b)
		addBop('lesseq', (a, b) => a <= b)
		addBop('greater', (a, b) => a > b)
		addBop('greatereq', (a, b) => a >= b)

		addUop('isint', x => typeof x === 'bigint')
		addUop('isreal', x => typeof x === 'number')
		addUop('isbool', x => typeof x === 'boolean')
		addUop('isnull', x => x === null)
		addUop('isatom', x => typeof x === 'string')
		addUop('islist', x => x instanceof Array)

		addBop('or', (a, b) => (typeof a === 'boolean' && typeof b === 'boolean') ? (a && b) : (a & b))
		addBop('or', (a, b) => (typeof a === 'boolean' && typeof b === 'boolean') ? (a || b) : (a | b))
		addBop('xor', (a, b) => a ^ b)
		addUop('not', (a) => {
			if (typeof a !== 'boolean') {
				this.error('expected bool')
			}
			return !a
		})

		this.globalLexEnv.set('eval', new rt.RuntimeFn((vls): rt.Value | undefined => {
			this.expectLen(vls.length, 1)
			this.frames.pop()
			this.putValueOnStack(vls[0])
			return undefined
		}, 'eval'))

		addUop('head', (v: any): rt.Value => {
			if (!(v instanceof Array)) {
				this.error(`expected array, got ${rt.reprType(v as rt.Value)}`)
			}
			if (v.length === 0) {
				this.error('accessing head of empty list')
			}
			return v[0]
		})

		addUop('tail', (v: any): rt.Value => {
			if (!(v instanceof Array)) {
				this.error(`expected array, got ${rt.reprType(v as rt.Value)}`)
			}
			if (v.length === 0) {
				this.error('accessing tail of empty list')
			}
			return v.slice(1)
		})

		addUop('isempty', (v: any): rt.Value => {
			if (!(v instanceof Array)) {
				this.error(`expected array, got ${rt.reprType(v as rt.Value)}`)
			}
			return v.length === 0
		})

		this.globalLexEnv.set('cons', new rt.RuntimeFn((vls): rt.Value => {
			this.expectLen(vls.length, 2)
			const l = vls[0]
			const b = vls[1]
			if (!(b instanceof Array)) {
				this.error(`expected array, got ${rt.reprType(b)}`)
			}
			return Array.of<rt.Value>(l, ...b)
		}, 'cons'))

		this.globalLexEnv.set('concat', new rt.RuntimeFn((vls): rt.Value => {
			if (!vls.every((x): x is rt.List => x instanceof Array)) {
				this.error('can\'t concat non-arrays')
			}
			return Array.of<rt.Value>().concat(...vls)
		}, 'concat'))
	}

	private error (x: string): never {
		const stack = this.frames.flatMap(x => {
			const l = x.list
			const ret = []
			if (l.posInfo !== undefined) {
				ret.push(l.posInfo)
			}
			if (x.traceAlso !== undefined) {
				const p = x.traceAlso.list.posInfo
				if (p !== undefined) {
					ret.push(p)
				}
			}
			return ret
		})
		throw new Error(x + '; stack:' + stack.map(t => `\n\t${JSON.stringify(t)}`).join(''))
	}

	private asString (e: rt.Value): string {
		if (typeof e === 'string') {
			return e
		}
		this.error(`expected string, got ${rt.reprType(e)}`)
	}

	private expectLen (got: number, exp: number): void {
		if (got !== exp) {
			this.error(`invalid arguments length, got ${got}, expected ${exp}`)
		}
	}

	private putValueOnStack (v: rt.Value, traceAlso?: Frame): void {
		if (v instanceof Array) {
			const lexEnv = this.frames.length === 0 ? this.globalLexEnv : this.frames.at(-1)!.lexEnv
			const frame = new Frame(FrameKind.REGULAR, lexEnv, 0, v, traceAlso)
			this.frames.push(frame)
			if (v.length === 0) {
				this.error('empty list not allowed in this context')
			}
			const str = v[0]
			if (typeof str !== 'string') {
				return
			}
			switch (str) {
				case 'setq': {
					this.expectLen(v.length, 3)
					this.asString(v[1])
					frame.pc = 2
					frame.kind = FrameKind.SET
					break
				}
				case 'quote': {
					this.expectLen(v.length, 2)
					this.frames.pop()
					this.valuesStack.push(v[1])
					break
				}
				case 'prog': {
					frame.kind = FrameKind.PROG
					frame.lexEnv = new LexEnv(frame.lexEnv)
					if (frame.list.length < 2) {
						this.error('`prog` expects arguments, got none')
					}
					if (!(frame.list[1] instanceof Array)) {
						this.error('expected list of variables')
					}
					for (const o of frame.list[1]) {
						frame.lexEnv.vars.set(this.asString(o), null)
					}
					this.valuesStack.push(null)
					frame.pc = 2
					break
				}
				case 'lambda': {
					if (frame.list.length < 2) {
						this.error('insufficient function body')
					}
					const args = frame.list[1]
					if (!(args instanceof Array)) {
						this.error('args must be a list')
					}
					if (!args.every((x): x is string => typeof x === 'string')) {
						this.error('args must be a string')
					}
					const body: rt.List = frame.list.slice(2)
					body.posInfo = frame.list.posInfo
					this.frames.pop()

					const fn = new InterpreterFn(this.frames.at(-1)!.lexEnv, args, body, frame.list.posInfo)
					this.valuesStack.push(fn)
					break
				}
				case 'func': {
					if (frame.list.length < 3) {
						this.error('not enough arguments for function')
					}
					this.frames.pop()
					const lam: rt.List = ['lambda', frame.list[2]].concat(frame.list.splice(3))
					lam.posInfo = frame.list.posInfo
					const lst: rt.List = ['setq', frame.list[1], lam]
					lst.posInfo = frame.list.posInfo
					this.putValueOnStack(lst)
					break
				}
				case 'return': {
					this.expectLen(frame.list.length, 2)
					frame.kind = FrameKind.RETURN
					frame.pc = 1
					break
				}
				case 'while': {
					if (frame.list.length < 3) {
						this.error('while: not enough arguments')
					}
					frame.kind = FrameKind.WHILE
					frame.prevValues = this.valuesStack.length
					frame.pc = 1
					frame.isWhile = true
					frame.ignoreAutoPush = true
					this.valuesStack.push(null)
					break
				}
				case 'cond': {
					if (frame.list.length !== 4) {
						this.error('while: not enough arguments')
					}
					frame.kind = FrameKind.IF
					frame.pc = 1
					frame.ignoreAutoPush = true
					break
				}
				case 'break': {
					this.expectLen(frame.list.length, 1)
					this.returnTo(null, true)
					break
				}
				default:
				// nothing
			}
		} else if (typeof v === 'string') {
			const f = this.frames.at(-1)!
			this.valuesStack.push(f.lexEnv.get(v))
		} else {
			this.valuesStack.push(v)
		}
	}

	private returnTo (pushVal: rt.Value, isWhile: boolean): void {
		for (let i = this.frames.length - 1; i >= 0; i--) {
			const frame = this.frames[i]
			if (frame.prevValues >= 0 && frame.isWhile === isWhile) {
				this.frames.length = i
				this.valuesStack.length = frame.prevValues
				this.valuesStack.push(pushVal)
				return
			}
		}
		this.error('can\'t unroll stack')
	}

	private step (): void {
		if (this.exec.shouldInterrupt()) {
			return
		}
		const frame = this.frames.at(-1)!
		if (frame.pc !== frame.list.length && !frame.ignoreAutoPush) {
			const curArg = frame.list[frame.pc]
			if (frame.kind === FrameKind.PROG) {
				this.valuesStack.pop()
			}
			frame.pc += 1
			this.putValueOnStack(curArg)
			return
		}
		switch (frame.kind) {
			case FrameKind.PROG: {
				this.frames.pop()
				break
			}
			case FrameKind.SET: {
				this.frames.pop()
				frame.lexEnv.set(frame.list[1] as string, this.valuesStack.pop()!)
				this.valuesStack.push(null)
				break
			}
			case FrameKind.REGULAR: {
				const fn = this.valuesStack.at(-frame.list.length) as rt.Value
				if (!(fn instanceof rt.Fn)) {
					this.error(`function expected, got ${rt.reprType(fn)}`)
				}
				const args = this.valuesStack.slice(this.valuesStack.length - frame.list.length + 1)
				this.valuesStack.length -= frame.list.length
				if (fn instanceof rt.RuntimeFn) {
					const v = fn.fn(args)
					if (v !== undefined) {
						this.frames.pop()
						this.valuesStack.push(v)
					}
				} else if (fn instanceof InterpreterFn) {
					if (fn.params.length !== args.length) {
						this.error(`wrong arguments number got ${args.length}, expected ${fn.params.length} for ${fn.toString()}`)
					}
					const callerFrame = this.frames.pop()
					const execEnv = new LexEnv(fn.lexEnv)
					for (let i = 0; i < args.length; i++) {
						execEnv.vars.set(fn.params[i], args[i])
					}
					const calleeFrame = new Frame(FrameKind.PROG, execEnv, 0, fn.body, callerFrame)
					calleeFrame.prevValues = this.valuesStack.length
					this.frames.push(calleeFrame)
					this.valuesStack.push(null)
				}
				break
			}
			case FrameKind.RETURN: {
				const r = this.valuesStack.pop() as rt.Value
				this.returnTo(r, false)
				break
			}
			case FrameKind.WHILE: {
				if (frame.pc === 1) {
					this.valuesStack.pop()
					this.putValueOnStack(frame.list[1])
					frame.pc = 2
				} else {
					frame.pc = 1
					const vl = this.valuesStack.pop() as rt.Value
					if (typeof vl !== 'boolean') {
						this.error(`while condition is not boolean: ${rt.reprType(vl)}`)
					}
					if (!vl) {
						this.frames.pop()
						this.valuesStack.push(null)
					} else {
						const f = new Frame(FrameKind.PROG, frame.lexEnv, 0, frame.list.slice(2))
						this.frames.push(f)
						this.valuesStack.push(null)
					}
				}
				break
			}
			case FrameKind.IF: {
				if (frame.pc === 1) {
					this.putValueOnStack(frame.list[1])
					frame.pc += 1
				} else {
					const vl = this.valuesStack.pop() as rt.Value
					if (typeof vl !== 'boolean') {
						this.error(`cond: expected boolean, got ${rt.reprType(vl)}`)
					}
					const oldFame = this.frames.pop()
					const newVal = vl ? frame.list[2] : frame.list[3]
					this.putValueOnStack(newVal, oldFame)
				}
				break
			}
		}
	}

	async run (vl: rt.Value): Promise<rt.Value> {
		this.putValueOnStack(vl)
		let iter = 0
		while (this.frames.length !== 0) {
			this.step()
			if (iter++ === 128) {
				iter = 0
				await new Promise(resolve => setTimeout(resolve, 1))
				if (this.exec.shouldInterrupt()) {
					return null
				}
			}
		}
		if (this.valuesStack.length !== 1) {
			throw new Error(`invalid values stack size ${this.valuesStack.length}:\n${this.valuesStack.map(rt.reprType).join('\n')}\n`)
		}
		return this.valuesStack[0]
	}
}

export async function run (program: string, exec: Execution): Promise<rt.Value> {
	const p = new parser.Parser(program)
	const parsed = p.parse()
	if (parsed.errs.length > 0) {
		throw new Error(`parsing failed ${JSON.stringify(parsed.errs)}`)
	}
	if (!p.finished()) {
		throw new Error(`parser not finished at ${JSON.stringify(p.mark())}`)
	}

	const prog = await rt.transform(parsed.ast!.expr)
	const interp = new Interpreter(exec)
	interp.fillBuiltins()

	const topScope: rt.List = ['prog' as rt.Value, []].concat(prog.map(x => ['print-top-scope', x[0]]))

	return await interp.run(topScope)
}
