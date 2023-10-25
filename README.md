# FVN

F is for friends

```
Swarm state: healthy

...2vYiga, 256.0 RPS  |                                 ########                             |
...vMfXzi, 3688.5 RPS |#########################                                             |
...i9CA9T, 2776.2 RPS |                              ###############                         |
...33Pgb9, 2108.6 RPS |###############                                                       |
...Ap3RUq, 256.0 RPS  |                                     ########                         |
...7mhsNH, 256.0 RPS  |                         ########                                     |
...iRUz6M, 2767.3 RPS |               ###############                                        |
...zbDrjo, 3500.3 RPS |                                             #########################|


Legend:

# - online
J - joining     (loading blocks)
? - unreachable (port forwarding/NAT/firewall issues, see below)
_ - offline     (just disconnected)
```

## Features

This extension will do following:

1. Connect to a swarm of [GUN](https://gun.eco) bootstrap peers.
2. Provide a query interface via the `Fire` command (see below).
3. Host a shared API at: https://localhost:60666/gun
4. If multiple instances of VSCode are running, the extension will connect to a single, local API. In the event of failure, VSCode will attempt to re-launch the API.

## Usage

This extension exports a single command, called "Fire". To fire a bullet into GUN (making a query), use these steps:

1. Press `Ctrl + Shift + P`
2. Type `Fire`

To automatically scroll with the extension, click on the "lock" icon in the upper-right corner of the Output tab.

More features to come...

## Installation Methods

### 1. From the offline, packaged VSCode extension

Browse the [./release](./release) folder, and install the latest .vsix file via:

```
Extensions > ... > Install from VSIX...
```

### 2. Install from source

Clone this repository, and open it in VSCode. Use `npm install` to load dependencies. Press "F5" to start the debugger.

If all goes well, a new VSCode window will open, running this extension.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

-   `myExtension.enable`: Enable/disable this extension.
-   `myExtension.thing`: Set to `blah` to do something.

## Release Notes

### 0.1.0

Initial release...
