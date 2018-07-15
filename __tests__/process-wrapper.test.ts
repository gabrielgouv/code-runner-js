import 'jest'

import { ProcessWrapper } from '../src/process-wrapper';

test('create process', () => {
    let textToPrint = 'process created'
    let command = `printf "${textToPrint}"`
    let process = new ProcessWrapper(command, {
        useShell: true
    })
    process.onOutput((output: string) => {
        expect(output).toBe(textToPrint)
    })
    process.onClose((value: number) => {
        expect(value).toBe(0)
    })
})