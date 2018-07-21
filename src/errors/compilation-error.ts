export class CompilationError extends Error {

    constructor(message?: string) {
        super(message)
        Object.setPrototypeOf(this, CompilationError.prototype)
    }

}
