import 'jest'

import { ProcessWrapper } from '../src/process-wrapper';

const filePath = './__tests__/files/java'

// compile java file before tests
beforeAll((done) => {
    let command = "javac Test.java"
    let compiler = new ProcessWrapper(command, {
        directory: filePath,
        useShell: true
    })
    compiler.onClose((value: number) => {
        expect(value).toBe(0)
        done()
    })
})

test('run java file', () => {
    let command = "java Test"
    let input = 'Hello Java'
    let program = new ProcessWrapper(command, {
        directory: filePath,
        useShell: true
    })
    program.writeInput(input)
    program.onOutput((data: string) => {
        expect(data).toBe(input)
    })
    program.onClose((value: number) => {
        expect(value).toBe(0)
    })
})

afterAll(() => {
    // TODO: remove .class file
})