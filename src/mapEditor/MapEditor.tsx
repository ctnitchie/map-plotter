import * as React from 'react';
import * as ReactDOM from 'react-dom';


import RouteEditor from './RouteEditor';
import { MapPlot, Route } from '../MapPlot';
import RouteLists from './RouteLists';

export interface ChangeListener {
  onChange?: (route: Route, index: number) => void;
  onRemove?: (route: Route, index: number) => void;
  onAdd?: (route: Route, index: number) => void;
  onReset: () => MapPlot;
  onClear: () => MapPlot;
  onStartPointChange: (v: string) => void;
}

const dfltListener: ChangeListener = {
  onStartPointChange: v => {},
  onChange: r => {},
  onRemove: r => {},
  onAdd: r => {},
  onReset: () => null,
  onClear: () => null
};

export interface RouteUIProps {
  plot: MapPlot;
  listener?: ChangeListener
}

interface UIState {
  plot: MapPlot;
  startName: string;
  routes: Route[];
}

export class RouteUI extends React.Component<RouteUIProps, UIState> {
  listener: ChangeListener = dfltListener;

  constructor(props: RouteUIProps) {
    super(props);
    this.state = {
      plot: props.plot,
      startName: this.props.plot.startLabel,
      routes: props.plot.routes
    };

    const updateRoutes = () => {
      this.setState({
        routes: this.state.plot.routes
      });
    }

    const clientListener = {...dfltListener, ...props.listener || {}};
    this.listener = {
      onStartPointChange: v => {
        clientListener.onStartPointChange(v);
        this.setState({startName: v});
      },
      onChange: (route, i) => {
        clientListener.onChange(route, i);
        updateRoutes();
      },
      onAdd(r, i) {
        clientListener.onAdd(r, i);
        updateRoutes();
      },
      onRemove(r, i) {
        clientListener.onRemove(r, i);
        updateRoutes();
      },
      onReset: () => {
        if (!confirm('Are you sure you want to reset? This will discard all changes from the original map.')) {
          return;
        }
        const newMap = clientListener.onReset();
        this.setState({
          plot: newMap,
          startName: newMap.startLabel,
          routes: newMap.routes
        });
        return newMap;
      },
      onClear: () => {
        if (!confirm('Are you sure you want to start all over with an empty map?')) {
          return;
        }
        const newMap = clientListener.onClear();
        this.setState({
          plot: newMap,
          startName: newMap.startLabel,
          routes: newMap.routes
        });
        return newMap;
      }
    };
  }

  render() {
    return (
      <div id="plotEditor">
        <div className="buttons">
          <button className="btn btn-sm btn-danger" onClick={this.listener.onClear}>New Map</button>
          {' '}
          <button className="btn btn-sm btn-secondary" onClick={this.listener.onReset}>
            Reset
          </button>
        </div>
        <div className="mainControls">
          <b>Entry Point Name: </b>
          <input type="text" value={this.state.startName} onChange={e => this.listener.onStartPointChange(e.target.value)}/>
        </div>
        <div className="routes">
          {this.state.routes.map((r, i) => (
            <RouteEditor key={i} plot={this.state.plot} listener={this.listener}
                index={i} routes={this.state.routes}/> 
          ))}
        </div>
        <RouteLists plot={this.state.plot}/>
      </div>
    );
  }
}

export default function render(plot: MapPlot, el: HTMLElement, listener?: ChangeListener) {
  const ui = <RouteUI plot={plot} listener={listener}/>;
  ReactDOM.render(ui, el);
  return ui;
}
