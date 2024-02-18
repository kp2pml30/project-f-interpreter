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
    const program = await fs.readFile(`${__dirname}/gold/algo/quick-sort.lisp`)
    await interpreter.run(program.toString(), exec)
})

test('gold/trivial/params-less.lisp', async () => {
    const buf = Array.of<string>()
    const exec: interpreter.Execution = {
        async print(x: string) { buf.push(x) },
        shouldInterrupt() {
            return false
        },
    }
    const program = await fs.readFile(`${__dirname}/gold/trivial/params-less.lisp`)
    await interpreter.run(program.toString(), exec)
})

