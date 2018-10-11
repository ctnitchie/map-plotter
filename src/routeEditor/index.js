import React from 'react';
import ReactDOM from 'react-dom';

export class RouteUI extends React.Component {
  render() {
    return (
      <div>Hello World</div>
    );
  }
}

export default function render(el) {
  const ui = <RouteUI/>;
  ReactDOM.render(ui, el);
  return ui;
}
