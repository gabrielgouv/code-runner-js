export class IncompatibleAttributeError extends Error {

    constructor(message?: string) {
        super(message)
        Object.setPrototypeOf(this, IncompatibleAttributeError.prototype)
    }

}
