# Project F: lisp-like language compiler

## Building and running locally
```bash
npm install
# ^ install dependencies
npm run build:parser
# ^ regenerate parser (dev-only)
npm run serve
# ^ build + host locally a compiler
```

## Before commit
```bash
npx eslint --fix .
# ^ run linter
erb ./test/make-gold.erb > ./test/gold.ts
# ^ generate golden tests
npm run test
# ^ run all tests
```

## Task & specification
Specification is located in [docs](doc/spec.pdf)

1. `List` and `Program` were allowed to be empty, otherwise `func` breaks
2. `Atom` itself is considered to be a value, to allow `(quote x)`
3. Some special forms were modified to be block statements by themselves:
   - `(while Element Element+)`
   - `(program Element Element+)`
   - `(lambda List<Atom> Element+)`
   - `(func Atom List<Atom> Element+)`
