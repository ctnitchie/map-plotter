import React from 'react';
import ReactDOM from 'react-dom';

export class RouteUI extends React.Component {
  constructor(props) {
    super(props);
    this.plot = props.plot;
  }

  render() {
    return (
      <div>Hello World</div>
    );
  }
}

export default function render(plot, el) {
  const ui = <RouteUI plot={plot}/>;
  ReactDOM.render(ui, el);
  return ui;
}
