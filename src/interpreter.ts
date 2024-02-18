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

class Interpreter {
    exec: Execution
    globalLexEnv: LexEnv
    valuesStack: Array<rt.Value> = []
    traceFrames: Array<ast.PosInfo> = []
    pcsStack: Array<number> = []
    fnsStack: Array<Array<rt.Value>> = []

    result: ast.Value = null
    baseScope: { returnedValue: ast.Value }

    constructor(exec: Execution) {
        this.exec = exec
        this.globalLexEnv = new LexEnv();
    }

    private error(x: string): never {
        throw new Error(x + "; stack:" + this.traceFrames.map(t => `\n\t${JSON.stringify(t)}`).join(''))
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
            if (v.posInfo !== undefined) {
                this.traceFrames.push(v.posInfo)
            }
            if (v.length == 0) {
                this.error("empty list not allowed in this context")
            }
            this.fnsStack.push(v)
            this.pcsStack.push(0)
        } else if (typeof v === 'string') {
            this.valuesStack.push(v)
        } else {
            this.valuesStack.push(v)
        }
    }

    private async step(): Promise<void> {
        if (this.exec.shouldInterrupt()) {
            return;
        }
        const pc = this.pcsStack.at(-1)!
        this.pcsStack[this.pcsStack.length - 1] = pc + 1
        const curList = this.fnsStack.at(-1)!
        if (pc == 0) {
            const curValue = curList[0]
            switch (this.asString(curValue)) {
            case "quote": {
                this.expectLen(curList.length, 2)
                const r = curList[1]
                this.pcsStack.pop()
                this.fnsStack.pop()
                this.valuesStack.push(r)
                return
            }
            default: {
                this.putValueOnStack(curValue)
                return
            }
            }
        }
        if (pc == curList.length) {
            const fn = this.valuesStack.at(-curList.length)!
            const args = this.valuesStack.slice(this.valuesStack.length - curList.length + 1)
            this.valuesStack.length -= curList.length
            try {
                if (fn instanceof Function) {
                    this.valuesStack.push(fn.apply(undefined, args))
                } else {
                    this.error(`not a function ${fn}`)
                }
            } finally {
                this.fnsStack.pop()
                this.pcsStack.pop()
                if ((curList as rt.List<rt.Value>).posInfo !== undefined) {
                    this.traceFrames.pop()
                }
            }
            return
        } else {
            const curArg = curList[pc + 1]
            this.putValueOnStack(curArg)
        }
    }

    async run(vl: rt.Value, pos: ast.PosInfo): Promise<rt.Value> {

        try {
            this.traceFrames.push(pos)
            this.putValueOnStack(vl)
            while (this.fnsStack.length != 0) {
                if (this.exec.shouldInterrupt()) {
                    return null;
                }
                await this.step();
            }
            return this.valuesStack[0]
        } finally {
            this.traceFrames.length = 0
        }
    }
}

export async function run(program: string, exec: Execution): Promise<void> {
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

    for (const line of prog) {
        if (exec.shouldInterrupt()) {
            break
        }
        const res = await interp.run(line[0], line[1])
        if (res !== null) {
            const v = JSON.stringify(res, (k, v) => {
                if (typeof v == 'bigint') {
                    return `int:${v.toString()}`
                } else {
                    return v;
                }
            })
            exec.print(`${v}\n`)
        }
    }
}
