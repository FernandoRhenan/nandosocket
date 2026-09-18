import type { IProtocolError } from "./types/Errors.js"

export class ProtocolError extends Error implements IProtocolError {
    statusCode = ''
    constructor(errorProps: IProtocolError) {
        super()
        this.statusCode = errorProps.statusCode
    }
}

