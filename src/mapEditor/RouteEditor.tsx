import * as React from 'react';
import { Route } from '../MapPlot';

export interface RouteEditorProps {
  routes: Route[];
  index: number;
  onChange: (r: Route) => void;
}

export default function RouteEditor(props: RouteEditorProps) {
  const route: Route = props.routes[props.index];

  function onSourceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRoute = route.mutate({previousId: e.target.value});
    props.onChange(newRoute);
  }

  function updateRoute(e: React.ChangeEvent<HTMLInputElement>, prop: string, num: boolean = false) {
    const v = num ? parseInt(e.target.value) : e.target.value;
    props.onChange(route.mutate({[prop]: v}));
  }

  return (
    <div className="pointConfig col-12">
      <div className="row">
        <select onChange={e => onSourceChange(e)}
            value={route.previousId || '--start--'}
            className="col-5">
          <option value="">Select...</option>
          <option value="--start--">(Start)</option>
          {props.routes.filter(r => !r.isDescendantOfOrSelf(route)).map(r => (
            <option key={r.id} value={r.id}>
              {r.endLabel || `(${Math.round(r.endPoint.x)}, ${Math.round(r.endPoint.y)})`}
            </option>
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
