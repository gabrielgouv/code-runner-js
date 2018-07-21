import { CompilationError } from '../errors/compilation-error'
import { CommandBuilder } from './command-builder'
import { ICompilerOptions } from './compiler-options'
import { CompilerLoader } from './compiler-loader'
import { Observable, Observer } from 'rxjs'
import { ProcessWrapper } from '../runtime/process-wrapper'
import { isCompilerOptions } from '../utils/type-guards'

export interface ICompilerOutput {
    returnCode?: number
    data?: string
    took?: number
}

export class Compiler {

    public readonly SUCCESS_CODE: number = 0

    private configs!: ICompilerOptions

    constructor(obj: string | ICompilerOptions) {
        if (isCompilerOptions(obj)) {
            this.configs = obj
        } else {
            this.configs = {
                name: obj,
            }
        }
    }

    public executionTimeout(value: number): void {
        this.configs.executionTimeout = value
    }

    public putVariable(name: string, value: string | number | boolean): void {
        this.configs.variables = this.configs.variables ? this.configs.variables : new Map()
        if (name.trim().length > 0) {
            this.configs.variables.set(name.trim(), value.toString())
        }
    }

    /**
     * When an input is requested at runtime, this method is called
     * @param inputs - Input lines.
     */
    public onInputRequested(...inputs: string[]): void {
        this.configs.inputs = inputs
    }

    /**
     * Starts the compiler.
     */
    public execute(): Observable<ICompilerOutput> {
        return Observable.create((observer: Observer<ICompilerOutput>) => {
            this.loadCompiler().subscribe((compiler) => {
                if (compiler !== undefined) {
                    this.mergeOptions(compiler)
                    this.compileAndRun(observer)
                } else {
                    this.compileAndRun(observer)
                }
            }, (error) => {
                observer.error(error)
            })
        })
    }

    private loadCompiler(): Observable<any> {
        return new CompilerLoader(this.configs.name).getCompiler()
    }

    private compileAndRun(observer: Observer<ICompilerOutput>): void {
        this.compile().subscribe((compileOutput) => {
            if (compileOutput.returnCode === this.SUCCESS_CODE) {
                const inputs = this.configs.inputs ? this.configs.inputs : []
                this.run(...inputs).subscribe((runOutput) => {
                    observer.next(runOutput)
                    observer.complete()
                }, (error) => {
                    observer.error(error)
                })
            } else {
                if (!this.configs.runCommand) {
                    observer.error(new CompilationError('runCommand not found.'))
                } else if (compileOutput.returnCode !== 0) {
                    observer.next(compileOutput)
                    observer.complete()
                } else {
                    observer.error(new CompilationError('Failed to compile.'))
                }
            }
        })
    }

    private compile(): Observable<ICompilerOutput> {
        return Observable.create((observer: Observer<ICompilerOutput>) => {
            if (this.configs.compileCommand) {
                // Compile
                this.run(this.configs.compileCommand).subscribe((output) => {
                    observer.next(output)
                    observer.complete()
                }, (error) => {
                    observer.error(error)
                })
            } else {
                // No need to compile
                observer.next({
                    returnCode: this.SUCCESS_CODE,
                })
                observer.complete()
            }
        })
    }

    private run(...inputs: string[]): Observable<ICompilerOutput> {
        return Observable.create((observer: Observer<ICompilerOutput>) => {
            let result = ''
            let command = ''

            if (this.configs.runCommand) {
                command = this.configureCommand(this.configs.runCommand)
            } else {
                observer.error(new CompilationError('runCommand not found.'))
            }

            const proc = new ProcessWrapper(command, {
                currentDirectory: this.configs.folder,
                executionTimeout: this.configs.executionTimeout,
            })

            const started = process.hrtime()

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
                const took = process.hrtime(started)
                observer.next({
                    data: result,
                    returnCode,
                    took: took[1] / 1000000,
                })
                observer.complete()
            })
        })
    }

    private configureCommand(command: string): string {
        const commandBuilder = new CommandBuilder(command)
        this.configs.variables = this.configs.variables ? this.configs.variables : new Map()
        commandBuilder.putVariables(this.configs.variables)

        return commandBuilder.buildCommand()
    }

    /**
     * Merges options between 'compilers.json' options file and passed options in constructor
     * @param compiler - The specific compiler object from compilers.json file
     */
    private mergeOptions(compiler: any): void {
        this.configs.folder = this.configs.folder ? this.configs.folder : compiler.folder
        this.configs.executionTimeout = this.configs.executionTimeout ?
            this.configs.executionTimeout : compiler.executionTimeout
        this.configs.compileCommand = this.configs.compileCommand ?
            this.configs.compileCommand : compiler.compileCommand
        this.configs.runCommand = this.configs.runCommand ? this.configs.runCommand : compiler.runCommand
        this.configs.inputs = this.configs.inputs ? this.configs.inputs : compiler.variables
    }

}
