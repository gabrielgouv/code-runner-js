import 'jest'

import { ProcessWrapper } from '../src/runtime/process-wrapper';
import { PythonCompiler } from "../src/compilers/python-compiler";

const filePath = './__tests__/files/python2'

test('run python2 file', () => {
    let command = "python2 Test.py"
    let input = 'Hello Python 2'
    let program = new ProcessWrapper(command, {
        currentDirectory: filePath
    })
    program.writeInput(input)
    program.onOutput((data: string) => {
        expect(data).toBe(input)
    })
    program.onFinish((returnValue: number) => {
        expect(returnValue).toBe(0)
    })
})

test('python 2 compiler', () => {
    let input = 'Hello Python 2'
    let compiler = new PythonCompiler('2')
    compiler.run('Test.py', input).then((output) => {
        expect(output.returnValue).toBe(0)
        expect(output.output).toBe(input)
        expect(typeof output.took).toBe('number')
    })
})