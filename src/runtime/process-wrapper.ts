import { spawn, ChildProcess, SpawnOptions } from 'child_process'
import kill from 'tree-kill';

import { ProcessOptions } from '../utils/process-options'
import { ProcessNotStartedError } from '../errors/process-not-started-error';

export class ProcessWrapper {

    private childProcess: ChildProcess
    private timeout: any

    constructor(private command: string, options?: ProcessOptions) {
        this.childProcess = this.createProcess(options)
        this.cleanupOnExit()
    }

    getProcess(): ChildProcess {
        return this.childProcess
    }

    writeInput(value: string): void {
        this.childProcess.stdin.write(value.trim())
        this.childProcess.stdin.end()
    }

    onOutput(callback: (output: string) => void): void {
        if (this.childProcess) {
            this.childProcess.stdout.on('data', (output: any) => {
                callback(output.toString('utf8'))
            })
        } else {
            throw new ProcessNotStartedError()
        }
    }

    onError(callback: (error: string) => void): void {
        if (this.childProcess) {
            this.childProcess.stderr.on('data', callback)
        } else {
            throw new ProcessNotStartedError()
        }
    }

    onClose(callback: (returnValue: number) => void): void {
        if (this.childProcess) {
            this.childProcess.on('close', callback)
        } else {
            throw new ProcessNotStartedError()
        }
    }

    private createProcess(options?: ProcessOptions): ChildProcess {
        if (options) {
            return spawn(this.command, [], this.parseOptions(options))
        } 
        return spawn(this.command, [], {
            detached: false,
            shell: true
        })
    }

    private parseOptions(options: ProcessOptions): SpawnOptions { 
        this.configureTimeout(options.executionTimeout)
        let useShell = options.runInShell ? options.runInShell : true
        return {
            cwd: options.currentDirectory,
            detached: false,
            env: options.environment,
            shell: useShell,
            windowsHide: options.hideConsoleOnWindows,
            windowsVerbatimArguments: options.windowsVerbatimArguments
        }
    }

    private configureTimeout(timeoutValue?: number): void {
        if (timeoutValue && timeoutValue > 0) {
            this.timeout = setTimeout(() => {
                this.killProcess()
            }, timeoutValue)
        }
    }

    private killProcess(): void {
        kill(this.childProcess.pid, 'SIGKILL')
        
    }

    private cleanupOnExit() {
        if (this.childProcess) {
            this.childProcess.on('exit', () => {
                clearTimeout(this.timeout)
            })
        }
    }

}