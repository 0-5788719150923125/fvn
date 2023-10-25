const vscode = require('vscode')
const http = require('http')

const outputChannel = vscode.window.createOutputChannel('FVN', 'src')

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

async function isAlive(url) {
    return new Promise((resolve, reject) => {
        const request = http.get(url, (response) => {
            if (response.statusCode === 200) {
                return resolve(true)
            } else {
                resolve(false)
            }
        })

        request.on('error', (err) => {
            console.error(err)
            resolve(false)
        })

        request.end()
    })
}

const colors = {
    BLUE: '\x1b[34m',
    GREEN: '\x1b[32m',
    PURPLE: '\x1b[95m',
    RED: '\x1b[31m',
    WHITE: '\x1b[0m'
}

module.exports = {
    delay,
    isAlive,
    colors,
    outputChannel
}
