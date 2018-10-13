import * as React from 'react';
import { Route } from '../MapPlot';

export interface RouteEditorProps {
  routes: Route[];
  index: number;
  onChange: (r: Route) => void;
}

export default function RouteEditor(props: RouteEditorProps) {
  const route: Route = props.routes[props.index];
  const nonContiguous = route.previousId && props.index > 0 && props.routes[props.index - 1].id !== route.previousId;

  function onSourceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRoute = route.mutate({previousId: e.target.value});
    props.onChange(newRoute);
  }

  function updateRoute(e: React.ChangeEvent<HTMLInputElement>, prop: string, num: boolean = false) {
    const v = num ? parseInt(e.target.value) : e.target.value;
    props.onChange(route.mutate({[prop]: v}));
  }

  function updateOpt(key: string, val: any): void {
    const opts = {...route.opts, ...{[key]: val}};
    props.onChange(route.mutate({opts}));
  }

  return (
    <div className={`pointConfig card ${nonContiguous ? 'noncontiguous' : ''} ${route.opts.highlighted ? 'highlighted' : ''}`}
        onMouseEnter={e => updateOpt('highlighted', true)}
        onMouseLeave={e => updateOpt('highlighted', false)}>
      <div className="card-body">
        <div className="row">
          <b className="col-2 text-right">From:</b>
          <div className="col-4">
            <select onChange={e => onSourceChange(e)}
                value={route.previousId || '--start--'}
                style={{width: '100%'}}>
              <option value="--start--">(Start)</option>
              {props.routes.filter(r => !r.isDescendantOfOrSelf(route)).map(r => (
                <option key={r.id} value={r.id}>
                  {r.endLabel || `(${Math.round(r.endPoint.x)}, ${Math.round(r.endPoint.y)})`}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6 d-flex">
            <div className="flex-grow-1">
              <input type="number" style={{width: '100%'}} min="0" max="359"
                  onChange={e => updateRoute(e, 'heading', true)} value={route.heading}/>
            </div>
            <span>°</span>
            <div className="flex-shrink-1">
              <input type="number" style={{width: '100%'}} min="0"
                  onChange={e => updateRoute(e, 'distance', true)} value={route.distance}/>
            </div>
            <span>'</span>
          </div>
        </div>
        <div className="row">
          <b className="col-2 text-right">To:</b>
          <div className="col-10">
            <input type="text" style={{width: '100%'}} placeholder="Label"
                onChange={e => updateRoute(e, 'endLabel')} value={route.endLabel}/>
          </div>
        </div>
      </div>
    </div>
  );
}
