import 'jest'
import { ProcessWrapper } from '../src/runtime/process-wrapper'
import { Compiler } from '../src/compiler/compiler'

const filePath = './__tests__/files/java'

// compile java file before tests
beforeAll((done) => {
    const command = 'javac Test.java'
    const compiler = new ProcessWrapper(command, {
        currentDirectory: filePath,
    })
    compiler.onFinish().subscribe((returnCode) => {
        expect(returnCode).toBe(0)
        done()
    })
})

test('run java file', (done) => {
    const command = 'java Test'
    const input = 'Hello Java'
    const program = new ProcessWrapper(command, {
        currentDirectory: filePath,
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
    const command = 'javac Test_error.java'
    const program = new ProcessWrapper(command, {
        currentDirectory: filePath,
    })
    program.onFinish().subscribe((returnCode) => {
        expect(returnCode).toBe(1)
        done()
    })
})

test('java compiler', (done) => {
    const input = 'Hello Java'
    const javaCompiler: Compiler = new Compiler('java')
    javaCompiler.putVariable('fileName', 'Test.java')
    javaCompiler.putVariable('compiledFileName', 'Test')
    javaCompiler.onInputRequested(input)
    javaCompiler.execute().subscribe((output) => {
        expect(output.returnCode).toBe(0)
        expect(output.output).toBe(input)
        expect(typeof output.took).toBe('number')
        done()
    })

})
