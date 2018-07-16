import 'jest'

import { ProcessWrapper } from '../src/runtime/process-wrapper';

test('create process', () => {
    let textToPrint = 'process created'
    let command = `printf "${textToPrint}"`
    let process = new ProcessWrapper(command)
    process.onOutput((output: string) => {
        expect(output).toBe(textToPrint)
    })
    process.onClose((value: number) => {
        expect(value).toBe(0)
    })
})