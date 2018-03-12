'use strict'

const vscode = require('vscode');
const commands = require('./commands')

function activate(context) {
    for (let commandId in commands) {
        if (commands.hasOwnProperty(commandId)) {
            const newCommand = vscode.commands.registerCommand(`extension.${commandId}`, commands[commandId])
            context.subscriptions.push(newCommand)
        }
    }
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;
