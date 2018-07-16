import { ProcessWrapper } from "../process-wrapper";
import { Compiler } from "./compiler";
import { FileType } from "../enums/file-type";
import { isFileType, getOnlyNameFromFile } from "../utils/file-utils"
import { enviroment } from "../common/environment";
import { CompilerOutput } from "./compiler-output";
import { CompilationError } from "../errors/compilation-error";

export class JavaCompiler extends Compiler {

    execute(fileName: string, input: string): Promise<CompilerOutput> {
        return new Promise((resolve, reject) => {
            if (isFileType(fileName, FileType.JAVA)) {

                let compiler = new ProcessWrapper(`javac ${fileName}`, {
                    currentDirectory: enviroment.directories.java
                })

                compiler.onClose((returnValue) => {
                    if (returnValue === 0) {
                        let outputMessage = ''
                        let program = new ProcessWrapper(`java ${getOnlyNameFromFile(fileName)}`, {
                            currentDirectory: enviroment.directories.java
                        })
                        if (input) {
                            program.writeInput(input)
                        }
                        program.onOutput((output) => {
                            outputMessage += output
                        })
                        program.onError((error) => {
                            outputMessage += error
                        })
                        program.onClose((returnValue) => {
                            resolve({
                                returnValue: returnValue,
                                output: outputMessage
                            })
                        })
                    } else {
                        reject(new CompilationError('Failed to compile'))
                    }
                })
            }
        })
        
    }

}