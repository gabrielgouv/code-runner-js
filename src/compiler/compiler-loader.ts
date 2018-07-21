import { Observable, Observer, from } from 'rxjs'
import { IncompatibleAttributeError } from '../errors/incompatible-attribute-error'
import { IncompatibleTypeError } from '../errors/incompatible-type-error'

export class CompilerLoader {

    private readonly fileName: string = 'compilers.json'

    constructor(private name: string) {

    }

    /**
     * Gets compiler object from json file in project root folder.
     * The code below is an example of what the format of the json object can be:
     * <pre><code>
     * "name": {
     *    "folder" : "path/to/compiler/folder",
     *    "compileCommand": "compile {fileName}",
     *    "runCommand": "exec {compiledFileName}",
     *    "executionTimeout": 5000,
     *    "inputs": ["Hello", "World!"]
     * }
     * </code></pre>
     * Note where the name attribute is.
     * @param path - Path where file is. By default is root folder from project.
     */
    public getCompiler(path?: string): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            const root = path ? path : process.cwd()
            from(import(`${root}/${this.fileName}`)).subscribe((compilers) => {

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

    /**
     * Validates compiler object attributes from json file checking your types and allowed attributes.
     * Notes:
     * - By default name attribute cannot be passed inside json object because its is the object name;
     * - By default variables attribute cannot be passed inside json object.
     * @param compiler - Compiler object from json file.
     * @param observer - Observer reference.
     */
    private validateAttributes(compiler: any, observer: Observer<any>): void {
        if (!this.allowedAttributes(compiler)) {
            observer.error(new IncompatibleAttributeError(
                `Invalid attribute in '${this.fileName}'`))
        } else if (compiler.name && typeof compiler.name !== 'string') {
            observer.error(new IncompatibleAttributeError(
                `The 'name' cannot be passed as attribute in the file '${this.fileName}'`))
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

    /**
     * Defines the allowed attributes in compiler object from json file.
     * @param compiler - Compiler object from json file.
     */
    private allowedAttributes(compiler: any): boolean {
        return compiler.name || compiler.folder || compiler.compileCommand
            || compiler.runCommand || compiler.executionTimeout
            || compiler.variables || compiler.inputs
    }

}
