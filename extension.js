'use strict'

const vscode = require('vscode');
const commands = require('./commands')

function activate(context) {

        if (commands.hasOwnProperty(commandId)){
            const newCommand = vscode.commands.registerCommand(`extension.${commandId}`, commands[commandId])
            context.subscriptions.push(newCommand)
        }
    }
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;
