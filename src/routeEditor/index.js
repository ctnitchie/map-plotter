import React from 'react';
import ReactDOM from 'react-dom';

import PointConfig from './PointConfig';

export class RouteUI extends React.Component {
  constructor(props) {
    super(props);
    this.plot = props.plot;
  }

  onPointChange(p) {

  }

  render() {
    const points = [];
    points.push({label: 'Test', heading: 255});
    points.push({label: 'Test 2', heading: 355, startsAt: 'Test'});

    const pointUIs = points.map(p => <PointConfig point={p} key={p.label} onChange={this.onPointChange.bind(this)}/>);

    return (
      <div>
        {pointUIs}
      </div>
    );
  }
}

export default function render(plot, el) {
  const ui = <RouteUI plot={plot}/>;
  ReactDOM.render(ui, el);
  return ui;
}
