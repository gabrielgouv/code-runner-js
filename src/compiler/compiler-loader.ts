import { Observable, Observer, from } from 'rxjs'
import { LoaderError } from '../errors/loader-error'

export class CompilerLoader {

    private readonly fileName: string = 'compilers.json'

    constructor(private name: string) {

    }

    public getCompiler(): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            from(import(`${process.cwd()}/${this.fileName}`)).subscribe((compilers) => {
                observer.next(compilers[this.name])
                observer.complete()
            }, (error) => {
                if (error instanceof SyntaxError) {
                    observer.error(
                        new LoaderError(`It looks like the 'compilers.json' file is not formatted correctly. ${error}`))
                } else {
                    observer.error(new LoaderError(error))
                }
            })
        })
    }

}
