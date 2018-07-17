import { ProcessWrapper } from "../runtime/process-wrapper";
import { Observable, Observer } from "rxjs";

export interface CompilerOutput {
    returnValue: number
    output: string
    took: number
}

export abstract class Compiler {

    readonly SUCCESS: number = 0

    private directory: string = './'

    constructor(private timeout?: number, directory?: string) {
        if (directory) this.directory = directory
    }

    abstract run(fileName: string, input?: string): Observable<CompilerOutput>

    protected execute(command: string, input?: string): Observable<CompilerOutput> {
        return Observable.create((observer: Observer<CompilerOutput>) => {
            let result = ''
            let proc = new ProcessWrapper(command, {
                currentDirectory: this.directory,
                executionTimeout: this.timeout
            })

            let started = process.hrtime()

            if (input) {
                proc.writeInput(input)
            }
            proc.onOutput().subscribe((output) => {
                result += output
            })
            proc.onError().subscribe((error) => {
                result += error
            })
            proc.onFinish().subscribe((returnValue) => {
                let took = process.hrtime(started)
                observer.next({
                    returnValue: returnValue,
                    output: result,
                    took: took[1]/1000000
                })
                observer.complete()
            })
        })
        
    }

}