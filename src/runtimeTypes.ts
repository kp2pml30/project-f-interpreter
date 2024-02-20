import type * as ast from './ast'

export abstract class Fn {
	abstract toString (): string
}

export class RuntimeFn extends Fn {
	name: string
	fn: (vals: Array<Value>) => Value | undefined

	constructor (fn: (vals: Array<Value>) => Value | undefined, name: string = '<runtime>') {
		super()
		this.fn = fn
		this.name = name
	}

	toString (): string {
		return this.name
	}
}

export interface List extends Array<Value> {
	posInfo?: ast.PosInfo
}

export type Value = ast.Value | string | List | Fn

export async function transform (prog: Array<[ast.PosInfo, ast.Expr]>): Promise<Array<[Value, ast.PosInfo]>> {
	const dfs = (a: ast.Expr): Value => {
		switch (a.kind) {
			case 'ident':
				return a.name
			case 'literal':
				return a.value
			case 'app': {
				const r: List = a.exprs.map(dfs)
				r.posInfo = a.pos
				return r
			}
		}
	}

	return prog.map((e: [ast.PosInfo, ast.Expr]) => [dfs(e[1]), e[0]])
}

export function reprType (v: Value): string {
	return JSON.stringify(v, (k, v) => {
		if (typeof v === 'bigint') {
			return `int:${v.toString()}`
		} else if (v instanceof Fn) {
			return `<fn ${v.toString()}>`
		} else {
			return v
		}
	})
}
