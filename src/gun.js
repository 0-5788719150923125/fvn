const http = require('http')
const Gun = require('gun')
const { colors, delay, isAlive, outputChannel } = require('./common')

class FVN {
    constructor() {
        this.gun = null
        this.previousBullet = null
        this.localPort = 60666
        this.localPeer = `http://localhost:${this.localPort}/gun`
        this.bootstrapPeers = [
            'https://59.src.eco/gun',
            'https://95.src.eco/gun'
        ]
        this.currentPeers = []
        this.keepAliveCounter = 3
        this.focus = 'trade'
        this.init()
    }

    async init() {
        if (!(await isAlive(this.localPeer))) {
            outputChannel.appendLine('GUN is offline, starting server...')
            this.startServer()
        } else {
            this.currentPeers = [this.localPeer]
            this.connectGun()
        }
    }

    async keepAlive() {
        await delay(15000)
        const peers = this.gun.back('opt.peers')
        for (const i of this.currentPeers) {
            const state = peers[i]?.wire?.readyState
            if (state === 0 || state === null || typeof state === 'undefined') {
                outputChannel.appendLine(
                    `Local GUN API is offline. Will retry ${this.keepAliveCounter.toString()} times before hosting it myself...`
                )
                this.keepAliveCounter--
                this.gun.opt({ peers: [...this.currentPeers] })
                if (this.keepAliveCounter === 0) {
                    this.currentPeers = this.bootstrapPeers
                    this.startServer(false)
                }
            } else {
                this.keepAliveCounter = 3
            }
        }
        this.keepAlive()
    }

    startServer(init = true) {
        const requestListener = (req, res) => {
            res.writeHead(200)
            res.end(`${this.previousBullet}`)
        }

        const server = http
            .createServer(requestListener)
            .listen(60666, '0.0.0.0', () => {
                const message = `GUN is listening at: ${this.localPeer}`
                console.log(message)
                outputChannel.appendLine(message)
            })

        this.currentPeers = this.bootstrapPeers
        this.connectGun(server, init)
    }

    connectGun(server = null, init = true) {
        this.gun = Gun({
            peers: this.currentPeers,
            web: server,
            file: './gun',
            localStorage: false,
            radisk: false,
            axe: false
        })
        // Required for keepAlive()
        this.gun.get('src').on((data) => {})
        this.logMessages()
        if (init) {
            this.keepAlive()
        }
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
