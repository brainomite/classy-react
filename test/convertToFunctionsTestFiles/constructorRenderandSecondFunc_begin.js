class ExampleClass extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div>
        <h1>{this.props.title}</h1>
        {this.secondComp()}
      </div>);
  }
  secondComp() {
    return <h2>this is a second func</h2>;
  };
}

