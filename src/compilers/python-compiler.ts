import { Compiler, CompilerOutput } from "./compiler";
import { isFileType } from "../utils/file-utils"
import { lang } from "../common/langs";
import { Observable, Observer } from "rxjs";
import { CompilationError } from "../errors/compilation-error";
import { fillString } from "../utils/string-utils";

export class PythonCompiler extends Compiler {

    private version: string = ''

    constructor(version?: string, timeout?: number, directory?: string) {
        super(timeout, directory ? directory : lang.python.directory)
        if (version) this.version = version
    }

    run(fileName: string, input: string): Observable<CompilerOutput> {
        return Observable.create((observer: Observer<CompilerOutput>) => {
            if (isFileType(fileName, lang.python.extension)) {
                let command = fillString(lang.python.runCommand, this.version, fileName)
                this.execute(command, input).subscribe((output) => {
                    observer.next(output)
                    observer.complete()
                })
            } else {
                observer.error(new CompilationError(`Failed to compile. Wrong file type: "${fileName}"`))
            }
        })  
    }



}