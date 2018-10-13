import * as React from 'react';
import * as ReactDOM from 'react-dom';

import RouteEditor from './RouteEditor';
import Plot, { Route, Point, isSamePoint } from '../Plot';
import { replace, replaceAt, updateMany } from './utils';

export interface RouteUIProps {
  plot: Plot;
  onChange?: (route: Route) => void;
}

interface UIState {
  routes: Route[];
}

export class RouteUI extends React.Component<RouteUIProps, UIState> {
  constructor(props: RouteUIProps) {
    super(props);
    this.state = {
      routes: props.plot.routes
    };
  }

  onRouteChange(index: number, route: Route) {
    this.props.plot.updateRoute(route);
    this.setState({
      routes: this.props.plot.routes
    });
    if (this.props.onChange) {
      this.props.onChange(route);
    }
  }

  render() {
    return (
      <div>
        {this.state.routes.map((r, i) => (
          <RouteEditor key={i} index={i} routes={this.state.routes}
              onChange={r => this.onRouteChange(i, r)}/> 
        ))}
      </div>
    );
  }
}

export default function render(plot: Plot, el: HTMLElement, onChange?: (route: Route) => void) {
  const ui = <RouteUI plot={plot} onChange={onChange}/>;
  ReactDOM.render(ui, el);
  return ui;
}
