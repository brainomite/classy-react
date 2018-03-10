'use strict'
const vscode = require('vscode');
const Position = vscode.Position
const Range = vscode.Range


module.exports = () => {
  const editor = vscode.window.activeTextEditor
  const eDocument = editor.document
  const code = eDocument.getText()
  const lastLine = eDocument.lineCount - 1
  const lastPos = eDocument.lineAt(lastLine).range.end
  const entireDoc = new Range(new Position(0, 0), new Position(lastLine, lastPos))
  const newCode = code.split('\n').map((line, index) => (index + 1) + line ).join('\n')
  editor.edit(editbuilder => {
    editbuilder.replace(entireDoc, newCode)
  })
}
