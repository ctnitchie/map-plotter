import '../style.scss';
import * as React from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';

import RouteEditor from './RouteEditor';
import { RouteData } from '../MapPlot';
import RouteLists from './RouteLists';

import { State } from './reducers';
import { clear, reset, setStartLabel, addRoute, removeRoute, updateRoute } from './actions';

export interface RouteListener {
  onAdd: (route: RouteData, index: number) => void;
  onUpdate: (route: RouteData, index: number) => void;
  onRemove: (route: RouteData, index: number) => void;
}

interface MapListener {
  routeListener: RouteListener,
  onClear: () => void,
  onReset: () => void,
  onStartLabelChange: (v: string) => void
}

interface EditControlsProps extends State, MapListener {}

export function EditControls(props: EditControlsProps) {
  return (
    <div id="plotEditor">
      <div className="buttons">
        <button className="btn btn-sm btn-danger" onClick={props.onClear}>New Map</button>
        {' '}
        <button className="btn btn-sm btn-secondary" onClick={props.onReset}>
          Reset
        </button>
      </div>
      <div className="mainControls">
        <b>Entry Point Name: </b>
        <input type="text" value={props.data.startLabel} onChange={e => props.onStartLabelChange(e.target.value)}/>
      </div>
      <div className="routes">
        {props.data.routes.map((r, i) => (
          <RouteEditor key={r.id} index={i} route={r} map={props.data} listener={props.routeListener}/>
        ))}
      </div>
      <RouteLists map={props.data}/>
    </div>
  );
}

function mapStateToProps(state: State): State {
  return {...state};
}

function mapDispatchToProps(dispatch: Dispatch): MapListener {
  return {
    onClear: () => dispatch(clear()),
    onReset: () => dispatch(reset()),
    onStartLabelChange: (s: string) => dispatch(setStartLabel(s)),
    routeListener: {
      onAdd: (route, index) => dispatch(addRoute({route, index})),
      onRemove: (route, index) => dispatch(removeRoute({route, index})),
      onUpdate: (route, index) => dispatch(updateRoute({route, index}))
    }
  };
}

export const ConnectedEditControls = connect(mapStateToProps, mapDispatchToProps)(EditControls);

