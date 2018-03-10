module.exports = function({ types: t }) {
  // babel is passed in, grabbing types off of it. using Object destructuring
  // plugin contents
  return {
    visitor: {
      /*
        visitor contents

       */
      // Identifier(path, state) {},
      // ASTNodeTypeHere(path, state) {}
      BinaryExpression(path) {
        if (path.node.operator !== '===') {
          return; // if this binaryExpression doens't contain the above operator
        }
        path.node.left = t.identifier('sebmck')
        path.node.right = t.identifier('dork');
        // ...
      }
    }
  };
}
