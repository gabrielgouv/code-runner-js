export interface ICompilerConfigs {
    compilerName: string,
    filePath?: string
    executionTimeout?: number
    compileCommand?: string
    runCommand?: string
    variables: Map<string, string | number | boolean>
    inputs: string[]
}
