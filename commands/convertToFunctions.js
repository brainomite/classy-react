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

const isThisMemberExpression = path => {
  const node = path.node
  const object = node.object
}

const buildRequire = template(`const FUNCTION_NAME = (props) => FUNCTION_BODY`);
const buildRequireWithoutProps = template(`const FUNCTION_NAME = () => FUNCTION_BODY`);
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
  let propsWasSeen = false
  const nestedVisitor = {
    JSXElement(path){
      if (path.node.extra &&
          path.node.extra.parenthesized &&
          !types.isParenthesizedExpression(path.parent)){
        path.replaceWith(types.parenthesizedExpression(path.node))
      }
    },
    ThisExpression(path){
      const parentPath = path.parentPath
      if (path.key === 'object') {
        if (parentPath.isMemberExpression() && parentPath.parentKey === 'object'){
          parentPath.replaceWith(parentPath.node.property)
        } else if (parentPath.isMemberExpression() && parentPath.parentKey === 'init'){
          parentPath.replaceWith(parentPath.node.property)
        } else if (parentPath.isExpression() && parentPath.parentKey === 'expression'){
          parentPath.replaceWith(parentPath.node.property)
        }

      }
    },
    Identifier(path){
      if (path.node.name === 'props'){
        propsWasSeen = true
      }
    }
  }
  traverse(ast, {
    ClassMethod(path){
      const methodName = path.node.key.name
      if (classMethodsToSkip.includes(methodName)) {
        return
      }
      propsWasSeen = false
      path.traverse(nestedVisitor)
      const body = path.node.body
      const buildObj = {
        FUNCTION_NAME: methodName === 'render' ? types.identifier(className) : types.identifier(methodName),
        FUNCTION_BODY: body,
      }

      const newAst = propsWasSeen ? buildRequire(buildObj) : buildRequireWithoutProps(buildObj)
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
    if (/this\.setState|this\.state/.test(code)){
      errorMessage('At this time Classy React only supports converting stateless classes.\nPlease eliminate any useage of state and try again')
      return
    }
    const { result, classFound, } = transpolateToFunctions(code)

    if (!classFound) {
      errorMessage('Classy React was unable to loacte the class declaration. Aborting')
      return
    }
    editor.edit(editbuilder => {
      editbuilder.replace(selection, '/*\n' + code + '\n*/\n\n' + result.code)
    })

  }
}

module.exports = {
  command,
  transpolateToFunctions,
}
