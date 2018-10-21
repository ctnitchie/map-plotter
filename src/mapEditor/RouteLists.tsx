import * as React from 'react';
import { MapPlot, Route, LineType } from '../MapPlot';

export interface RouteListsProps {
  plot: MapPlot;
}

interface RouteLineProps {
  plot: MapPlot;
  line: Route;
  reverse?: boolean;
}

function invert(heading: number): number {
  let n = heading - 180;
  while (n < 0) {
    n += 360;
  }
  return n;
}

function RouteLine(props: RouteLineProps) {
  const startLbl = props.line.previousId ? props.line.previous.endLabel : props.plot.startLabel;
  let lbl;
  if (props.reverse) {
    lbl = `${props.line.endLabel} - ${startLbl}: ${invert(props.line.heading)}°, ${props.line.distance}'\n`;
  } else {
    lbl = `${startLbl} - ${props.line.endLabel}: ${props.line.heading}°, ${props.line.distance}'\n`;
  }
  return (
    <code>
      {lbl}
    </code>
  )
}

function shouldList(r: Route) {
  return r.opts.type!== LineType.NONE && r.endLabel && (!r.previousId || (r.previousId && r.previous.endLabel));
}

export default function(props: RouteListsProps) {
  const routes = props.plot.routes.filter(shouldList);
  return (
    <div className="row">
      <div className="col-12 col-md-6">
        <pre>
          {routes.map(r => (
            <RouteLine key={r.id} plot={props.plot} line={r}/>
          ))}
        </pre>
      </div>
      <div className="col-12 col-md-6">
        <pre>
          {routes.map(r => (
            <RouteLine key={r.id} plot={props.plot} line={r} reverse={true}/>
          ))}
        </pre>
    </div>
  </div>
  );
}
