import 'jest'

import { ProcessWrapper } from '../src/runtime/process-wrapper';

const filePath = './__tests__/files/bash'

test('run bash file', () => {
    let command = "sh Test.sh"
    let input = 'Hello Bash'
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

test('run bash file with infinite loop', () => {
    let command = "sh Test_infinite_loop.sh"
    let program = new ProcessWrapper(command, {
        currentDirectory: filePath,
        executionTimeout: 1000 // limit execution time
    })
    program.onFinish((returnValue: number) => {
        expect(returnValue).toBe(null)
    })
})
