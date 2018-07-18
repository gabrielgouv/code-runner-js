import { spawn, ChildProcess, SpawnOptions } from 'child_process'
import kill from 'tree-kill';

import { ProcessOptions } from '../runtime/process-options'
import { ProcessNotStartedError } from '../errors/process-not-started-error';
import { Observable, Observer } from 'rxjs';

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

    writeInput(...inputs: string[]): void {
        if (inputs) {
            for (let i = 0; i < inputs.length; i++) {
                this.childProcess.stdin.write(inputs[i])
            }
        }
        this.childProcess.stdin.end()
    }

    onOutput(): Observable<string | Buffer> {
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

    onError(): Observable<string | Buffer> {
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

    onFinish(): Observable<number> {
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