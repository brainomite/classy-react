'use strict'
const vscode = require('vscode');

module.exports = function () {
  // The code you place here will be executed every time your command is executed

  // Display a message box to the user
  vscode.window.showInformationMessage('Hello World!');
}
