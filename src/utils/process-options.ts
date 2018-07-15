export interface ProcessOptions {
    argv0?: string
    directory?: string
    env?: any
    stdio?: any
    detached?: boolean
    uid?: number
    gid?: number
    useShell?: boolean | string
    windowsVerbatimArguments?: boolean
    windowsHide?: boolean
    executionLimit?: number
}