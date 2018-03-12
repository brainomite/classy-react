'use strict'
const vscode = require('vscode');
const traverse = require('babel-traverse').default;
const babylon = require('babylon');
const template = require('babel-template');
const generate = require('babel-generator').default

const types = require('babel-types')

const classMethodsToSkip = [
  'constructor',
]
const errorMessage = msg => {
  vscode.window.showErrorMessage(msg)
}

const generateResultObj = () => ({
})

const nestedVisitor = {
  JSXElement(path){
    if (path.node.extra &&
        path.node.extra.parenthesized &&
        !types.isParenthesizedExpression(path.parent)){
      path.replaceWith(types.parenthesizedExpression(path.node))
    }
  },
}

const buildRequire = template(`const FUNCTION_NAME = (props) => FUNCTION_BODY`);

const transpolateToFunctions = code => {
  const resultObj = generateResultObj()
  const ast = babylon.parse(code, {
    plugins: ['jsx', ],
  });

  if (ast.program.body.length > 1 || !types.isClassDeclaration(ast.program.body[0])){
    errorMessage('Please just select the entire class')
    return resultObj
  } else {
    resultObj.classFound = true
  }
  const newBody = []
  const classNode = ast.program.body[0]
  const className = classNode.id.name
  traverse(ast, {
    ClassMethod(path){
      const methodName = path.node.key.name
      if (classMethodsToSkip.includes(methodName)) {
        return
      }
      path.traverse(nestedVisitor)
      const body = path.node.body

      const newAst = buildRequire({
        FUNCTION_NAME: methodName === 'render' ? types.identifier(className) : types.identifier(methodName),
        FUNCTION_BODY: body,
      });
      newBody.push(newAst)
    },
  })
  ast.program.body = newBody
  resultObj.result = generate(ast)
  return resultObj
}

const command = () => {
  const editor = vscode.window.activeTextEditor
  const selection = editor.selection
  if (selection.isEmpty){
    errorMessage('Please select some code and try again')
  } else {
    const eDocument = editor.document
    const code = eDocument.getText(selection)

    const { result, classFound, } = transpolateToFunctions(code)

    // if (!jsxFound){
    //   errorMessage('Classy React was unable to locate any JSX contained within. Aborting')
    //   return
    // } else if (!functionParentLocated){
    //   errorMessage('Classy React was unable to locate the JSX function to convert')
    //   return
    // } else if (!declarationLocated){
    //   errorMessage('Classy React was unable to loacte the JSX function declarations. Aborting')
    //   return
    // }
    if (!classFound) return
    editor.edit(editbuilder => {
      editbuilder.replace(selection, '/*\n' + code + '*/\n\n' + result.code)
    })

  }
}

module.exports = {
  command,
  transpolateToFunctions,
}
