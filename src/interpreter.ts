import * as parser from './parser'
import * as ast from './ast'
import * as rt from './runtimeTypes'

export interface Execution {
    print(text: string): Promise<void>
    shouldInterrupt(): boolean
}

async function nop(): Promise<void> {}

class LexEnv {
    vars: Map<string, rt.Value> = new Map()
    prev: LexEnv

    constructor(prev?: LexEnv) {
        if (prev === undefined) {
            this.prev = this;
        } else {
            this.prev = prev
        }
    }

    get(k: string): rt.Value {
        let cur: LexEnv = this;
        while (true) {
            if (cur.vars.has(k)) {
                return cur.vars.get(k)
            }
            if (cur.prev === cur) {
                break;
            }
            cur = cur.prev;
        }
        // not found
        return null;
    }

    set(k: string, v: rt.Value): void {
        let cur: LexEnv = this;
        while (true) {
            if (cur.vars.has(k)) {
                cur.vars.set(k, v)
                return
            }
            if (cur.prev === cur) {
                break;
            }
            cur = cur.prev;
        }
        // not found
        this.vars.set(k, v)
    }
}

enum FrameKind {
    REGULAR,
    WHILE,
    SET,
    PROG
}

interface Frame {
    kind: FrameKind
    lexEnv: LexEnv
    pc: number
    list: Array<rt.Value>
}

class Interpreter {
    exec: Execution
    globalLexEnv: LexEnv
    valuesStack: Array<rt.Value> = []
    frames: Array<Frame> = []

    result: ast.Value = null
    baseScope: { returnedValue: ast.Value }

    constructor(exec: Execution) {
        this.exec = exec
        this.globalLexEnv = new LexEnv();
    }

    fillBuiltins(): void {
        this.globalLexEnv.set('print', new rt.RuntimeFn((vls) => {
            for (const o of vls) {
                this.exec.print(`${rt.reprType(o)}\n`)
            }
            return null
        }))
        this.globalLexEnv.set('print-top-scope', new rt.RuntimeFn((vls) => {
            for (const o of vls) {
                if (o === null) {
                    continue
                }
                this.exec.print(`${rt.reprType(o)}\n`)
            }
            return null
        }))
        const addBop = (name: string, fn: (a: any, b: any) => any) => this.globalLexEnv.set(name, new rt.RuntimeFn((vls) => {
            this.expectLen(vls.length, 2)
            if (typeof vls[0] !== typeof vls[1]) {
                this.error("wrong arg types")
            }
            return fn(vls[0], vls[1])
        }))

        const addUop = (name: string, fn: (a: any) => any) => this.globalLexEnv.set(name, new rt.RuntimeFn((vls) => {
            this.expectLen(vls.length, 1)
            return fn(vls[0])
        }))

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

        addBop('and', (a, b) => a & b)
        addBop('or', (a, b) => a | b)
        addBop('xor', (a, b) => a ^ b)
        addUop('not', (a) => !a)

        this.globalLexEnv.set('eval', new rt.RuntimeFn((vls) => {
            this.expectLen(vls.length, 1)
            this.putValueOnStack(vls[0])
            return undefined
        }))
    }

    private error(x: string): never {
        const stack = this.frames.flatMap(x => {
            const l = x.list as rt.List<rt.Value>
            return l.posInfo !== undefined ? [l.posInfo] : []
        })
        throw new Error(x + "; stack:" + stack.map(t => `\n\t${JSON.stringify(t)}`).join(''))
    }

    private asString(e: rt.Value, pos?: ast.PosInfo): string {
        if (typeof e === 'string') {
            return e;
        }
        this.error(`expected string at ${pos}, got ${e}`)
    }

    private expectLen(got: number, exp: number): void {
        if (got !== exp) {
            this.error(`invalid arguments length, got ${got}, expected ${exp}`)
        }
    }

    private putValueOnStack(v: rt.Value): void {
        if (v instanceof Array) {
            const lexEnv = this.frames.length == 0 ? this.globalLexEnv : this.frames.at(-1)!.lexEnv
            const frame = {
                kind: FrameKind.REGULAR,
                lexEnv: lexEnv,
                pc: 0,
                list: v,
            }
            this.frames.push(frame)
            if (v.length == 0) {
                this.error("empty list not allowed in this context")
            }
            const str = this.asString(v[0])
            switch (str) {
            case "setq": {
                this.expectLen(v.length, 3)
                const name = this.asString(v[1])
                frame.pc = 2;
                frame.kind = FrameKind.SET
                break;
            }
            case "quote": {
                this.expectLen(v.length, 2)
                this.frames.pop()
                this.valuesStack.push(v[1])
                break;
            }
            case "prog": {
                frame.kind = FrameKind.PROG
                frame.lexEnv = new LexEnv(frame.lexEnv)
                if (frame.list.length <= 2) {
                    this.error("expected list of length >= 3")
                }
                if (!(frame.list[1] instanceof Array)) {
                    this.error("expected list of variables")
                }
                for (const o of frame.list[1]) {
                    frame.lexEnv.vars.set(this.asString(o), null)
                }
                frame.pc = 2;
                break;
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

    private async step(): Promise<void> {
        if (this.exec.shouldInterrupt()) {
            return;
        }
        const frame = this.frames.at(-1)!
        if (frame.pc != frame.list.length) {
            const curArg = frame.list[frame.pc]
            frame.pc += 1
            this.putValueOnStack(curArg)
            return;
        }
        switch (frame.kind) {
        case FrameKind.PROG: {
            const last = this.valuesStack.at(-1)
            this.valuesStack.length -= frame.list.length - 2
            this.valuesStack.push(last)
            this.frames.pop()
            break;
        }
        case FrameKind.SET: {
            this.frames.pop()
            frame.lexEnv.set(frame.list[1] as string, this.valuesStack.pop())
            this.valuesStack.push(null)
            break;
        }
        case FrameKind.REGULAR: {
            const fn = this.valuesStack.at(-frame.list.length)
            if (!(fn instanceof rt.Fn)) {
                this.error(`function expected, got ${rt.reprType(fn)}`)
            }
            this.frames.pop()
            const args = this.valuesStack.slice(this.valuesStack.length - frame.list.length + 1)
            this.valuesStack.length -= frame.list.length
            if (fn instanceof rt.RuntimeFn) {
                const v = fn.fn(args)
                if (v !== undefined) {
                    this.valuesStack.push(v)
                }
            }
            break;
        }
        case FrameKind.WHILE: {
            this.error("todo");
        }
        }
    }

    async run(vl: rt.Value): Promise<rt.Value> {
        this.putValueOnStack(vl)
        while (this.frames.length != 0) {
            if (this.exec.shouldInterrupt()) {
                return null;
            }
            await this.step();
            await new Promise(p => setTimeout(p, 0))
        }
        if (this.valuesStack.length != 1) {
            throw new Error("invalid stack size")
        }
        return this.valuesStack[0]
    }
}

export async function run(program: string, exec: Execution): Promise<rt.Value> {
    const p = new parser.Parser(program);
    const parsed = p.parse()
    if (parsed.errs.length > 0) {
        throw parsed.errs
    }
    if (!p.finished()) {
        throw new Error(`parser not finished at ${JSON.stringify(p.mark())}`);
    }

    const prog = await rt.transform(parsed.ast!.expr);
    const interp = new Interpreter(exec);
    interp.fillBuiltins()

    const topScope: rt.List<rt.Value> = ['prog' as rt.Value, []].concat(prog.map(x => ['print-top-scope', x[0]]))

    return await interp.run(topScope)
}
