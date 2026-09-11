import * as http from 'node:http'

export default interface IWebSocketServerOptions {
    httpServer: http.Server | null
    port: number | null
}