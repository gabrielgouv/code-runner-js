export interface ProcessOptions {
    currentDirectory?: string
    environment?: any
    runInShell?: boolean | string
    windowsVerbatimArguments?: boolean
    hideConsoleOnWindows?: boolean
    executionTimeout?: number
}