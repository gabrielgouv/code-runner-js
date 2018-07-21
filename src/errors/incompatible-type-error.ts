export class IncompatibleTypeError extends Error {

    constructor(message?: string) {
        super(message)
        Object.setPrototypeOf(this, IncompatibleTypeError.prototype)
    }

}
