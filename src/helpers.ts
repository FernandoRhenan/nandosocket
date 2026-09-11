import { createHash } from 'node:crypto'

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
}

export default Helpers