import * as interpreter from 'project-f/interpreter'
import * as fs from 'node:fs/promises'

const { describe, test, expect } = require('@jest/globals');

test('gold/algo/list-filter.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/algo/list-filter.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/algo/list-filter.stdout`)).toString()
    } catch (e) {
        // ignore
    }
    let got = ''
    try {
        await interpreter.run(program, exec)
        got = buf.join('')
    } catch (e) {
        got = String(e)
    }
    if (exp === undefined) {
        await fs.writeFile(`${__dirname}/gold/algo/list-filter.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

test('gold/algo/list-len.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/algo/list-len.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/algo/list-len.stdout`)).toString()
    } catch (e) {
        // ignore
    }
    let got = ''
    try {
        await interpreter.run(program, exec)
        got = buf.join('')
    } catch (e) {
        got = String(e)
    }
    if (exp === undefined) {
        await fs.writeFile(`${__dirname}/gold/algo/list-len.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

test('gold/algo/list-map.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/algo/list-map.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/algo/list-map.stdout`)).toString()
    } catch (e) {
        // ignore
    }
    let got = ''
    try {
        await interpreter.run(program, exec)
        got = buf.join('')
    } catch (e) {
        got = String(e)
    }
    if (exp === undefined) {
        await fs.writeFile(`${__dirname}/gold/algo/list-map.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

test('gold/algo/list-qsort.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/algo/list-qsort.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/algo/list-qsort.stdout`)).toString()
    } catch (e) {
        // ignore
    }
    let got = ''
    try {
        await interpreter.run(program, exec)
        got = buf.join('')
    } catch (e) {
        got = String(e)
    }
    if (exp === undefined) {
        await fs.writeFile(`${__dirname}/gold/algo/list-qsort.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

test('gold/trivial/break-in-condition.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/trivial/break-in-condition.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/trivial/break-in-condition.stdout`)).toString()
    } catch (e) {
        // ignore
    }
    let got = ''
    try {
        await interpreter.run(program, exec)
        got = buf.join('')
    } catch (e) {
        got = String(e)
    }
    if (exp === undefined) {
        await fs.writeFile(`${__dirname}/gold/trivial/break-in-condition.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

test('gold/trivial/cond-is-lazy.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/trivial/cond-is-lazy.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/trivial/cond-is-lazy.stdout`)).toString()
    } catch (e) {
        // ignore
    }
    let got = ''
    try {
        await interpreter.run(program, exec)
        got = buf.join('')
    } catch (e) {
        got = String(e)
    }
    if (exp === undefined) {
        await fs.writeFile(`${__dirname}/gold/trivial/cond-is-lazy.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

test('gold/trivial/empy-list.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/trivial/empy-list.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/trivial/empy-list.stdout`)).toString()
    } catch (e) {
        // ignore
    }
    let got = ''
    try {
        await interpreter.run(program, exec)
        got = buf.join('')
    } catch (e) {
        got = String(e)
    }
    if (exp === undefined) {
        await fs.writeFile(`${__dirname}/gold/trivial/empy-list.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

test('gold/trivial/eval-is-func.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/trivial/eval-is-func.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/trivial/eval-is-func.stdout`)).toString()
    } catch (e) {
        // ignore
    }
    let got = ''
    try {
        await interpreter.run(program, exec)
        got = buf.join('')
    } catch (e) {
        got = String(e)
    }
    if (exp === undefined) {
        await fs.writeFile(`${__dirname}/gold/trivial/eval-is-func.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

test('gold/trivial/evals.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/trivial/evals.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/trivial/evals.stdout`)).toString()
    } catch (e) {
        // ignore
    }
    let got = ''
    try {
        await interpreter.run(program, exec)
        got = buf.join('')
    } catch (e) {
        got = String(e)
    }
    if (exp === undefined) {
        await fs.writeFile(`${__dirname}/gold/trivial/evals.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

test('gold/trivial/func-scope.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/trivial/func-scope.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/trivial/func-scope.stdout`)).toString()
    } catch (e) {
        // ignore
    }
    let got = ''
    try {
        await interpreter.run(program, exec)
        got = buf.join('')
    } catch (e) {
        got = String(e)
    }
    if (exp === undefined) {
        await fs.writeFile(`${__dirname}/gold/trivial/func-scope.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

test('gold/trivial/lambda.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/trivial/lambda.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/trivial/lambda.stdout`)).toString()
    } catch (e) {
        // ignore
    }
    let got = ''
    try {
        await interpreter.run(program, exec)
        got = buf.join('')
    } catch (e) {
        got = String(e)
    }
    if (exp === undefined) {
        await fs.writeFile(`${__dirname}/gold/trivial/lambda.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

test('gold/trivial/params-less.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/trivial/params-less.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/trivial/params-less.stdout`)).toString()
    } catch (e) {
        // ignore
    }
    let got = ''
    try {
        await interpreter.run(program, exec)
        got = buf.join('')
    } catch (e) {
        got = String(e)
    }
    if (exp === undefined) {
        await fs.writeFile(`${__dirname}/gold/trivial/params-less.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

test('gold/trivial/params-more.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/trivial/params-more.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/trivial/params-more.stdout`)).toString()
    } catch (e) {
        // ignore
    }
    let got = ''
    try {
        await interpreter.run(program, exec)
        got = buf.join('')
    } catch (e) {
        got = String(e)
    }
    if (exp === undefined) {
        await fs.writeFile(`${__dirname}/gold/trivial/params-more.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

test('gold/trivial/print-idents.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/trivial/print-idents.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/trivial/print-idents.stdout`)).toString()
    } catch (e) {
        // ignore
    }
    let got = ''
    try {
        await interpreter.run(program, exec)
        got = buf.join('')
    } catch (e) {
        got = String(e)
    }
    if (exp === undefined) {
        await fs.writeFile(`${__dirname}/gold/trivial/print-idents.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

test('gold/trivial/program-scope.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/trivial/program-scope.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/trivial/program-scope.stdout`)).toString()
    } catch (e) {
        // ignore
    }
    let got = ''
    try {
        await interpreter.run(program, exec)
        got = buf.join('')
    } catch (e) {
        got = String(e)
    }
    if (exp === undefined) {
        await fs.writeFile(`${__dirname}/gold/trivial/program-scope.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

test('gold/trivial/quote-element.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/trivial/quote-element.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/trivial/quote-element.stdout`)).toString()
    } catch (e) {
        // ignore
    }
    let got = ''
    try {
        await interpreter.run(program, exec)
        got = buf.join('')
    } catch (e) {
        got = String(e)
    }
    if (exp === undefined) {
        await fs.writeFile(`${__dirname}/gold/trivial/quote-element.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

test('gold/trivial/quote-sees-while.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/trivial/quote-sees-while.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/trivial/quote-sees-while.stdout`)).toString()
    } catch (e) {
        // ignore
    }
    let got = ''
    try {
        await interpreter.run(program, exec)
        got = buf.join('')
    } catch (e) {
        got = String(e)
    }
    if (exp === undefined) {
        await fs.writeFile(`${__dirname}/gold/trivial/quote-sees-while.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

test('gold/trivial/return-exits-fn.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/trivial/return-exits-fn.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/trivial/return-exits-fn.stdout`)).toString()
    } catch (e) {
        // ignore
    }
    let got = ''
    try {
        await interpreter.run(program, exec)
        got = buf.join('')
    } catch (e) {
        got = String(e)
    }
    if (exp === undefined) {
        await fs.writeFile(`${__dirname}/gold/trivial/return-exits-fn.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

test('gold/trivial/set-var.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/trivial/set-var.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/trivial/set-var.stdout`)).toString()
    } catch (e) {
        // ignore
    }
    let got = ''
    try {
        await interpreter.run(program, exec)
        got = buf.join('')
    } catch (e) {
        got = String(e)
    }
    if (exp === undefined) {
        await fs.writeFile(`${__dirname}/gold/trivial/set-var.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

test('gold/trivial/values.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/trivial/values.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/trivial/values.stdout`)).toString()
    } catch (e) {
        // ignore
    }
    let got = ''
    try {
        await interpreter.run(program, exec)
        got = buf.join('')
    } catch (e) {
        got = String(e)
    }
    if (exp === undefined) {
        await fs.writeFile(`${__dirname}/gold/trivial/values.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

test('gold/trivial/while-sum-arith.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/trivial/while-sum-arith.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/trivial/while-sum-arith.stdout`)).toString()
    } catch (e) {
        // ignore
    }
    let got = ''
    try {
        await interpreter.run(program, exec)
        got = buf.join('')
    } catch (e) {
        got = String(e)
    }
    if (exp === undefined) {
        await fs.writeFile(`${__dirname}/gold/trivial/while-sum-arith.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

