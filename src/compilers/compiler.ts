import { ProcessWrapper } from "../runtime/process-wrapper";
import { Observable, Observer } from "rxjs";

export interface CompilerOutput {
    returnValue: number
    output: string
    took: number
}

export abstract class Compiler {

    private directory: string = './'

    constructor(private timeout?: number, directory?: string) {
        if (directory) this.directory = directory
    }

    abstract run(fileName: string, input?: string): Observable<CompilerOutput>

    protected execute(command: string, input?: string): Observable<CompilerOutput> {
        return Observable.create((observer: Observer<CompilerOutput>) => {
            let result = ''
            let program = new ProcessWrapper(command, {
                currentDirectory: this.directory,
                executionTimeout: this.timeout
            })

            let started = new Date().getTime()

            if (input) {
                program.writeInput(input)
            }
            program.onOutput().subscribe((output) => {
                result += output
            })
            program.onError().subscribe((error) => {
                result += error
            })
            program.onFinish().subscribe((returnValue) => {
                let took = new Date().getTime() - started
                observer.next({
                    returnValue: returnValue,
                    output: result,
                    took: took
                })
                observer.complete()
            })
        })
        
    }

}