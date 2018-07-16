import { Compiler, CompilerOutput } from "./compiler";
import { FileType } from "../enums/file-type";
import { isFileType } from "../utils/file-utils"
import { enviroment } from "../common/environment";

export class PythonCompiler extends Compiler {

    private version: string = ''

    constructor(version?: string, timeout?: number, directory?: string) {
        super(timeout, directory ? directory : enviroment.directories.python)
        if (version) this.version = version
    }

    run(fileName: string, input: string): Promise<CompilerOutput> {
        return new Promise((resolve) => {
            if (isFileType(fileName, FileType.PYTHON)) {
                this.execute(`python${this.version} ${fileName}`, input).then((output) => {
                    resolve(output)
                })
            }
        })  
    }
}