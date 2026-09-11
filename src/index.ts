import * as http from 'node:http'

export default class Index {
    constructor(cb: any) {
        const server = http.createServer((req, res) => {
            cb(req, res)
        })
        server.listen(2000, () => {
            console.log('Running on 2000')
        })
    }

    handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
        console.log(req.url)
        res.statusCode = 200
        res.write('Hello World.\n')
        res.end()
    }
}
