import { ICompilerConfigs } from './compiler-configs'
import { ICompilerOptions } from './compiler-options'

export class CompilerConfigsParser {

    constructor(private configs: ICompilerConfigs) {
    }

    public fromString(name: string): ICompilerConfigs {
        return this.configs = {
            compilerName: name,
            inputs: [],
            variables: new Map(),
        }
    }

    public fromCompilerOptions(compilerOptions: ICompilerOptions): ICompilerConfigs {
        return this.configs = {
            compilerName: compilerOptions.name,
            executionTimeout: compilerOptions.executionTimeout,
            inputs: compilerOptions.inputs ? compilerOptions.inputs : [],
            variables: compilerOptions.variables ? compilerOptions.variables : new Map(),
        }
    }

}
