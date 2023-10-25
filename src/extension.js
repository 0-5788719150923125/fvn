const vscode = require('vscode')
const { isAlive, outputChannel } = require('./common')
const FVN = require('./gun')

// This method is called when the extension is activated
/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
    context.subscriptions.push(outputChannel)

    // if (!(await isAlive('http://localhost:60666'))) {
    //     outputChannel.appendLine('GUN is offline, starting server...')
    //     startServer()
    // } else {
    //     connectGun()
    // }

    const fvn = new FVN()

    let disposable = vscode.commands.registerCommand('fvn.fire', function () {
        outputChannel.show(true)
        vscode.window
            .showInputBox({ prompt: 'Send message:' })
            .then(async (input) => {
                if (input) {
                    fvn.sendMessage(input)
                }
            })
    })

    context.subscriptions.push(disposable)

    vscode.window.setStatusBarMessage('GUN is online. Have FVN!')
}

// This method is called when the extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate
}
