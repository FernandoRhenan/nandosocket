export default interface IWebSocketFrameBody {
    fin: boolean
    rsv1: boolean
    rsv2: boolean
    rsv3: boolean
    opcode: number
    mask: boolean
    payloadLength: number
    maskingKey: Buffer | null
    payload: Buffer | null
}