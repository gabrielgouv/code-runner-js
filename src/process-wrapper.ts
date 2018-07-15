import { spawn, ChildProcess, SpawnOptions } from 'child_process'
import kill from 'tree-kill';

import { ProcessOptions } from './utils/process-options'
import { ProcessNotStartedError } from './errors/process-not-started-error';

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

    writeInput(value: string) {
        this.childProcess.stdin.write(value)
        this.childProcess.stdin.end()
    }

    onOutput(callback: (output: string) => void) {
        if (this.childProcess) {
            this.childProcess.stdout.on('data', (output: any) => {
                callback(output.toString('utf8'))
            })
        } else {
            throw new ProcessNotStartedError()
        }
    }

    onError(callback: (error: string) => void) {
        if (this.childProcess) {
            this.childProcess.stderr.on('data', callback)
        } else {
            throw new ProcessNotStartedError()
        }
    }

    onClose(callback: (returnValue: number) => void) {
        if (this.childProcess) {
            this.childProcess.on('close', callback)
        } else {
            throw new ProcessNotStartedError()
        }
    }

    private createProcess(options?: ProcessOptions): ChildProcess {
        if (options) {
            console.log('options')
            return spawn(this.command, [''], this.parseOptions(options))
        } 
        return spawn(this.command)
    }

    private parseOptions(options: ProcessOptions): SpawnOptions { 
        this.configureTimeout(options.executionLimit)
        let useShell = options.useShell ? options.useShell : true
        return {
            argv0: options.argv0,
            cwd: options.directory,
            detached: options.detached,
            env: options.env,
            gid: options.gid,
            shell: useShell,
            stdio: options.stdio,
            uid: options.uid,
            windowsHide: options.windowsHide,
            windowsVerbatimArguments: options.windowsVerbatimArguments
        }
    }

    private configureTimeout(timeoutValue?: number) {
        if (timeoutValue && timeoutValue > 0) {
            this.timeout = setTimeout(() => {
                kill(this.childProcess.pid, 'SIGKILL')
            }, timeoutValue)
        }
    }

    private cleanupOnExit() {
        if (this.childProcess) {
            this.childProcess.on('exit', () => {
                clearTimeout(this.timeout)
            })
        }
    }

}