import 'jest'

import { ProcessWrapper } from '../src/process-wrapper';

const filePath = './__tests__/files/php'

test('run php file', () => {
    let command = "php Test.php"
    let input = 'Hello PHP'
    let program = new ProcessWrapper(command, {
        directory: filePath
    })
    program.writeInput(input)
    program.onOutput((data: string) => {
        expect(data).toBe(input)
    })
    program.onClose((value: number) => {
        expect(value).toBe(0)
    })
})