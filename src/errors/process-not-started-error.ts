export class ProcessNotStartedError extends Error {

    constructor(message?: string) {
        super(message)
        Object.setPrototypeOf(this, ProcessNotStartedError.prototype)
    }

}
