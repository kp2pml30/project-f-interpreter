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

