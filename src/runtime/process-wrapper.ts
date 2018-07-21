import kill from 'tree-kill'
import { spawn, ChildProcess, SpawnOptions } from 'child_process'
import { IProcessOptions } from './process-options'
import { ProcessNotStartedError } from '../errors/process-not-started-error'
import { Observable, Observer } from 'rxjs'

export class ProcessWrapper {

    private childProcess: ChildProcess
    private timeout: any

    constructor(private command: string, options?: IProcessOptions) {
        this.childProcess = this.createProcess(options)
        this.cleanupOnExit()
    }

    /**
     * Writes an array of inputs in process stdin
     * @param inputs - Array of inputs
     */
    public writeInput(...inputs: string[]): void {
        if (inputs) {
            for (const index of inputs.keys()) {
                this.childProcess.stdin.write(inputs[index])
            }
        }
        this.childProcess.stdin.end()
    }

    /**
     * Gets the data from process stdout
     */
    public onOutput(): Observable<string | Buffer> {
        return Observable.create((observer: Observer<string | Buffer>) => {
            if (this.childProcess) {
                this.childProcess.stdout.on('data', (output) => {
                    observer.next(output)
                    observer.complete()
                })
            } else {
                observer.error(new ProcessNotStartedError())
            }
        })
    }

    /**
     * Gets the error data from process stderr
     */
    public onError(): Observable<string | Buffer> {
        return Observable.create((observer: Observer<string | Buffer>) => {
            if (this.childProcess) {
                this.childProcess.stderr.on('data', (error) => {
                    observer.next(error)
                    observer.complete()
                })
            } else {
                observer.error(new ProcessNotStartedError())
            }
        })
    }

    /**
     * When the process is finished
     */
    public onFinish(): Observable<number> {
        return Observable.create((observer: Observer<number>) => {
            if (this.childProcess) {
                this.childProcess.on('close', (returnCode) => {
                    observer.next(returnCode)
                    observer.complete()
                })
            } else {
                observer.error(new ProcessNotStartedError())
            }
        })
    }

    /**
     * Spawns a new ChildProcess
     * @param options - Options based on ChildProcess options. This options is parsed by the {@link parseOptions}
     */
    private createProcess(options?: IProcessOptions): ChildProcess {
        if (options) {
            return spawn(this.command, [], this.parseOptions(options))
        }
        return spawn(this.command, [], {
            detached: false,
            shell: true,
        })
    }

    /**
     * Converts the {@link IProcessOptions} to {@link SpawnOptions}
     * @param options - The options
     */
    private parseOptions(options: IProcessOptions): SpawnOptions {
        this.configureTimeout(options.executionTimeout)
        const useShell = options.runInShell ? options.runInShell : true
        return {
            cwd: options.currentDirectory,
            detached: false,
            env: options.environment,
            shell: useShell,
            windowsHide: options.hideConsoleOnWindows,
            windowsVerbatimArguments: options.windowsVerbatimArguments,
        }
    }

    /**
     * Sets an execution time limit of a process. This prevents a infinite loop process
     * @param timeoutValue - The execution timeout value
     */
    private configureTimeout(timeoutValue?: number): void {
        if (timeoutValue && timeoutValue > 0) {
            this.timeout = setTimeout(() => {
                this.killProcess()
            }, timeoutValue)
        }
    }

    /**
     * Sends a SIGKILL signal to the running process to force. This forces its closure
     */
    private killProcess(): void {
        kill(this.childProcess.pid, 'SIGKILL')
    }

    /**
     * Clears the timeout if the process is finished before the timeout value
     */
    private cleanupOnExit() {
        if (this.childProcess) {
            this.childProcess.on('exit', () => {
                clearTimeout(this.timeout)
            })
        }
    }

}
