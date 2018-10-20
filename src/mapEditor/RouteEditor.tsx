import * as React from 'react';
import { Route, MapPlot, LineType } from '../MapPlot';
import { ChangeListener } from './MapEditor';

export interface RouteEditorProps {
  plot: MapPlot;
  routes: Route[];
  index: number;
  listener: ChangeListener
}

interface LineTypeSelectorProps {
  type: LineType
  onChange: (t: LineType) => void
}

function LineTypeSelector(props: LineTypeSelectorProps) {
  function update(e: React.ChangeEvent<HTMLSelectElement>) {
    props.onChange(parseInt(e.target.value) as LineType);
  }
  return (
    <select value={props.type} onChange={update}>
      <option value={LineType.SOLID}>Solid</option>
      <option value={LineType.DASHED}>Dashed</option>
      <option value={LineType.NONE}>No Line</option>
    </select>
  );
}

export default function RouteEditor(props: RouteEditorProps) {
  const route: Route = props.routes[props.index];
  const nonContiguous = route.previousId && props.index > 0 && props.routes[props.index - 1].id !== route.previousId;

  function onSourceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newId = e.target.value;
    const newRoute = route.mutate({previousId: newId === '--start--' ? null : newId});
    props.listener.onChange(newRoute, props.index);
  }

  function updateRoute(e: React.ChangeEvent<HTMLInputElement>, prop: string, num: boolean = false) {
    let v = num ? parseInt(e.target.value) : e.target.value;
    if (num && isNaN(v as number)) v = null;
    props.listener.onChange(route.mutate({[prop]: v}), props.index);
  }

  function updateOpt(key: string, val: any): void {
    const opts = {...route.opts, ...{[key]: val}};
    props.listener.onChange(route.mutate({opts}), props.index);
  }

  function addRoute() {
    props.listener.onAdd(new Route(props.plot, route.id, 0, 0, ''), props.index + 1);
  }

  function removeRoute() {
    props.listener.onRemove(route, props.index);
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
              <option value="--start--">{props.plot.startLabel}</option>
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
        <div className="row" style={{marginTop: '4px'}}>
          <div className="col-8">
            Type: {' '}
            <LineTypeSelector type={route.opts.type} onChange={t => updateOpt('type', t)}/>
            <input type="checkbox" checked={route.opts.type !== LineType.NONE && route.opts.showLabel}
                onChange={e => updateOpt('showLabel', e.target.checked)}
                disabled={route.opts.type === LineType.NONE}/> Label Line
            <input type="checkbox" checked={route.opts.makeDot}
                onChange={e => updateOpt('makeDot', e.target.checked)}/> Draw Dot
            <input type="checkbox" checked={route.opts.makeDot && route.opts.labelDot}
                onChange={e => updateOpt('labelDot', e.target.checked)}
                disabled={!route.opts.makeDot}/> Label Dot
          </div>
          <div className="col-4 text-right">
            <button className="btn btn-sm btn-success" onClick={addRoute}>Add</button>
            <button className="btn btn-sm btn-danger" onClick={removeRoute}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}
