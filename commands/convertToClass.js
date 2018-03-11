'use strict'
/* eslint-disable no-unused-vars */
const vscode = require('vscode');
const babel = require('babel-core')
const traverse = require('babel-traverse').default;
const babylon = require('babylon');
const template = require('babel-template');
const generate = require('babel-generator').default

const types = babel.types

const { jsxFunctionToClass, } = require('../babelPlugins')

const errorMessage = msg => {
  vscode.window.showErrorMessage(msg)
}

const generateResultObj = () => ({
  jsxFound: false,
  functionParentLocated: false,
  declarationLocated: false,
})

module.exports = () => {
  const editor = vscode.window.activeTextEditor
  const selection = editor.selection
  if (selection.isEmpty){
    errorMessage('Please select some code and try again')
  } else {
    const eDocument = editor.document
    const code = eDocument.getText(selection)
    const resultObj = generateResultObj()

    const ast = babylon.parse(code, {
      plugins: ['jsx', ],
    });
    const relevantNodes = {}
    traverse(ast, {
        JSXElement(jsxPath) {
          resultObj.jsxFound = true
          const funcPath = jsxPath.findParent((pPath) => {
            return pPath.isFunctionExpression()
          })
          if (funcPath) {
            resultObj.functionParentLocated = true
          } else {
            return
          }
          const declarationPath = funcPath.findParent(aPath => {
            return aPath.isVariableDeclaration()
          })
          if (declarationPath){
            resultObj.declarationLocated = true
          } else {
            return
          }

          relevantNodes.identifierName = funcPath.parent.id.name
          relevantNodes.body = funcPath.node.body
          relevantNodes.pathToReplace = declarationPath
        },
    });

    if (!resultObj.jsxFound){
      errorMessage('Classy React was unable to locate any JSX contained within. Aborting')
      return
    } else if (!resultObj.functionParentLocated){
      errorMessage('Classy React was unable to locate the JSX function to convert')
      return
    } else if (!resultObj.declarationLocated){
      errorMessage('Classy React was unable to loacte the JSX function declarations. Aborting')
    }

    const buildRequire = template(`
      class CLASS_NAME{
        constructor(props){
          super(props)
          this.state = undefined
        }
        RENDER_METHOD
      }
    `);

    const newAst = buildRequire({
      CLASS_NAME: types.identifier(relevantNodes.identifierName),
      RENDER_METHOD: types.classMethod('method', types.identifier('render'), [], relevantNodes.body),
    });
    console.log('newAst: ', newAst);
    relevantNodes.pathToReplace.replaceWith(newAst)
    const result = generate(ast)
    editor.edit(editbuilder => {
      editbuilder.replace(selection, result.code)
    })

  }
}
