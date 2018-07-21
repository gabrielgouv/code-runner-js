export interface ICompilerOptions {
    name: string
    folder?: string
    compileCommand?: string
    runCommand?: string
    executionTimeout?: number
    variables?: Map<string, string | number | boolean>
    inputs?: string[]
}
