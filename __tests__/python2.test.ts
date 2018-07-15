import 'jest'

import { ProcessWrapper } from '../src/process-wrapper';

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
    program.onClose((value: number) => {
        expect(value).toBe(0)
    })
})