const vscode = require('vscode')
const http = require('http')
const Gun = require('gun')
const {
    colors,
    delay,
    isAlive,
    outputChannel,
    randomString
} = require('./common')

class FVN {
    constructor() {
        this.localHost = 'STATE'
        this.localPort = 60666
        this.localPeer = `http://localhost:${this.localPort}/gun`
        this.bootstrapPeers = [
            'https://59.src.eco/gun',
            'https://95.src.eco/gun'
        ]
        this.currentPeers = []
        this.keepAliveCounter = 3
        this.focus = 'trade'
        this.identifier = randomString(18, '0123456789')
        this.pubKey = null
        this.gun = null
        this.previousBullet = null
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
            pubKey: this.pubKey,
            identifier: this.identifier,
            mode: 'cos'
        })
        this.previousBullet = bullet
        this.gun.get('src').get('bullets').get(this.focus).put(bullet)
        console.log(
            `${colors.RED}< ONE@${this.localHost}:${colors.WHITE} ${input}`
        )
        outputChannel.appendLine(`< ONE@${this.localHost}: ${input}`)
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
                const result = await simulator(message)
                console.log(
                    `${color}> ONE@${this.localHost}:${colors.WHITE} ${result.message}`
                )
                outputChannel.appendLine(
                    `> ONE@${this.localHost}: ${result.message}`
                )
                if (result.choice1 && result.choice2) {
                    const response = await vscode.window.showInformationMessage(
                        'Someone has requested your action.',
                        'GoTo'
                    )
                    if (response === 'GoTo') {
                        outputChannel.show(true)
                        const choice =
                            await vscode.window.showInformationMessage(
                                'Simulator: Make a choice.',
                                result.choice1,
                                result.choice2
                            )

                        outputChannel.appendLine(
                            `< ONE@${this.localHost}: ${choice}`
                        )
                    }
                }
            })
    }
}

// This doesn't really do anything, except for demonstrating the workflow.
async function simulator(message) {
    if (Math.random() < 0.001) {
        const words = message.split(' ')
        if (words.length < 3) return { message }
        const randomIndexes = []
        while (randomIndexes.length < 2) {
            const randomIndex = Math.floor(Math.random() * words.length)
            if (!randomIndexes.includes(randomIndex)) {
                randomIndexes.push(randomIndex)
                words[randomIndex] = `((${words[randomIndex]}))`
            }
        }
        message = words.join(' ')
        return {
            message,
            choice1: words[randomIndexes[0]],
            choice2: words[randomIndexes[1]]
        }
    }
    return { message }
}

module.exports = FVN
