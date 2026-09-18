import { createHash } from 'node:crypto'
import type IWebSocketFrameBody from './types/IWebSocketFrameBody.js'
import { ProtocolError } from './Errors.js'
// import type IWebSocketFrameBody from './types/IWebSocketFrameBody.js'

class Helpers {
    static concatenateKeyAndGUID(webSocketKey: string) {
        if (!webSocketKey) throw new TypeError('The webSocketKey is \'\'')
        return webSocketKey + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
    }

    static encryptStringWithSHA1(string: string): string {
        const sha1HashBase64Encoded =
            createHash('sha1')
                .update(string)
                .digest('base64')

        return sha1HashBase64Encoded
    }

    static decodeBuffer(buffer: Buffer): IWebSocketFrameBody {
        const secondByte = Number(buffer[1])
        const mask = Boolean(secondByte & 0b10000000)
        if (!mask) throw new ProtocolError({ message: 'The `Mask` was not provided', name: 'protocol error', statusCode: '1002' })

        const firstByte = Number(buffer[0])
        const fin = Boolean(firstByte & 0b10000000)
        const { rsv1, rsv2, rsv3 } = { rsv1: Boolean(firstByte & 0b01000000), rsv2: Boolean(firstByte & 0b00100000), rsv3: Boolean(firstByte & 0b00010000) }
        const opcode = firstByte & 0b00001111
        let payloadLength: number = (secondByte & 0b01111111)

        let offset = 2
        if (payloadLength > 125) {
            payloadLength = buffer.readUInt16BE(offset)
            offset += 2
        } else if (payloadLength > 126) {
            payloadLength = Number(buffer.readBigUint64BE(offset))
            offset += 8
        }

        let maskingKey = buffer.subarray(offset, offset + 4)
        offset += 4

        let payload = buffer.subarray(offset, (offset + payloadLength))

        if (payload.length > 0 && maskingKey.length > 0) {
            for (let i = 0; i < payload.byteLength; i++) {
                payload[i] = payload[i]! ^ maskingKey[i % 4]!;
            }
        }

        return {
            fin: fin,
            rsv1: rsv1,
            rsv2: rsv2,
            rsv3: rsv3,
            opcode: opcode,
            mask: mask,
            payloadLength: payloadLength,
            maskingKey: maskingKey,
            payload: payload
        }
    }
}

export default Helpers