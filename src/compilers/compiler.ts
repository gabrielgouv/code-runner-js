import { ProcessWrapper } from "../runtime/process-wrapper";

export interface CompilerOutput {
    returnValue: number
    output: string
    took: number
}

export abstract class Compiler {

    constructor(private timeout?: number) {
        
    }

    abstract run(fileName: string, input?: string): Promise<CompilerOutput>

    protected execute(command: string, directory: string, input?: string): Promise<CompilerOutput> {
        return new Promise((resolve) => {
            let result = ''
            let program = new ProcessWrapper(command, {
                currentDirectory: directory,
                executionTimeout: this.timeout
            })

            let started = new Date().getTime()

            if (input) {
                program.writeInput(input)
            }
            program.onOutput((output) => {
                result += output
            })
            program.onError((error) => {
                result += error
            })
            program.onFinish((returnValue) => {
                let took = new Date().getTime() - started
                resolve({
                    returnValue: returnValue,
                    output: result,
                    took: took
                })
            })
        })
        
    }

}