import 'jest'

import { ProcessWrapper } from '../src/runtime/process-wrapper';
import { Compiler } from "../src/compiler/compiler";

const filePath = './__tests__/files/python'

test('run python2 file', (done) => {
    let command = "python2 Test_python2.py"
    let input = 'Hello Python 2'
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

test('run python3 file', (done) => {
    let command = "python3 Test_python3.py"
    let input = 'Hello Python 3'
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

test('python 2 compiler', (done) => {
    let input = 'Hello Python 2'
    let compiler: Compiler = new Compiler('python')
    compiler.putVariable('version', '2')
    compiler.putVariable('fileName', 'Test_python2.py')
    compiler.onInputRequested(input)
    compiler.execute().subscribe((output) => {
        expect(output.returnCode).toBe(0)
        expect(output.output).toBe(input)
        expect(typeof output.took).toBe('number')
        done()
    })
})

test('python 3 compiler', (done) => {
    let input = 'Hello Python 3'
    let compiler: Compiler = new Compiler('python')
    compiler.putVariable('version', '3')
    compiler.putVariable('fileName', 'Test_python3.py')
    compiler.onInputRequested(input)
    compiler.execute().subscribe((output) => {
        expect(output.returnCode).toBe(0)
        expect(output.output).toBe(input)
        expect(typeof output.took).toBe('number')
        done()
    })
})
