// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode")
const http = require("http")
const Gun = require("gun")
// const SEA = require("gun/sea")
// import * as http from 'http'
// import Gun from 'gun'

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

let gun = null

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	relayGUN()
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "fvn" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('fvn.pong', function () {
		// The code you place here will be executed every time your command is executed
		sendMessage(gun)
		// Display a message box to the user
		vscode.window.showInformationMessage('Pong!');
	});

	context.subscriptions.push(disposable);

}

// This method is called when your extension is deactivated
function deactivate() {}

async function relayGUN() {
	// Serve a static landing page
	const requestListener = function (req, res) {
		res.writeHead(200)
		res.end(`{"error":"This is not for you, but I see you!"}`)
	}

	// Create the webserver
	const server = http.createServer(requestListener)
		.listen(60666, '0.0.0.0', function () {
			console.log(`server listening on port: 60666`)
		})

	gun = Gun({
		peers: ["https://59.src.eco/gun", "https://95.src.eco/gun"],
		web: server,
		file: './gun',
		localStorage: false,
		radisk: false,
		axe: false
	})

	logMessages(gun)
}

function sendMessage(gun) {
	gun.get('src').get('bullets').get('trade').put(JSON.stringify({
		focus: 'trade',
		message: 'pong',
		identifier: 'randomId',
		mode: 'cos'
	}))
	console.log(`${bc.CORE}ONE@FVN:${ad.TEXT} pong`)
}

function logMessages(gun) {
	gun.get('src').get('bullets').get('trade').on(async (data) => {
		const bullet = JSON.parse(data)
		let message = ''
		let color = bc.CORE
		if (
			bullet.pubKey !== null &&
			typeof bullet.pubKey !== 'undefined'
		) {
			const sender = await gun.user(bullet.pubKey)
			if (typeof sender === 'undefined') {
				message = bullet.message
				color = bc.FOLD
			} else
				message = await Gun.SEA.verify(
					bullet.message,
					sender.pub
				)
				color = bc.ROOT
		} else {
			message = bullet.message
			color = bc.FOLD
		}
		console.log(`${color}ONE@FVN:${ad.TEXT} ${message}`)
	})
}

const bc = {
    FOLD: '\x1b[34m',
    ROOT: '\x1b[32m',
    CORE: '\x1b[31m'
}

const ad = {
    TEXT: '\x1b[0m'
}

module.exports = {
	activate,
	deactivate
}