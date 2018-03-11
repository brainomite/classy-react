/* global suite, test */

//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from chai
const assert = require('chai').assert;
const { transpolateToClass, } = require('../commands/convertToClass')

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// const vscode = require('vscode');
// const myExtension = require('../extension');

// Defines a Mocha test suite to group tests of similar kind together
suite('transpolateToClass Tests', function() {

    // Defines a Mocha unit test
    test('basic unamed function with no props', () => {
        const startCode = `
const renderTest = function(){
  return (
    <h1>test</h1>
  )
}
        `
        const code = `class renderTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = undefined;
  }

  render() {
    return <h1>test</h1>;
  };
}`

        const { result, } = transpolateToClass(startCode)
        console.log('result: ', result.code);
        assert.strictEqual(result.code, code)
    });
});
