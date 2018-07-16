import 'jest'

import { ProcessWrapper } from '../src/runtime/process-wrapper';

const filePath = './__tests__/files/python3'

test('run python3 file', () => {
    let command = "python3 Test.py"
    let input = 'Hello Python 3'
    let program = new ProcessWrapper(command, {
        currentDirectory: filePath
    })
    program.writeInput(input)
    program.onOutput((data: string) => {
        expect(data).toBe(input)
    })
    program.onClose((value: number) => {
        expect(value).toBe(0)
    })
})