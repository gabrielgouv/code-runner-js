import 'jest'

import { ProcessWrapper } from '../src/runtime/process-wrapper'

const filePath = './__tests__/files/php'

test('run php file', (done) => {
    const command = 'php Test.php'
    const input = 'Hello PHP'
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
