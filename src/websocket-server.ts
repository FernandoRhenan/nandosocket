import EventEmitter from "node:events";
import * as http from 'node:http'
import type IWebSocketServerOptions from "./types/IWebSocketServerOptions.ts";
import Constants from "./constants.js";
import Helpers from "./helpers.js";

class WebSocketServer extends EventEmitter {
    constructor(options: IWebSocketServerOptions) {
        super()
        options = { ...Constants.webSocketDefaultServerOptions, ...options }
        if (options.httpServer) {
            options.httpServer.on('upgrade', (req, socket, head) => {

                const key = Helpers.concatenateKeyAndGUID(req.headers['sec-websocket-key'] ?? '')
                const acceptKey = Helpers.encryptStringWithSHA1(key)

                const responseHeaders = [
                    "HTTP/1.1 101 Switching Protocols",
                    "Upgrade: websocket",
                    "Connection: Upgrade",
                    `Sec-WebSocket-Accept: ${acceptKey}`,
                    "\r\n"
                ]

                socket.write(responseHeaders.join("\r\n"))
                socket.on('data', (buffer: Buffer) => {
                    const message = Helpers.decodeBuffer(buffer)
                    console.log(`Mensagem recebida as ${new Date().toLocaleTimeString()}:`, message)
                })
            })
        }
    }
}

export default WebSocketServer

const server = http.createServer()
server.listen(2000, () => { console.log('Servidor rodando na porta', 2000) })

new WebSocketServer({ httpServer: server, port: null })