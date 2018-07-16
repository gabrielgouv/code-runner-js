import { ProcessWrapper } from "../runtime/process-wrapper";
import { Compiler, CompilerOutput } from "./compiler";
import { FileType } from "../enums/file-type";
import { isFileType, removeFileExtension } from "../utils/file-utils"
import { enviroment } from "../common/environment";

export class JavaCompiler extends Compiler {

    constructor(timeout?: number, directory?: string) {
        super(timeout, directory ? directory : enviroment.directories.java)
    }

    run(fileName: string, input: string): Promise<CompilerOutput> {
        return new Promise((resolve) => {
            if (isFileType(fileName, FileType.JAVA)) {
                let errorOutput = ''
                let fileCompiler = new ProcessWrapper(`javac ${fileName}`, {
                    currentDirectory: enviroment.directories.java
                })
                fileCompiler.onError((error) => {
                    errorOutput += error
                })
                fileCompiler.onFinish((returnValue) => {
                    if (returnValue === 0) {
                        this.execute(`java ${removeFileExtension(fileName)}`, input).then((output) => {
                            resolve(output)
                        })
                    } else {
                        resolve({
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