import { ProcessWrapper } from "../runtime/process-wrapper";
import { Compiler, CompilerOutput } from "./compiler";
import { FileType } from "../enums/file-type";
import { isFileType, removeFileExtension } from "../utils/file-utils"
import { enviroment } from "../common/environment";

export class JavaCompiler extends Compiler {

    constructor(timeout?: number) {
        super(timeout)
    }

    run(fileName: string, input: string): Promise<CompilerOutput> {
        return new Promise((resolve) => {
            if (isFileType(fileName, FileType.JAVA)) {

                let errorOutput = ''

                let compiler = new ProcessWrapper(`javac ${fileName}`, {
                    currentDirectory: enviroment.directories.java
                })

                compiler.onError((error) => {
                    errorOutput += error
                })

                compiler.onFinish((returnValue) => {
                    if (returnValue === 0) {
                        let env = enviroment.directories.java
                        this.execute(`java ${removeFileExtension(fileName)}`, env, input).then((output) => {
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