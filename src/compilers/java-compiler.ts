import { ProcessWrapper } from "../runtime/process-wrapper";
import { Compiler, CompilerOutput } from "./compiler";
import { FileType } from "../enums/file-type";
import { isFileType, removeFileExtension } from "../utils/file-utils"
import { enviroment } from "../common/environment";
import { Observable, Observer } from 'rxjs';

export class JavaCompiler extends Compiler {

    constructor(timeout?: number, directory?: string) {
        super(timeout, directory ? directory : enviroment.directories.java)
    }

    run(fileName: string, input: string): Observable<CompilerOutput> {
        return Observable.create((observer: Observer<CompilerOutput>) => {
            if (isFileType(fileName, FileType.JAVA)) {
                let errorOutput = ''
                let fileCompiler = new ProcessWrapper(`javac ${fileName}`, {
                    currentDirectory: enviroment.directories.java
                })
                fileCompiler.onError().subscribe((error) => {
                    errorOutput += error
                })

                fileCompiler.onFinish().subscribe((returnValue) => {
                    if (returnValue === 0) {
                        this.execute(`java ${removeFileExtension(fileName)}`, input).subscribe((output) => {
                            observer.next(output)
                            observer.complete()
                        })
                    } else {
                        observer.error({
                            output: errorOutput,
                            returnValue: returnValue,
                            took: 0
                        })
                    }
                })
            }
        })  
    }

}