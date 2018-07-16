import { ProcessWrapper } from "../runtime/process-wrapper";

export interface CompilerOutput {
    returnValue: number
    output: string
}

export abstract class Compiler {

    abstract run(fileName: string, input?: string): Promise<CompilerOutput>

    protected execute(command: string, directory: string, input?: string): Promise<CompilerOutput> {
        return new Promise((resolve) => {
            let outputMessage = ''
            let program = new ProcessWrapper(command, {
                currentDirectory: directory
            })
            if (input) {
                program.writeInput(input)
            }
            program.onOutput((output) => {
                outputMessage += output
            })
            program.onError((error) => {
                outputMessage += error
            })
            program.onClose((returnValue) => {
                resolve({
                    returnValue: returnValue,
                    output: outputMessage
                })
            })
        })
        
    }

}