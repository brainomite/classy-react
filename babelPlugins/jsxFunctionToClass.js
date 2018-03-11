module.exports = function({ types: t, }) {
  // babel is passed in, grabbing types off of it. using Object destructuring
  // plugin contents
  return {
    visitor: {
      // JSXElement(path){
      //   console.log('path: ', path);
      // },
      /*
        visitor contents

       */
      // Identifier(path, state) {},
      // ASTNodeTypeHere(path, state) {}
      JSXElement(path) {
        // if (path.node.operator !== '===') {
        //   console.log('path.node.operator: ', path.node.operator);
        //   return; // if this binaryExpression doens't contain the above operator
        // }
        // path.node.left = t.identifier('sebmck')
        // path.node.right = t.identifier('dork');
        // // ...
        console.log('hello')
        const parentPath = path.findParent((pPath) => {
          // console.log('pPath: ', pPath);
          return pPath.isFunctionExpression()
        })
        console.log('parentPath: ', parentPath);
        if (!parentPath){
          return undefined
        }

      },

    },
  };
}
