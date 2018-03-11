'use strict'
const React = require('react')

const test = function (foo, bar) {
  return foo === bar
}

const renderTest = function(){
  return (
    <h1>test</h1>
  )
}

module.exports = {
  test,
  renderTest
}
