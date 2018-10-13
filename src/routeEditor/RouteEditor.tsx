import * as React from 'react';
import Plot, { Route, RouteConfig, Point, isSamePoint } from '../Plot';

export interface RouteEditorProps {
  routes: RouteConfig[];
  index: number;
  points: Point[];
  onChange: (r: RouteConfig) => void;
}

export default function RouteEditor(props: RouteEditorProps) {
  const route: RouteConfig = props.routes[props.index];

  function onSourceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const index: number = parseInt(e.target.value);
    const p: Point = props.points[index];
    props.onChange({...route, startsAt: p});
  }

  function updateRoute(e: React.ChangeEvent<HTMLInputElement>, prop: string, num: boolean = false) {
    const newRoute: RouteConfig = {...route};
    const v = num ? parseInt(e.target.value) : e.target.value;
    newRoute[prop] = v;
    props.onChange(newRoute);
  }

  return (
    <div className="pointConfig col-12">
      <div className="row">
        <select onChange={onSourceChange}
            value={props.points.findIndex(p => isSamePoint(p, route.startsAt))}
            className="col-5">
          <option value="">Select...</option>
          {props.points.map((p, index) => (
            <option key={index} value={index}>{p.label}</option>
          ))}
        </select>
        <input type="text" className="col-5" placeholder="Label"
            onChange={e => updateRoute(e, 'endLabel')} value={route.endLabel}/>
        <input type="number" className="col-2" min="0" max="359"
            onChange={e => updateRoute(e, 'heading', true)} value={route.heading}/>
      </div>
    </div>
  );
}
