import 'jest'

import { ProcessWrapper } from '../src/runtime/process-wrapper';

test('create process', (done) => {
    let input = 'process created'
    let command = `printf "${input}"`
    let process = new ProcessWrapper(command)
    process.onOutput().subscribe((data) => {
        expect(data.toString()).toBe(input)
    })
    process.onFinish().subscribe((returnValue) => {
        expect(returnValue).toBe(0)
        done()
    })
})