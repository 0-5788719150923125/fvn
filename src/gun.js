const http = require('http')
const Gun = require('gun')
const { colors, isAlive, outputChannel } = require('./common')

class FVN {
    constructor() {
        this.gun = null
        this.previousBullet = null
        this.localPort = 60666
        this.bootstrapPeers = [
            'https://59.src.eco/gun',
            'https://95.src.eco/gun'
        ]
        this.focus = 'trade'
        this.init()
    }

    async init() {
        if (!(await isAlive(`http://localhost:${this.localPort}`))) {
            outputChannel.appendLine('GUN is offline, starting server...')
            this.startServer()
        } else {
            this.connectGun()
        }
    }

    startServer() {
        const requestListener = (req, res) => {
            res.writeHead(200)
            res.end(`${this.previousBullet}`)
        }

        const server = http
            .createServer(requestListener)
            .listen(60666, '0.0.0.0', () => {
                const message = `GUN is listening at: http://localhost:${this.localPort}`
                console.log(message)
                outputChannel.appendLine(message)
            })

        this.connectGun(server)
    }

    connectGun(server = null) {
        this.gun = Gun({
            peers: this.bootstrapPeers,
            web: server,
            file: './gun',
            localStorage: false,
            radisk: false,
            axe: false
        })
        this.logMessages()
    }

    sendMessage(input) {
        const bullet = JSON.stringify({
            focus: this.focus,
            message: input,
            pubKey: null,
            identifier: 'GhostIsCuteVoidGirl',
            mode: 'cos'
        })
        this.previousBullet = bullet
        this.gun.get('src').get('bullets').get(this.focus).put(bullet)
        console.log(`${colors.RED}< ONE@CELL:${colors.WHITE} ${input}`)
        outputChannel.appendLine(`< ONE@CELL: ${input}`)
    }

    logMessages() {
        this.gun
            .get('src')
            .get('bullets')
            .get(this.focus)
            .on(async (bullet) => {
                if (this.previousBullet === bullet) return
                this.previousBullet = bullet
                const data = JSON.parse(bullet)
                let message = data.message
                let color = colors.RED
                if (
                    data.pubKey !== null &&
                    typeof data.pubKey !== 'undefined'
                ) {
                    const sender = await this.gun.user(data.pubKey)
                    if (typeof sender === 'undefined') {
                        color = colors.BLUE
                    } else
                        message = await Gun.SEA.verify(data.message, sender.pub)
                    color = colors.PURPLE
                } else {
                    color = colors.BLUE
                }
                console.log(`${color}> ONE@CELL:${colors.WHITE} ${message}`)
                outputChannel.appendLine(`> ONE@CELL: ${message}`)
            })
    }
}

module.exports = FVN
