'use strict'
const vscode = require('vscode');
const Position = vscode.Position
const Range = vscode.Range
const babel = require('babel-core')

const { test1 } = require('../babelPlugins')

const errorMessage = msg => {
  vscode.window.showErrorMessage(msg)
}

module.exports = () => {
  const editor = vscode.window.activeTextEditor
  const selection = editor.selection
  if (selection.isEmpty){
    errorMessage('Please select some code and try again')
  } else {
    const eDocument = editor.document
    const code = eDocument.getText(selection)
    const lastLine = eDocument.lineCount - 1
    const lastPos = eDocument.lineAt(lastLine).range.end
    const entireDoc = new Range(new Position(0, 0), new Position(lastLine, lastPos))
    console.log('editor.selection: ', editor.selection);

    const result = babel.transform(code, {
      plugins: [
        test1,
      ]
    }, {
      plugins: ['jsx']
    })

    editor.edit(editbuilder => {
      editbuilder.replace(selection, result.code)
    })

  }
}
