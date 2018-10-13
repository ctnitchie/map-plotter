import * as React from 'react';
import * as ReactDOM from 'react-dom';

import RouteEditor from './RouteEditor';
import { MapPlot, Route } from '../MapPlot';

export interface ChangeListener {
  onChange?: (route: Route, index: number) => void;
  onRemove?: (route: Route, index: number) => void;
  onAdd?: (route: Route, index: number) => void;
}

const dfltListener: ChangeListener = {
  onChange: r => {},
  onRemove: r => {},
  onAdd: r => {}
};

export interface RouteUIProps {
  plot: MapPlot;
  listener?: ChangeListener
}

interface UIState {
  routes: Route[];
}

export class RouteUI extends React.Component<RouteUIProps, UIState> {
  listener: ChangeListener = dfltListener;

  constructor(props: RouteUIProps) {
    super(props);
    this.state = {
      routes: props.plot.routes
    };

    const updateState = () => {
      this.setState({
        routes: this.props.plot.routes
      });
    }

    const clientListener = {...dfltListener, ...props.listener || {}};
    this.listener = {
      onChange: (route, i) => {
        clientListener.onChange(route, i);
        updateState();
      },
      onAdd(r, i) {
        clientListener.onAdd(r, i);
        updateState();
      },
      onRemove(r, i) {
        clientListener.onRemove(r, i);
        updateState();
      }
    };
  }

  render() {
    return (
      <div id="plotEditor">
        {this.state.routes.map((r, i) => (
          <RouteEditor key={i} plot={this.props.plot} listener={this.listener}
              index={i} routes={this.state.routes}/> 
        ))}
      </div>
    );
  }
}

export default function render(plot: MapPlot, el: HTMLElement, listener?: ChangeListener) {
  const ui = <RouteUI plot={plot} listener={listener}/>;
  ReactDOM.render(ui, el);
  return ui;
}
