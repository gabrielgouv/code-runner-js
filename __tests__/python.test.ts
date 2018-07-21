import 'jest'
import { ProcessWrapper } from '../src/runtime/process-wrapper'
import { Compiler } from '../src/compiler/compiler'

const filePath = './__tests__/files/python'

test('run python2 file', (done) => {
    const command = 'python2 Test_python2.py'
    const input = 'Hello Python 2'
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

test('run python3 file', (done) => {
    const command = 'python3 Test_python3.py'
    const input = 'Hello Python 3'
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

test('python 2 compiler', (done) => {
    const input = 'Hello Python 2'
    const compiler: Compiler = new Compiler('python')
    compiler.putVariable('version', '2')
    compiler.putVariable('fileName', 'Test_python2.py')
    compiler.onInputRequested(input)
    compiler.execute().subscribe((output) => {
        expect(output.returnCode).toBe(0)
        expect(output.data).toBe(input)
        expect(typeof output.took).toBe('number')
        done()
    })
})

test('python 3 compiler', (done) => {
    const input = 'Hello Python 3'
    const compiler: Compiler = new Compiler('python')
    compiler.putVariable('version', '3')
    compiler.putVariable('fileName', 'Test_python3.py')
    compiler.onInputRequested(input)
    compiler.execute().subscribe((output) => {
        console.log(output.data)
        expect(output.returnCode).toBe(0)
        expect(output.data).toBe(input)
        expect(typeof output.took).toBe('number')
        done()
    })
})
