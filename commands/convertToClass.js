'use strict'
/* eslint-disable no-unused-vars, no-useless-return */
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
    const resultObj = {
      jsxFound: false,
      functionParentLocated: false,
    }
    // const result = babel.transform(code, {
    //   plugins: [
    //     jsxFunctionToClass,
    //   ],
    //   parserOpts: {
    //     plugins: ['jsx', ],
    //   },
    // })
    // console.log('result: ', result.code);
    let ast = babylon.parse(code, {
      plugins: ['jsx', ],
    });
    const relevantNodes = {}
    traverse(ast, {
        JSXElement(jsxPath) {
          resultObj.jsxFound = true
          const parentPath = jsxPath.findParent((pPath) => {
            return pPath.isFunctionExpression()
          })
          if (parentPath) {
            resultObj.functionParentLocated = true
          } else {
            return
          }
          relevantNodes.body = parentPath.node.body
          relevantNodes.identifierName = parentPath.parent.id.name
        },
    });

    if (!resultObj.jsxFound){
      errorMessage('Classy React was unable to locate any JSX contained within. Aborting')
      return
    } else if (!resultObj.functionParentLocated){
      errorMessage('Classy React was unable to locate the JSX function to convert')
      return
    }
    // editor.edit(editbuilder => {
    //   editbuilder.replace(selection, result.code)
    // })

  }
}
