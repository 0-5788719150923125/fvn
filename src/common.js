const vscode = require('vscode')
const http = require('http')

const outputChannel = vscode.window.createOutputChannel('FVN', 'src')

const colors = {
    BLUE: '\x1b[34m',
    GREEN: '\x1b[32m',
    PURPLE: '\x1b[95m',
    RED: '\x1b[31m',
    WHITE: '\x1b[0m'
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

function get_config() {
    const config = vscode.workspace.getConfiguration()
    return config.get('fvn')
}

function get_setting(opt) {
    const config = get_config()
    return config[opt]
}

function randomString(
    len,
    chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
) {
    let text = ''
    for (let i = 0; i < len; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return text
}

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

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x))
}

module.exports = {
    colors,
    delay,
    get_config,
    get_setting,
    isAlive,
    outputChannel,
    randomString,
    sigmoid
}
