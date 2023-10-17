const vscode = require('vscode')
const { isAlive, outputChannel } = require('./common')
const { connectGun, sendMessage, startServer } = require('./gun')

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
    context.subscriptions.push(outputChannel)

    if (!(await isAlive('http://localhost:60666'))) {
        console.log()
        outputChannel.appendLine('GUN is offline, starting server...')
        startServer()
    } else {
        connectGun()
    }

    let disposable = vscode.commands.registerCommand('fvn.fire', function () {
        vscode.window
            .showInputBox({ prompt: 'Send message:' })
            .then(async (input) => {
                if (input) {
                    sendMessage(input)
                    outputChannel.show()
                }
            })

        // vscode.window.showInformationMessage('Message sent!')
    })

    context.subscriptions.push(disposable)

    outputChannel.appendLine('this is (a) test')
    outputChannel.appendLine('GUN is online. Have FVN!')
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate
}
