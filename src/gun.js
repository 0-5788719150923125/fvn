const vscode = require('vscode')
const http = require('http')
const Gun = require('gun')
const { colors, outputChannel } = require('./common')

let gun

async function startServer() {
    const requestListener = function (req, res) {
        res.writeHead(200)
        res.end(`{"error":"This is not for you, but I see you!"}`)
    }

    const server = http
        .createServer(requestListener)
        .listen(60666, '0.0.0.0', function () {
            console.log(`GUN is listening at: http://localhost:60666/gun`)
        })

    connectGun(server)
}

function connectGun(server = null) {
    gun = Gun({
        peers: ['https://59.src.eco/gun', 'https://95.src.eco/gun'],
        web: server,
        file: './data',
        localStorage: false,
        radisk: false,
        axe: false
    })
    logMessages(gun)
}

let lastBullet = null
function sendMessage(input) {
    const bullet = JSON.stringify({
        focus: 'trade',
        message: input,
        pubKey: null,
        identifier: 'GhostIsCuteVoidGirl',
        mode: 'cos'
    })
    lastBullet = bullet
    gun.get('src').get('bullets').get('trade').put(bullet)
    console.log(`${colors.RED}< ONE@CELL:${colors.WHITE} ${input}`)
    outputChannel.appendLine(`< ONE@CELL: ${input}`)
}

function logMessages(gun) {
    gun.get('src')
        .get('bullets')
        .get('trade')
        .on(async (bullet) => {
            if (lastBullet === bullet) return
            lastBullet = bullet
            let message
            const data = JSON.parse(bullet)
            let color = colors.RED
            if (data.pubKey !== null && typeof data.pubKey !== 'undefined') {
                const sender = await gun.user(data.pubKey)
                if (typeof sender === 'undefined') {
                    message = data.message
                    color = colors.BLUE
                } else message = await Gun.SEA.verify(data.message, sender.pub)
                color = colors.PURPLE
            } else {
                message = data.message
                color = colors.BLUE
            }
            console.log(`${color}> ONE@CELL:${colors.WHITE} ${message}`)
            outputChannel.appendLine(`> ONE@CELL: ${message}`)
        })
}

module.exports = {
    connectGun,
    sendMessage,
    startServer
}
