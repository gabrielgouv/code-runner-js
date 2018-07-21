import 'jest'
import { ProcessWrapper } from '../src/runtime/process-wrapper'

const filePath = './__tests__/files/bash'

test('run bash file', (done) => {
    const command = 'sh Test.sh'
    const input = 'Hello Bash'
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

test('run bash file with infinite loop', () => {
    const command = 'sh Test_infinite_loop.sh'
    const program = new ProcessWrapper(command, {
        currentDirectory: filePath,
        executionTimeout: 300, // limit execution time
    })
    program.onFinish().subscribe((returnCode) => {
        expect(returnCode).toBe(null)
    })
})
