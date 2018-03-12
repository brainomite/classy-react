const ExampleClass = props => {
  return (<div>
        <h1>{props.title}</h1>
        {secondComp()}
      </div>);
};

const secondComp = () => {
  return <h2>this is a second func</h2>;
};
