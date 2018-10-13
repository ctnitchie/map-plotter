import draw from './draw';

export type RouteId = string;

export const nextId: () => RouteId = (function() {
  let nextId = 0;
  return () => {
    return `path${++nextId}`;
  }
}());

export interface Point {
  x: number;
  y: number;
  label?: string;
}

export interface StyleOptions {
  lineFont: string;
  lines: string;
  lineLabels: string;
  pointFont: string;
  pointRadius: number;
  points: string;
  pointLabels: string;
  background: string;
}

export interface Bounds {
  bottomLeft: Point;
  bottomRight: Point;
  topLeft: Point;
  topRight: Point;
  width: number;
  height: number;
}

type LabelCB = (l: PlotLine) => string;
export const routeLabeler: LabelCB = (r: Route) => `${r.distance}' ${r.heading}°`;

export interface LineOpts {
  label?: string | boolean | LabelCB,
  draw?: boolean
}

export interface PlotLine {
  readonly startPoint: Point;
  readonly endPoint: Point;
  readonly opts: LineOpts;
}

export class Route implements PlotLine {
  constructor(
    public plot: Plot,
    public id: RouteId,
    public previousId: RouteId,
    public heading: number,
    public distance: number,
    public endLabel?: string,
    public opts: LineOpts = {}
  ) {
    this.opts = {...{label: routeLabeler, draw: true}, ...opts};
  }

  isDescendantOf(r: Route | RouteId): boolean {
    if (r instanceof Route) {
      r = r.id;
    }
    if (this.previousId === r) {
      return true;
    }
    if (!this.previousId) {
      return false;
    }
    return this.previous.isDescendantOf(r);
  }

  isDescendantOfOrSelf(r: Route | RouteId): boolean {
    if (r instanceof Route) {
      r = r.id;
    }
    return this.id === r || this.isDescendantOf(r);
  }

  get previous(): Route {
    return this.previousId ? this.plot.routesById[this.previousId] : null;
  }

  get startPoint(): Point {
    return this.previous ? this.previous.endPoint : this.plot.startPoint;
  }

  get endPoint(): Point {
    let orientedHeading = 90 - this.heading;
    while (orientedHeading < 0) {
      orientedHeading += 360;
    }
    const rads = orientedHeading * Math.PI / 180;
    const start = this.startPoint;
    return {
      x: start.x + (Math.cos(rads) * this.distance),
      y: start.y + (Math.sin(rads) * this.distance),
      label: this.endLabel
    };
  }

  clone(): Route {
    return new Route(this.plot, this.id, this.previousId, this.heading,
        this.distance, this.endLabel, this.opts);
  }

  mutate(update: any): Route {
    const c = this.clone();
    Object.assign(c, update);
    return c;
  }
}

export function isSamePoint(p1: Point, p2: Point): boolean {
  return isSamePointLocation(p1, p2) && p1.label === p2.label;
}

export function isSamePointLocation(p1: Point, p2: Point): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}

export default class Plot {
  readonly routesById: {[id: string]: Route} = {};
  readonly connectors: PlotLine[] = [];
  startLabel: string = 'Origin';
  readonly style: StyleOptions = {
    lineFont: '8pt sans-serif',
    lines: 'gray',
    lineLabels: 'red',
    pointFont: '10pt sans-serif',
    pointRadius: 3,
    points: 'black',
    pointLabels: 'black',
    background: '#adf'
  };

  get startPoint(): Point {
    return {x: 0, y: 0, label: this.startLabel};
  }

  get routes(): Route[] {
    return Object.keys(this.routesById).map(id => this.routesById[id]);
  }

  updateRoute(r: Route): void {
    this.routesById[r.id] = r;
  }

  get points(): Point[] {
    const arr: Point[] = this.routes.map(r => r.endPoint);
    return [this.startPoint].concat(arr);
  }

  get lines(): PlotLine[] {
    return [...this.routes, ...this.connectors];
  }

  get bounds(): Bounds {
    let minX = 0;
    let maxX = 10;
    let minY = 0;
    let maxY = 10;
    this.routes.forEach(r => {
      const p = r.endPoint;
      minX = Math.min(p.x, minX);
      minY = Math.min(p.y, minY);
      maxX = Math.max(p.x, maxX);
      maxY = Math.max(p.y, maxY);
    });
    return {
      bottomLeft: {
        x: minX,
        y: minY
      },
      bottomRight: {
        x: maxX,
        y: minY
      },
      topLeft: {
        x: minX,
        y: maxY
      },
      topRight: {
        x: maxX,
        y: maxY
      },
      width: maxX - minX,
      height: maxY - minY
    };
  }

  addConnector(from: Point, to: Point, opts: LineOpts = {}): PlotLine {
    opts = {...{draw: true}, ...opts};
    const route: PlotLine = {
      startPoint: from,
      endPoint: to,
      opts
    };
    this.connectors.push(route);
    return route;
  }

  addRoute(previous: Route, heading: number, distance: number,
      endLabel: string = undefined, opts: LineOpts = {}): Route {
    
    const prevId = previous ? previous.id : null;
    const route = new Route(this, nextId(), prevId, heading,
        distance, endLabel, opts);
    this.routesById[route.id] = route;
    return route;
  }

  addRouteObject(route: Route) {
    this.routes.push(route);
  }

  draw(canvas: HTMLCanvasElement) {
    draw(this, canvas);
  }
}