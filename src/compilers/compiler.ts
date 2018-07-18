import { ProcessWrapper } from "../runtime/process-wrapper";
import { Observable, Observer } from "rxjs";
import { CompilerOptions } from "./compiler-options";
import { fillString } from "../utils/string-utils";
import { CompilationError } from "../errors/compilation-error";
import { RequiredOptionsNotFoundError } from "../errors/required-options-not-found-error";

export interface CompilerOutput {
    returnValue?: number
    output?: string
    took?: number
}

export class Compiler {
 
    readonly SUCCESS: number = 0

    constructor(private options: CompilerOptions) {
        if (this.options.lang) {
            this.options = this.langParser(this.options.lang)
        }
        this.validateRequiredOptions()
    }

    public execute(input?: string): Observable<CompilerOutput> {
        return Observable.create((observer: Observer<CompilerOutput>) => {
            this.compile().subscribe((output) => {
                if (output.returnValue === this.SUCCESS && this.options.runCommand) {
                    this.run(this.options.runCommand, input).subscribe((output) => {
                        observer.next(output)
                        observer.complete()
                    })
                } else {
                    if (!this.options.runCommand) {
                        observer.error(new CompilationError('Command to run not configured.'))
                    } else if (output.returnValue != 0) {
                        observer.next(output)
                        observer.complete()
                    } else {
                        observer.error(new CompilationError('Failed to compile.'))
                    }
                    
                }
            })
        })
    }

    protected compile(): Observable<CompilerOutput> {
        return Observable.create((observer: Observer<CompilerOutput>) => {
            if (this.options.compileCommand) {
                this.run(this.options.compileCommand).subscribe((output) => {
                    if (output.returnValue === this.SUCCESS) {
                        observer.next(output)
                    } else {
                        observer.next(output)
                    }
                    observer.complete()
                })
            } else {
                // No need to compile
                observer.next({
                    returnValue: this.SUCCESS
                })
                observer.complete()
            } 
        })
    }

    protected run(command: string, input?: string): Observable<CompilerOutput> {
        return Observable.create((observer: Observer<CompilerOutput>) => {
            let result = ''

            let fileName = this.options.fileName ? this.options.fileName : ''
            let compiledFileName = this.options.compiledFileName ? this.options.compiledFileName : fileName

            command = fillString(
                command, 
                this.options.version ? this.options.version : '',
                this.options.fileName ? this.options.fileName : '', 
                this.options.compiledFileName ? compiledFileName : fileName
            )

            let proc = new ProcessWrapper(command, {
                currentDirectory: this.options.directory,
                executionTimeout: this.options.executionTimeout
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
                    took: (took[1]/1000000) + (this.options.executionTimeout ? this.options.executionTimeout : 0)
                })
                observer.complete()
            })
        })
        
    }

    private validateRequiredOptions(): void {
        if (!this.options.runCommand) {
            throw new RequiredOptionsNotFoundError('Option "runCommand" is required.')
        } else if (!this.options.fileName) {
            throw new RequiredOptionsNotFoundError('Option "fileName" is required.')
        }
    }

    private langParser(lang: any): CompilerOptions {

        let version: string = lang.version ? lang.version : this.options.version
        let directory: string = lang.directory ? lang.directory : this.options.directory
        let executionTimeout: number = lang.executionTimeout ? lang.executionTimeout : this.options.executionTimeout
        let fileName: string = lang.fileName ? lang.fileName : this.options.fileName
        let compiledFileName: string = lang.compiledFileName ? lang.compiledFileName : this.options.compiledFileName
        let compileCommand: string = lang.compileCommand ? lang.compileCommand : this.options.compileCommand
        let runCommand: string = lang.runCommand ? lang.runCommand : this.options.runCommand 

        return {
            version,
            directory,
            executionTimeout,
            fileName,
            compiledFileName,
            compileCommand,
            runCommand
        }

    }

}