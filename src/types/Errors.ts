export interface IProtocolError extends Error {
    readonly statusCode: string
}
