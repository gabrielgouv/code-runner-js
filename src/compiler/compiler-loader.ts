import { Observable, Observer, from } from 'rxjs'
import { IncompatibleAttributeError } from '../errors/incompatible-attribute-error'
import { IncompatibleTypeError } from '../errors/incompatible-type-error'

export class CompilerLoader {

    private readonly fileName: string = 'compilers.json'

    constructor(private name: string) {

    }

    public getCompiler(): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            from(import(`${process.cwd()}/${this.fileName}`)).subscribe((compilers) => {
                const compiler = compilers[this.name]

                if (!compiler) {
                    observer.error(`Cannot find '${this.name}' in '${this.fileName}' file`)
                }

                this.validateAttributes(compiler, observer)
                observer.next(compiler)
                observer.complete()
            }, (error) => {
                if (error instanceof SyntaxError) {
                    observer.error(
                        new SyntaxError(`It looks like the '${this.name}' file is not formatted correctly. ${error}`))
                } else {
                    observer.next(undefined)
                    observer.complete()
                }
            })
        })
    }

    private validateAttributes(compiler: any, observer: Observer<any>): void {
        if (compiler.name && typeof compiler.name !== 'string') {
            observer.error(new IncompatibleTypeError(
                `The 'name' attribute must be of type string. Type: ${typeof compiler.name}`))
        } else if (compiler.folder && typeof compiler.folder !== 'string') {
            observer.error(new IncompatibleTypeError(
                `The 'folder' attribute must be of type string. Type: ${typeof compiler.folder}`))
        } else if (compiler.compileCommand && typeof compiler.compileCommand !== 'string') {
            observer.error(new IncompatibleTypeError(
                `The 'compileCommand' attribute must be of type string. Type: ${typeof compiler.compileCommand}`))
        } else if (compiler.runCommand && typeof compiler.runCommand !== 'string') {
            observer.error(new IncompatibleTypeError(
                `The 'runCommand' attribute must be of type string. Type: ${typeof compiler.runCommand}`))
        } else if (compiler.executionTimeout && typeof compiler.executionTimeout !== 'number') {
            observer.error(new IncompatibleTypeError(
                `The 'executionTimeout' attribute must be of type number. Type: ${typeof compiler.executionTimeout}`))
        } else if (compiler.variables) {
            observer.error(new IncompatibleAttributeError(
                `The 'variables' attribute cannot be passed in the file '${this.fileName}'`))
        } else if (compiler.inputs && typeof compiler.inputs !== 'object') {
            observer.error(new IncompatibleTypeError(
                `The 'inputs' attribute must be of type array. Type: ${typeof compiler.inputs}`))
        }
    }

}
