// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode")
const http = require("http")
const Gun = require("gun")
// import * as http from 'http'
// import Gun from 'gun'

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

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
	let disposable = vscode.commands.registerCommand('fvn.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from fvn!');
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

	const gun = Gun({
		peers: ["https://59.src.eco/gun", "https://95.src.eco/gun"],
		web: server,
		file: './gun',
		localStorage: false,
		radisk: false,
		axe: false
	})
}

module.exports = {
	activate,
	deactivate
}