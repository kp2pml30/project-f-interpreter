import * as ast from './ast'

export class Fn {}

export class RuntimeFn extends Fn {
    fn: (vals: Array<Value>) => Value | undefined

    constructor(fn: (vals: Array<Value>) => Value | undefined) {
        super()
        this.fn = fn
    }
}

export interface List<T> extends Array<T> {
    posInfo?: ast.PosInfo
}

export type Value = ast.Value | string | List<Value> | Fn

export async function transform(prog: Array<[ast.PosInfo, ast.Expr]>): Promise<Array<[Value, ast.PosInfo]>> {
    const dfs = (a: ast.Expr): Value => {
        switch (a.kind) {
        case "ident":
            return a.name
        case "literal":
            return a.value
        case "app": {
            const r: List<Value> = a.exprs.map(dfs)
            r.posInfo = a.pos;
            return r;
        }
        }
    }

    return prog.map((e: [ast.PosInfo, ast.Expr]) => [dfs(e[1]), e[0]])
}


export function reprType(v: Value): string {
    return JSON.stringify(v, (k, v) => {
        if (typeof v == 'bigint') {
            return `int:${v.toString()}`
        } else {
            return v;
        }
    })
}
