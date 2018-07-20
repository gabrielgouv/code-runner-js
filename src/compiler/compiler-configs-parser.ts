import { CompilerConfigs } from "./compiler-configs";
import { CompilerOptions } from "./compiler-options";

export class CompilerConfigsParser {

    constructor(private configs: CompilerConfigs) {
        
    }

    public stringParser(name: string): CompilerConfigs {
        return this.configs = {
            compilerName: name,
            variables: new Map,
            inputs: []
        }
    }

    public compilerOptionsParser(compilerOptions: CompilerOptions): CompilerConfigs {
        return this.configs = {
            compilerName: compilerOptions.name,
            executionTimeout: compilerOptions.executionTimeout,
            variables: compilerOptions.variables ? compilerOptions.variables : new Map(),
            inputs: compilerOptions.inputs ? compilerOptions.inputs : []
        }
        
    }

}