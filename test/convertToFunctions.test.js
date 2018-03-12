/* global suite, test */
'use strict'
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from chai
const assert = require('chai').assert;
const { transpolateToFunctions, } = require('../commands/convertToFunctions')
const path = require('path')
const fs = require('fs')

const TEST_FILES_FOLDER = './convertToFunctionsTestFiles'
const testFolder = path.resolve(__dirname, TEST_FILES_FOLDER)

const getCode = fileName => {
  const thePath = path.join(testFolder, fileName)
  return fs.readFileSync(thePath).toString().trim()
}

suite('transpolateToFunctions Tests', function() {

    suite('basic es6 class', () => {
      // Defines a Mocha unit test
      test('Constructor, render, no this or props', () => {
        const startCode = getCode('constructorRenderNoThisOrProps_begin.js')
        const code = getCode('constructorRenderNoThisOrProps_end.js')
        const { result, } = transpolateToFunctions(startCode)
        assert.strictEqual(result.code, code)
      });

      test('Constructor, render, with this and props', () => {
        const startCode = getCode('constructorRender_begin.js')
        const code = getCode('constructorRender_end.js')
        const { result, } = transpolateToFunctions(startCode)
        assert.strictEqual(result.code, code)
      });

      test('Constructor, render and a second random func with this and props', () => {
        const startCode = getCode('constructorRenderandSecondFunc_begin.js')
        const code = getCode('constructorRenderandSecondFunc_end.js')
        const { result, } = transpolateToFunctions(startCode)
        assert.strictEqual(result.code, code)
      });

    });
});
