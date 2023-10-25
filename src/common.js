const vscode = require('vscode')
const http = require('http')

const outputChannel = vscode.window.createOutputChannel('fvn', 'src')

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
    PURPLE: '\x1b[95m',
    BLUE: '\x1b[34m',
    RED: '\x1b[31m',
    GREEN: '\x1b[32m',
    WHITE: '\x1b[0m'
}

module.exports = {
    isAlive,
    colors,
    outputChannel
}
