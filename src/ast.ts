export interface PosInfo {
	readonly overallPos: number
	readonly line: number
	readonly offset: number
}

export interface Base {
	kind: 'literal' | 'ident' | 'app'
	pos: PosInfo
}

export type Value = bigint | number | boolean | null

export interface Literal extends Base {
	kind: 'literal'
	value: Value
}

export interface Ident extends Base {
	kind: 'ident'
	name: string
}

export interface Application extends Base {
	kind: 'app'
	exprs: Array<Expr>
}

export type Expr = Literal | Ident | Application
