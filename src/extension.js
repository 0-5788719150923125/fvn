const vscode = require('vscode')
const http = require('http')
const Gun = require('gun')

let gun = null

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  relayGUN()

  console.log('Congratulations, your extension "fvn" is now active!')

  let disposable = vscode.commands.registerCommand('fvn.fire', function () {
    vscode.window
      .showInputBox({ prompt: 'What would you like to say?' })
      .then((input) => {
        if (input) {
          sendMessage(gun, input)
        }
      })

    vscode.window.showInformationMessage('Message sent!')
  })

  context.subscriptions.push(disposable)
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
  const server = http
    .createServer(requestListener)
    .listen(60666, '0.0.0.0', function () {
      console.log(`server listening on port: 60666`)
    })

  gun = Gun({
    peers: ['https://59.src.eco/gun', 'https://95.src.eco/gun'],
    web: server,
    file: './gun',
    localStorage: false,
    radisk: false,
    axe: false
  })

  logMessages(gun)
}

let lastBullet = null
function sendMessage(gun, input) {
  const bullet = JSON.stringify({
    focus: 'trade',
    message: input,
    pubKey: null,
    identifier: 'GhostIsCuteVoidGirl',
    mode: 'cos'
  })
  lastBullet = bullet
  gun.get('src').get('bullets').get('trade').put(bullet)
  console.log(`${colors.RED}ONE@CELL:${ad.TEXT} ${input}`)
}

function logMessages(gun) {
  gun
    .get('src')
    .get('bullets')
    .get('trade')
    .on(async (bullet) => {
      if (lastBullet === bullet) return
      lastBullet = bullet
      const data = JSON.parse(bullet)
      let message = ''
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
      console.log(`${color}ONE@CELL:${ad.TEXT} ${message}`)
    })
}

const colors = {
  PURPLE: '\x1b[95m',
  BLUE: '\x1b[34m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m'
}

const ad = {
  TEXT: '\x1b[0m'
}

module.exports = {
  activate,
  deactivate
}
