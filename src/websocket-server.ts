import EventEmitter from "node:events";
import * as http from 'node:http'
import type IWebSocketServerOptions from "./types/IWebSocketServerOptions.ts";
// import Constants from "./constants.js";

import Index from "./index.js";
import Helpers from "./helpers.js";

class WebSocketServer extends EventEmitter {
    constructor(options: IWebSocketServerOptions) {
        super()
        // options = { ...Constants.webSocketDefaultServerOptions, ...options }
        if (!options.httpServer) {
            new Index(this.handleRequest.bind(this))
        }
    }

    handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {

        if (req.headers['connection'] === 'Upgrade') this.validateHandshake(req, res)

    }

    private validateHandshake(req: http.IncomingMessage, res: http.ServerResponse) {

        // const requestURI = req.url
        const { host,
            upgrade,
            connection,
            "sec-websocket-key": webSocketKey,
            "sec-websocket-version": webSocketVersion
        } = req.headers

        if (webSocketVersion !== '13') {
            return this.finishHandshake(res, new Headers({ "Sec-Websocket-Version": '13' }), 426)
        }

        if (!host ||
            upgrade !== 'websocket' ||
            connection !== 'Upgrade' ||
            atob(webSocketKey ?? '').length !== 16
        ) {
            return this.finishHandshake(res, null, 400)
        }

        const concatenatedKeyAndGUID = Helpers.concatenateKeyAndGUID(webSocketKey ?? '')
        const secWebsocketAccept = Helpers.encryptStringWithSHA1(concatenatedKeyAndGUID)

        const headers = new Headers({
            Upgrade: 'websocket',
            Connection: 'Upgrade',
            'Sec-WebSocket-Accept': secWebsocketAccept
        })

        return this.finishHandshake(res, headers, 101)
    }

    private finishHandshake(res: http.ServerResponse, headers: Headers | null, statusCode: number): void {
        res.statusCode = statusCode
        if (headers) res.setHeaders(headers)
        res.end()
    }

}

export default WebSocketServer

new WebSocketServer({ httpServer: null, port: null })