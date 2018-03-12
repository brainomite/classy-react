'use strict'
const React = require('react')

const test = function () {
  const a = <h1>test</h1>
  const b = (<h2>test</h2>)
  return a < b ? a : b
}

class renderTest extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    this.a()
  };
}


module.exports = {
  test,
  renderTest
}
