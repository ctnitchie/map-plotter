import * as React from 'react';
import * as ReactDOM from 'react-dom';

import RouteEditor from './RouteEditor';
import Plot, { RouteConfig, Point, isSamePoint, Route } from '../Plot';
import { replace, replaceAt, updateMany } from './utils';

export interface RouteUIProps {
  plot: Plot;
  onChange?: (arr: RouteConfig[]) => void;
}

interface UIState {
  routes: RouteConfig[];
  points: Point[];
}

export class RouteUI extends React.Component<RouteUIProps, UIState> {
  constructor(props: RouteUIProps) {
    super(props);
    this.state = {
      routes: props.plot.routes.map(r => {
        return {...r};
      }),
      points: props.plot.points
    };
  }

  onRouteChange(index: number, route: RouteConfig) {
    const oldEndPoint = new Route(this.state.routes[index]).endsAt;
    const newEndPoint = new Route(route).endsAt;
    const newRoutes = replaceAt(this.state.routes, index, route);
    const newState = {
      routes: updateMany(newRoutes, r => isSamePoint(r.startsAt, oldEndPoint),
          r => {return {...r, startsAt: newEndPoint};}),
      points: replace(this.state.points, oldEndPoint, newEndPoint, isSamePoint)
    };
    this.setState(newState);
    if (this.props.onChange) {
      this.props.onChange(newState.routes);
    }
  }

  render() {
    return (
      <div>
        {this.state.routes.map((r, i) => (
          <RouteEditor key={i} index={i} routes={this.state.routes}
              points={this.state.points}
              onChange={r => this.onRouteChange(i, r)}/> 
        ))}
      </div>
    );
  }
}

export default function render(plot: Plot, el: HTMLElement, onChange?: (arr: RouteConfig[]) => void) {
  const ui = <RouteUI plot={plot} onChange={onChange}/>;
  ReactDOM.render(ui, el);
  return ui;
}
