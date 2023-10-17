const vscode = require('vscode')
const { isAlive } = require('./common')
const { sendMessage, startServer } = require('./gun')

let gun = null

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
    if (!(await isAlive('http://localhost:60666'))) {
        console.log('GUN is offline, starting server...')
        startServer()
    }

    let disposable = vscode.commands.registerCommand('fvn.fire', function () {
        vscode.window
            .showInputBox({ prompt: 'What would you like to say?' })
            .then(async (input) => {
                if (input) {
                    sendMessage(input)
                }
            })

        vscode.window.showInformationMessage('Message sent!')
    })

    context.subscriptions.push(disposable)

    console.log('Go have some FVN!')
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate
}
