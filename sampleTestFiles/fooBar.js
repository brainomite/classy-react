'use strict'
const React = require('react')

const test = function (foo, bar) {
  return foo === bar
}

const renderTest = () => (
    <h1>test</h1>
  )

module.exports = {
  test,
  renderTest
}
