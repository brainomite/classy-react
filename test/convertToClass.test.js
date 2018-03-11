/* global suite, test */
'use strict'
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from chai
const assert = require('chai').assert;
const { transpolateToClass, } = require('../commands/convertToClass')
const path = require('path')
const fs = require('fs')

const TEST_FILES_FOLDER = './convertToClassTestFiles'
const testFolder = path.resolve(__dirname, TEST_FILES_FOLDER)

const getCode = fileName => {
  const thePath = path.join(testFolder, fileName)
  return fs.readFileSync(thePath).toString().trim()
}

suite('transpolateToClass Tests', function() {

    suite('basic unamed function with no props', () => {
      // Defines a Mocha unit test
      test('test 1 with one name', () => {
        const startCode = getCode('basicUnamedFunctionNoProps_begin.txt')
        const code = getCode('basicUnamedFunctionNoProps_end.txt')
        const { result, } = transpolateToClass(startCode)
        assert.strictEqual(result.code, code)
      });
      test('test 2 with a different name', () => {
        const startCode = getCode('basicUnamedFunctionNoPropsDifName_begin.txt')
        const code = getCode('basicUnamedFunctionNoPropsDifName_end.txt')
        const { result, } = transpolateToClass(startCode)
        assert.strictEqual(result.code, code)
      });
    });

    suite('basic named function', () => {
      test('with no props', () => {
        const startCode = getCode('basicNamedFunctionNoProps_begin.txt')
        const code = getCode('basicNamedFunctionNoProps_end.txt')
        const { result, } = transpolateToClass(startCode)
        assert.strictEqual(result.code, code)
      });
    });

    suite('arrow function', () => {
      test('with no props', () => {
        const startCode = getCode('arrowFunctionNoProps_begin.txt')
        const code = getCode('arrowFunctionNoProps_end.txt')
        const { result, } = transpolateToClass(startCode)
        assert.strictEqual(result.code, code)
      });
    });
});
