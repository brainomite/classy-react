'use strict'
const vscode = require('vscode');
const Position = vscode.Position
const Range = vscode.Range
const babel = require('babel-core')
const { test1 } = require('../babelPlugins')


module.exports = () => {
  const editor = vscode.window.activeTextEditor
  const eDocument = editor.document
  const code = eDocument.getText()
  const lastLine = eDocument.lineCount - 1
  const lastPos = eDocument.lineAt(lastLine).range.end
  const entireDoc = new Range(new Position(0, 0), new Position(lastLine, lastPos))
  const newCode = code.split('\n').map((line, index) => (index + 1) + line ).join('\n')

  const result = babel.transform(code, {
    plugins: [
      test1,
    ]
  })

  editor.edit(editbuilder => {
    editbuilder.replace(entireDoc, result.code)
  })
}
