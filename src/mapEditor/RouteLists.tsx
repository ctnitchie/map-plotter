import * as React from 'react';
import { RouteData, MapData, LineType } from '../MapPlot';
import { getStartLabel, getEndLabel, previous } from './routeUtils';

export interface RouteListsProps {
  map: MapData
}

interface RouteLineProps {
  map: MapData,
  line: RouteData;
  reverse?: boolean;
}

function invert(heading: number): number {
  let n = heading - 180;
  while (n < 0) {
    n += 360;
  }
  return n;
}

function RouteLine({line, map, reverse}: RouteLineProps) {
  const startLbl = line.previousId ? getStartLabel(map.routes, line) : map.startLabel;
  const endLbl = getEndLabel(map.routes, line);
  let lbl;
  if (reverse) {
    lbl = `${endLbl} - ${startLbl}: ${invert(line.heading)}°, ${line.distance}'\n`;
  } else {
    lbl = `${startLbl} - ${endLbl}: ${line.heading}°, ${line.distance}'\n`;
  }
  return (
    <code>
      {lbl}
    </code>
  )
}

function shouldList(arr: RouteData[], r: RouteData) {
  if (r.opts.type === LineType.NONE || !r.endLabel) {
    return false;
  }
  const prev = previous(arr, r);
  return !prev || prev.endLabel;
}

export default function({map}: RouteListsProps) {
  const routes = map.routes.filter(r => shouldList(map.routes, r));
  return (
    <div className="row">
      <div className="col-12 col-md-6">
        <pre>
          {routes.map(r => (
            <RouteLine key={r.id} map={map} line={r}/>
          ))}
        </pre>
      </div>
      <div className="col-12 col-md-6">
        <pre>
          {routes.map(r => (
            <RouteLine key={r.id} map={map} line={r} reverse={true}/>
          ))}
        </pre>
    </div>
  </div>
  );
}
