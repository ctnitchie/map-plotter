import * as React from 'react';
import { RouteData, LineType, MapData, DFLT_ROUTE_OPTS, nextId } from '../MapPlot';
import { RouteListener } from './MapEditor';
import { Dispatch } from 'redux';
import { State } from './reducers';
import { isDescendant, isDescendantOrSelf, getEndLabel, normalizeHeading } from './routeUtils';

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




interface RouteEditorProps {
  map: MapData,
  route: RouteData,
  index: number,
  listener: RouteListener
}

const NULL_START_ID = '--start--';

export default function RouteEditor({route, index, listener, map: {startLabel, routes}}: RouteEditorProps) {
  const nonContiguous = route.previousId && index > 0 && routes[index - 1].id !== route.previousId;

  function onSourceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newId = e.target.value;
    const newRoute = {...route, previousId: newId === NULL_START_ID ? null : newId};
    listener.onUpdate(newRoute, index);
  }

  function updateRoute(e: React.ChangeEvent<HTMLInputElement>, prop: string, num: boolean = false, fixFn = (x:any) => x) {
    let v = num ? parseInt(e.target.value) : e.target.value;
    v = fixFn(v);
    if (num && isNaN(v as number)) v = null;
    listener.onUpdate({...route, [prop]: v}, index);
  }

  function updateOpt(key: string, val: any): void {
    const opts = {...route.opts, ...{[key]: val}};
    listener.onUpdate({...route, opts}, index);
  }

  function addRoute() {
    listener.onAdd({
      id: nextId(),
      previousId: route.id,
      heading: 0,
      distance: 0,
      endLabel: '',
      opts: DFLT_ROUTE_OPTS
    }, index + 1);
  }

  function removeRoute() {
    listener.onRemove(route, index);
  }

  const parentOpts = [
    {
      id: NULL_START_ID,
      label: startLabel
    },
    ...routes.filter(r => !isDescendantOrSelf(routes, r, route)).map(r => {
      return {
        label: getEndLabel(routes, r),
        id: r.id
      };
    })
  ];

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
              {parentOpts.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>
          <div className="col-6 d-flex">
            <div className="flex-grow-1">
              <input type="number" style={{width: '100%'}}
                  onChange={e => updateRoute(e, 'heading', true, normalizeHeading)} value={route.heading}/>
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
            <input type="checkbox" checked={route.opts.type !== LineType.NONE && route.opts.label as boolean}
                onChange={e => updateOpt('label', e.target.checked)}
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

