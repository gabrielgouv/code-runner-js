import 'jest'
import { ProcessWrapper } from '../src/runtime/process-wrapper'

test('create process', (done) => {
    const input = 'process created'
    const command = `printf "${input}"`
    const process = new ProcessWrapper(command)
    process.onOutput().subscribe((data) => {
        expect(data.toString()).toBe(input)
    })
    process.onFinish().subscribe((returnCode) => {
        expect(returnCode).toBe(0)
        done()
    })
})
