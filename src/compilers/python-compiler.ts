import { Compiler, CompilerOutput } from "./compiler";
import { FileType } from "../enums/file-type";
import { isFileType } from "../utils/file-utils"
import { enviroment } from "../common/environment";

export class PythonCompiler extends Compiler {

    constructor(private version: string, timeout?: number) {
        super(timeout)
    }

    run(fileName: string, input: string): Promise<CompilerOutput> {
        return new Promise((resolve) => {
            if (isFileType(fileName, FileType.PYTHON)) {
                let env = enviroment.directories.python2
                if (this.version.startsWith('3')) {
                    env = enviroment.directories.python3
                }
                this.execute(`python${this.version} ${fileName}`, env, input).then((output) => {
                    resolve(output)
                })
            }
        })  
    }
}