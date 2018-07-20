export interface CompilerOptions {
    name: string
    executionTimeout?: number
    variables?: Map<string, string | number | boolean>
    inputs?: string[]
}