export interface ICompilerOptions {
    name: string
    executionTimeout?: number
    variables?: Map<string, string | number | boolean>
    inputs?: string[]
}
