import { Compiler, CompilerOutput } from "./compiler";
import { FileType } from "../enums/file-type";
import { isFileType } from "../utils/file-utils"
import { enviroment } from "../common/environment";
import { Observable, Observer } from "rxjs";
import { CompilationError } from "../errors/compilation-error";

export class PythonCompiler extends Compiler {

    private version: string = ''

    constructor(version?: string, timeout?: number, directory?: string) {
        super(timeout, directory ? directory : enviroment.directories.python)
        if (version) this.version = version
    }

    run(fileName: string, input: string): Observable<CompilerOutput> {
        return Observable.create((observer: Observer<CompilerOutput>) => {
            if (isFileType(fileName, FileType.PYTHON)) {
                this.execute(`python${this.version} ${fileName}`, input).subscribe((output) => {
                    observer.next(output)
                    observer.complete()
                })
            } else {
                observer.error(new CompilationError('Failed to compile'))
            }
        })  
    }
}