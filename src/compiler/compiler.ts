import { ProcessWrapper } from "../runtime/process-wrapper";
import { Observable, Observer } from "rxjs";
import { CompilerOptions } from "./compiler-options";
import { CompilationError } from "../errors/compilation-error";
import { RequiredOptionsNotFoundError } from "../errors/required-options-not-found-error";
import { CommandBuilder } from "./command-builder";

export interface CompilerOutput {
    returnCode?: number
    output?: string
    took?: number
}

export class Compiler {
 
    public readonly SUCCESS_CODE: number = 0

    private customVariables: Map<string, string | number | boolean> = new Map()
    private inputs: string[] = []

    constructor(private options: CompilerOptions) {
        if (this.options.lang) {
            this.options = this.langParser(this.options.lang)
        }
        this.validateRequiredOptions()
        this.configureDefaultOptions()
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
            this.compile().subscribe((output) => {
                if (output.returnCode === this.SUCCESS_CODE && this.options.runCommand) {
                    this.run(this.options.runCommand, ...this.inputs).subscribe((output) => {
                        observer.next(output)
                        observer.complete()
                    })
                } else {
                    if (!this.options.runCommand) {
                        observer.error(new CompilationError('Command to run not configured.'))
                    } else if (output.returnCode != 0) {
                        observer.next(output)
                        observer.complete()
                    } else {
                        observer.error(new CompilationError('Failed to compile.'))
                    }
                    
                }
            })
        })
    }

    private compile(): Observable<CompilerOutput> {
        return Observable.create((observer: Observer<CompilerOutput>) => {
            if (this.options.compileCommand) {
                this.run(this.options.compileCommand).subscribe((output) => {
                    if (output.returnCode === this.SUCCESS_CODE) {
                        observer.next(output)
                    } else {
                        observer.next(output)
                    }
                    observer.complete()
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

    private run(command: string, ...inputs: string[]): Observable<CompilerOutput> {
        return Observable.create((observer: Observer<CompilerOutput>) => {
            let result = ''

            command = this.configureCommand(command)

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
                    took: (took[1]/1000000) + (this.options.executionTimeout ? this.options.executionTimeout : 0)
                })
                observer.complete()
            })
        })
        
    }

    private configureCommand(command: string): string {
        let commandBuilder = new CommandBuilder(command)
        commandBuilder.putVariables(this.customVariables)
        commandBuilder.putVariable('version', this.options.version)
        commandBuilder.putVariable('fileName', this.options.fileName)
        commandBuilder.putVariable('compiledFileName', this.options.compiledFileName)
        commandBuilder.putVariable('filePath', this.options.filePath)

        return commandBuilder.buildCommand()
    }

    private validateRequiredOptions(): void {
        if (!this.options.runCommand) {
            throw new RequiredOptionsNotFoundError('Option "runCommand" is required.')
        } else if (!this.options.fileName) {
            throw new RequiredOptionsNotFoundError('Option "fileName" is required.')
        }
    }

    private configureDefaultOptions(): void {
        this.options.filePath = this.options.filePath ? this.options.filePath : './'
        this.options.version = this.options.version ? this.options.version : ''
        this.options.compiledFileName = this.options.compiledFileName ? this.options.compiledFileName : this.options.fileName
    }

    private langParser(lang: any): CompilerOptions {

        let version: string = lang.version ? lang.version : this.options.version
        let filePath: string = lang.filePath ? lang.filePath : this.options.filePath
        let executionTimeout: number = lang.executionTimeout ? lang.executionTimeout : this.options.executionTimeout
        let fileName: string = lang.fileName ? lang.fileName : this.options.fileName
        let compiledFileName: string = lang.compiledFileName ? lang.compiledFileName : this.options.compiledFileName
        let compileCommand: string = lang.compileCommand ? lang.compileCommand : this.options.compileCommand
        let runCommand: string = lang.runCommand ? lang.runCommand : this.options.runCommand 

        return {
            version,
            filePath,
            executionTimeout,
            fileName,
            compiledFileName,
            compileCommand,
            runCommand
        }

    }

}