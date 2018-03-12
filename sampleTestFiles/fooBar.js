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
    const a = this.a
    return (<h1>{this.test}</h1>);
  };
}
module.exports = {
  test,
  renderTest
}

//3powellardv6caspkkrdn7my66riddo3sd56mgb44ovygcolr34q
