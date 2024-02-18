/*
export interface PosInfo {
    readonly overallPos: number;
    readonly line: number;
    readonly offset: number;
}

export type Literal = bigint | number | boolean | null

export enum TokenKind {
    LPAR,
    RPAR,
    IDENT,
    KW,
    LITERAL,
}

export interface Token {
    kind: TokenKind
    pos: PosInfo
}

export interface TokenIdent extends Token {
    kind: TokenKind.IDENT,
    ident: string
}

export interface TokenLiteral extends Token {
    kind: TokenKind.IDENT,
    value: Literal
}

export interface TokenKeyword extends Token {
    kind: TokenKind.IDENT,
    value: Literal
}

export function isIdent(t: Token): t is TokenIdent {
    return t.kind == TokenKind.IDENT
}

export function isLiteral(t: Token): t is TokenLiteral {
    return t.kind == TokenKind.LITERAL
}

export function isKw(t: Token): t is TokenKeyword {
    return t.kind == TokenKind.KW
}

export function* lex(input: string): IterableIterator<Token> {

}
*/
