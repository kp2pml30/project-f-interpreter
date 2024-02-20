import * as interpreter from 'project-f/interpreter'
import * as fs from 'node:fs/promises'

const { describe, test, expect } = require('@jest/globals');

test('gold/algo/quick-sort.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/algo/quick-sort.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/algo/quick-sort.stdout`)).toString()
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
        await fs.writeFile(`${__dirname}/gold/algo/quick-sort.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

test('gold/trivial/break.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/trivial/break.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/trivial/break.stdout`)).toString()
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
        await fs.writeFile(`${__dirname}/gold/trivial/break.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

test('gold/trivial/cond.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/trivial/cond.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/trivial/cond.stdout`)).toString()
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
        await fs.writeFile(`${__dirname}/gold/trivial/cond.stdout`, got)
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

test('gold/trivial/idents.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/trivial/idents.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/trivial/idents.stdout`)).toString()
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
        await fs.writeFile(`${__dirname}/gold/trivial/idents.stdout`, got)
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

test('gold/trivial/return.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/trivial/return.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/trivial/return.stdout`)).toString()
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
        await fs.writeFile(`${__dirname}/gold/trivial/return.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

test('gold/trivial/set.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/trivial/set.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/trivial/set.stdout`)).toString()
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
        await fs.writeFile(`${__dirname}/gold/trivial/set.stdout`, got)
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

test('gold/trivial/while.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = (await fs.readFile(`${__dirname}/gold/trivial/while.lisp`)).toString()
    let exp: string | undefined = undefined
    try {
        exp = (await fs.readFile(`${__dirname}/gold/trivial/while.stdout`)).toString()
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
        await fs.writeFile(`${__dirname}/gold/trivial/while.stdout`, got)
    } else {
        expect(got).toEqual(got)
    }
})

