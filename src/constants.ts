import type IWebSocketServerOptions from "./types/IWebSocketServerOptions.ts"

class Constants {

    public static webSocketDefaultServerOptions: IWebSocketServerOptions = {
        httpServer: null,
        port: null,
    }

}

export default Constants