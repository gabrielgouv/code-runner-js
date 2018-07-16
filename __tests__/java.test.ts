import 'jest'

import { ProcessWrapper } from '../src/runtime/process-wrapper';
import { JavaCompiler } from '../src/compilers/java-compiler';

const filePath = './__tests__/files/java'

// compile java file before tests
beforeAll((done) => {
    let command = "javac Test.java"
    let compiler = new ProcessWrapper(command, {
        currentDirectory: filePath
    })
    compiler.onFinish().subscribe((returnValue) => {
        expect(returnValue).toBe(0)
        done()
    })
})

test('run java file', () => {
    let command = "java Test"
    let input = 'Hello Java'
    let program = new ProcessWrapper(command, {
        currentDirectory: filePath
    })
    program.writeInput(input)
    program.onOutput().subscribe((data) => {
        expect(data.toString()).toBe(input)
    })
    program.onFinish().subscribe((returnValue) => {
        expect(returnValue).toBe(0)
    })
})

test('compile java file with errors', () => {
    let command = "javac Test_error.java"
    let program = new ProcessWrapper(command, {
        currentDirectory: filePath
    })
    program.onFinish().subscribe((returnValue) => {
        expect(returnValue).toBe(1)
    })
})

test('java compiler', () => {
    let input = 'Hello Java'
    let compiler = new JavaCompiler()
    compiler.run('Test.java', input).subscribe((output) => {
        expect(output.returnValue).toBe(0)
        expect(output.output).toBe(input)
        expect(typeof output.took).toBe('number')
    })
})
