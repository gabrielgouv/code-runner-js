import { ProcessWrapper } from "../runtime/process-wrapper";
import { Compiler, CompilerOutput } from "./compiler";
import { isFileType, removeFileExtension } from "../utils/file-utils"
import { lang } from "../common/langs";
import { Observable, Observer } from 'rxjs';
import { fillString } from "../utils/string-utils";
import { CompilationError } from "../errors/compilation-error";

export class JavaCompiler extends Compiler {

    constructor(timeout?: number, directory?: string) {
        super(timeout, directory ? directory : lang.java.directory)
    }

    run(fileName: string, input: string): Observable<CompilerOutput> {
        return Observable.create((observer: Observer<CompilerOutput>) => {
            if (isFileType(fileName, lang.java.extension)) {

                let errorOutput = ''
                let command = fillString(lang.java.compileCommand, fileName)
                let fileCompiler = new ProcessWrapper(command, {
                    currentDirectory: lang.java.directory
                })

                fileCompiler.onError().subscribe((error) => {
                    errorOutput += error
                })

                fileCompiler.onFinish().subscribe((returnValue) => {
                    if (returnValue === this.SUCCESS) {
                        command = fillString(lang.java.runCommand, removeFileExtension(fileName))
                        this.execute(command, input).subscribe((output) => {
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
            } else {
                observer.error(new CompilationError(`Failed to compile. Wrong file type: "${fileName}"`))
            }
        })  
    }

}