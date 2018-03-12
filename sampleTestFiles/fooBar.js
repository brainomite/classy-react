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
    return (<h1>{this.props.test}</h1>);
  };
}
module.exports = {
  test,
  renderTest
}
