import 'jest'

import { ProcessWrapper } from '../src/runtime/process-wrapper';
import { Compiler } from '../src/compiler/compiler';
import { lang } from '../src/common/langs'

const filePath = './__tests__/files/java'

// compile java file before tests
beforeAll((done) => {
    let command = "javac Test.java"
    let compiler = new ProcessWrapper(command, {
        currentDirectory: filePath
    })
    compiler.onFinish().subscribe((returnCode) => {
        expect(returnCode).toBe(0)
        done()
    })
})

test('run java file', (done) => {
    let command = "java Test"
    let input = 'Hello Java'
    let program = new ProcessWrapper(command, {
        currentDirectory: filePath
    })
    program.writeInput(input)
    program.onOutput().subscribe((data) => {
        expect(data.toString()).toBe(input)
    })
    program.onFinish().subscribe((returnCode) => {
        expect(returnCode).toBe(0)
        done()
    })
})

test('compile java file with errors', (done) => {
    let command = "javac Test_error.java"
    let program = new ProcessWrapper(command, {
        currentDirectory: filePath
    })
    program.onFinish().subscribe((returnCode) => {
        expect(returnCode).toBe(1)
        done()
    })
})

test('java compiler', (done) => {
    let input = 'Hello Java'
    let javaCompiler: Compiler = new Compiler({
        lang: lang.java,
        fileName: 'Test.java',
        compiledFileName: 'Test'
    })
    javaCompiler.execute(input).subscribe((output) => {
        expect(output.returnCode).toBe(0)
        expect(output.output).toBe(input)
        expect(typeof output.took).toBe('number')
        done()
    })
})
