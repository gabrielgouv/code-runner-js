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

    /**
     * Defines the execution timeout for the process. This can prevents a infinite loop process.
     * @param value - Timeout value.
     */
    public executionTimeout(value: number): void {
        this.configs.executionTimeout = value
    }

    /**
     * Puts a variable in the compiler.
     * @param name - Variable name.
     * @param value - Variable value.
     */
    public putVariable(name: string, value: string | number | boolean): void {
        this.configs.variables = this.configs.variables ? this.configs.variables : new Map()
        if (name.trim().length > 0) {
            this.configs.variables.set(name.trim(), value.toString())
        }
    }

    /**
     * When an input is requested at runtime, this method is called.
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

    /**
     * Loads the 'compilers.json' file and gets the specific compiler object by name.
     */
    private loadCompiler(): Observable<any> {
        return new CompilerLoader(this.configs.name).getCompiler()
    }

    /**
     * Compiles and run the file. If compilation is successful, the file is run.
     * @param observer - Receives an observer reference from {@link execute} method.
     */
    private compileAndRun(observer: Observer<ICompilerOutput>): void {
        this.compile().subscribe((compileOutput) => {
            if (compileOutput.returnCode === this.SUCCESS_CODE) {
                this.run(this.configs.runCommand!).subscribe((runOutput) => {
                    observer.next(runOutput)
                    observer.complete()
                }, (error) => {
                    observer.error(error)
                })
            } else {
                if (!this.configs.runCommand) {
                    observer.error(new CompilationError('Command to run not found.'))
                } else if (compileOutput.returnCode !== 0) {
                    observer.next(compileOutput)
                    observer.complete()
                } else {
                    observer.error(new CompilationError('Failed to compile.'))
                }
            }
        })
    }

    /**
     * Compiles file using the compileCommand. If compileCommand is not defined file compile is skipped.
     */
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

    /**
     * Runs the process and on finish returns data (data),
     * return code (returnCode) and time taken in execution in milliseconds (took).
     * @param inputs - Array of inputs. Passed to the process when an input is requested.
     */
    private run(command: string): Observable<ICompilerOutput> {
        return Observable.create((observer: Observer<ICompilerOutput>) => {
            let result = ''

            if (!command) {
                observer.error(new CompilationError(
                    'Failed to execute a command. Verify that the command to run or compile is configured.'))
            }

            command = this.configureCommand(command)

            const proc = new ProcessWrapper(command, {
                currentDirectory: this.configs.folder,
                executionTimeout: this.configs.executionTimeout,
            })

            const started = process.hrtime()

            if (this.configs.inputs && this.configs.inputs.length > 0) {
                proc.writeInput(...this.configs.inputs)
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

    /**
     * Replaces variables in command string to their values.
     * @param command - Command string.
     */
    private configureCommand(command: string): string {
        const commandBuilder = new CommandBuilder(command)
        this.configs.variables = this.configs.variables ? this.configs.variables : new Map()
        commandBuilder.putVariables(this.configs.variables)

        return commandBuilder.buildCommand()
    }

    /**
     * Merges options between 'compilers.json' options file and passed options in constructor.
     * @param compiler - The specific compiler object from 'compilers.json' file.
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
