import { ProcessWrapper } from "../runtime/process-wrapper";
import { Observable, Observer, from } from "rxjs";
import { CompilerOptions } from "./compiler-options";
import { CompilationError } from "../errors/compilation-error";
import { CommandBuilder } from "./command-builder";

export interface CompilerOutput {
    returnCode?: number
    output?: string
    took?: number
}

export class Compiler {
 
    public readonly SUCCESS_CODE: number = 0

    private options: CompilerOptions
    private customVariables: Map<string, string | number | boolean>
    private inputs: string[]

    constructor(private name: string, private variables?: Map<string, string | number | boolean>) {
        this.options = {}
        this.customVariables = new Map()
        this.inputs = []
    }

    private loadCompilersJSONFile(): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            from(import(`${process.cwd()}/compilers.json`)).subscribe((obj) => {
                observer.next(obj[this.name])
                observer.complete()
            }, (error) => {
                if (error instanceof SyntaxError) {
                    observer.error(new CompilationError('"compilers.json" file is malformated.\n' + error))
                } else {
                    observer.error(new CompilationError('"compilers.json" file not found. ' 
                    + 'Please create a "compilers.json" file in your project root.\n' + error))
                }
            })
        })
    }

    public executionTimeout(value: number): void {
        this.options.executionTimeout = value
    }

    public putVariable(name: string, value: string | number | boolean): void {
        if (name.trim().length > 0) {
            this.customVariables.set(name.trim(), value.toString())
        } 
    }

    public onInputRequested(...inputs: string[]): void {
        this.inputs = inputs
    }

    public execute(): Observable<CompilerOutput> {
        return Observable.create((observer: Observer<CompilerOutput>) => {
            this.configureDefaultOptions()
            this.loadCompilersJSONFile().subscribe((compilerJSON) => {
                this.options = this.optionsParser(compilerJSON)
                this.compileAndRun(observer)
            }, (error) => {
                observer.error(error)
            })
        })
    }

    private compileAndRun(observer: Observer<CompilerOutput>): void {
        this.compile().subscribe((output) => {
            if (output.returnCode === this.SUCCESS_CODE && this.options.runCommand) {
                this.run(...this.inputs).subscribe((output) => {
                    observer.next(output)
                    observer.complete()
                }, (error) => {
                    observer.error(error)
                })
            } else {
                if (!this.options.runCommand) {
                    observer.error(new CompilationError('runCommand not found.'))
                } else if (output.returnCode != 0) {
                    observer.next(output)
                    observer.complete()
                } else {
                    observer.error(new CompilationError('Failed to compile.'))
                }
            }
        })
    }

    private compile(): Observable<CompilerOutput> {
        return Observable.create((observer: Observer<CompilerOutput>) => {
            if (this.options.compileCommand) {
                this.run(this.options.compileCommand).subscribe((output) => {
                    observer.next(output)
                    observer.complete()
                }, (error) => {
                    observer.error(error)
                })
            } else {
                // No need to compile
                observer.next({
                    returnCode: this.SUCCESS_CODE
                })
                observer.complete()
            } 
        })
    }

    private run(...inputs: string[]): Observable<CompilerOutput> {
        return Observable.create((observer: Observer<CompilerOutput>) => {
            let result = ''
            let command = ''

            if (this.options.runCommand) {
                command = this.configureCommand(this.options.runCommand)
            } else {
                observer.error(new CompilationError('runCommand not found.'))
            }

            let proc = new ProcessWrapper(command, {
                currentDirectory: this.options.filePath,
                executionTimeout: this.options.executionTimeout
            })

            let started = process.hrtime()

            if (inputs.length > 0) {
                proc.writeInput(...inputs)
            }
            proc.onOutput().subscribe((output) => {
                result += output
            })
            proc.onError().subscribe((error) => {
                result += error
            })
            proc.onFinish().subscribe((returnCode) => {
                let took = process.hrtime(started)
                observer.next({
                    returnCode: returnCode,
                    output: result,
                    took: took[1]/1000000
                })
                observer.complete()
            })
        }) 
    }

    private configureCommand(command: string): string {
        let commandBuilder = new CommandBuilder(command)
        if (this.variables) {
            commandBuilder.putVariables(this.variables)
        } 
        commandBuilder.putVariables(this.customVariables)

        return commandBuilder.buildCommand()
    }

    private configureDefaultOptions(): void {
        this.options.filePath = this.options.filePath ? this.options.filePath : './'
    }

    private optionsParser(compilerJSON: any): CompilerOptions {
        let filePath: string = compilerJSON.filePath
        let executionTimeout: number = this.options.executionTimeout ? this.options.executionTimeout : compilerJSON.executionTimeout
        let compileCommand: string = compilerJSON.compileCommand
        let runCommand: string = compilerJSON.runCommand

        return {
            filePath,
            executionTimeout,
            compileCommand,
            runCommand
        }
    }

}