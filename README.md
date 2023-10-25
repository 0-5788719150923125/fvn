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
2. Host a local GUN API at: https://localhost:60666/gun
3. If multiple instances of VSCode are open, the extension will intelligently connect to the local API, and/or start it (in the event of failure).

## Usage

This extension exports a single command, called "Fire". To fire a bullet into GUN (making a query), use these steps:

1. Press `Ctrl + Shift + P`
2. Type `Fire`

More features to come...

## Installation Methods

### 1. From the offline, packaged VSCode extension

Browse the [./release](./release) folder, and install the latest .vsix file via:

```
Extensions > ... > Install from VSIX...
```

### 2. Install from source

Clone this repository, and open it in VSCode. Press "F5" to start the debugger.

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
