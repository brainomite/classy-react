'use strict'
const vscode = require('vscode');
const babel = require('babel-core')
const traverse = require('babel-traverse').default;
const babylon = require('babylon');

const { jsxFunctionToClass, test1, } = require('../babelPlugins')

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

    // const result = babel.transform(code, {
    //   plugins: [
    //     jsxFunctionToClass,
    //   ],
    //   parserOpts: {
    //     plugins: ['jsx', ],
    //   },
    // })
    // console.log('result: ', result.code);
    let ast = babylon.parse(code,{
      plugins: ['jsx', ],
    });

    traverse(ast, {
        JSXElement(path) {
            console.log('entered');
        }
    });
    // editor.edit(editbuilder => {
    //   editbuilder.replace(selection, result.code)
    // })

  }
}
