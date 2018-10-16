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
  highlight: string;
  lineWidth: number;
  highlightWidth: number;
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

export enum LineType {
  SOLID,
  DASHED,
  NONE
}

export interface LineOpts {
  label?: LabelCB,
  showLabel?: boolean,
  type?: LineType,
  makeDot?: boolean,
  labelDot?: boolean,
  highlighted?: boolean
}

export const DFLT_LINE_OPTS: LineOpts = {
  showLabel: true,
  type: LineType.SOLID,
  makeDot: true,
  labelDot: true,
  highlighted: false
};

export const DFLT_ROUTE_OPTS: LineOpts = {
  ...DFLT_LINE_OPTS,
  label: routeLabeler
};

export const DFLT_JOIN_OPTS: LineOpts = {
  ...DFLT_LINE_OPTS,
  labelDot: false
};

export const DFLT_STYLE: StyleOptions = {
  lineFont: '8pt sans-serif',
  lines: 'gray',
  lineLabels: 'red',
  pointFont: '10pt sans-serif',
  pointRadius: 3,
  points: 'black',
  pointLabels: 'black',
  background: '#adf',
  highlight: 'red',
  lineWidth: 1,
  highlightWidth: 3
};

export interface PlotLine {
  readonly startPoint: Point;
  readonly endPoint: Point;
  readonly opts: LineOpts;
}

export class Route implements PlotLine {
  constructor(
    public plot: MapPlot,
    public previousId: RouteId,
    public heading: number,
    public distance: number,
    public endLabel?: string,
    public opts: LineOpts = {},
    public id: RouteId = nextId()
  ) {
    this.opts = {...DFLT_ROUTE_OPTS, ...opts};
  }

  isDescendantOf(r: Route | RouteId): boolean {
    if (!this.previousId) {
      return false;
    }
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
    return this.previousId ? this.plot.route(this.previousId) : null;
  }

  get startPoint(): Point {
    return this.previous ? this.previous.endPoint : this.plot.startPoint;
  }

  get endPoint(): Point {
    const heading = this.heading === null ? 0 : this.heading;
    const distance = this.distance === null ? 0 : this.distance;
    let orientedHeading = 90 - heading;
    while (orientedHeading < 0) {
      orientedHeading += 360;
    }
    const rads = orientedHeading * Math.PI / 180;
    const start = this.startPoint;
    return {
      x: start.x + (Math.cos(rads) * distance),
      y: start.y + (Math.sin(rads) * distance),
      label: this.endLabel
    };
  }

  clone(): Route {
    return new Route(this.plot, this.previousId, this.heading,
        this.distance, this.endLabel, this.opts, this.id);
  }

  mutate(update: any): Route {
    const c = this.clone();
    Object.assign(c, update);
    return c;
  }
}

export class Connector implements PlotLine {
  constructor(
    public plot: MapPlot,
    public r1: RouteId,
    public r2: RouteId,
    public opts: LineOpts
  ) {
    this.opts = {...DFLT_JOIN_OPTS, ...opts};
  }
  
  get startPoint(): Point {
    if (!this.r1) {
      return this.plot.startPoint;
    }
    return this.plot.route(this.r1).endPoint;
  }

  get endPoint(): Point {
    return this.plot.route(this.r2).endPoint;
  }
}

export function isSamePoint(p1: Point, p2: Point): boolean {
  return isSamePointLocation(p1, p2) && p1.label === p2.label;
}

export function isSamePointLocation(p1: Point, p2: Point): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}

export interface MapData {
  startLabel: string;
  _routes: Route[];
  _connectors: Connector[];
  style: StyleOptions;
}

const EMPTY_PLOT: MapData = {
  startLabel: 'Origin',
  _routes: [],
  _connectors: [],
  style: DFLT_STYLE
};

export class MapPlot {
  startLabel: string;
  private readonly _routes: Route[];
  private readonly _connectors: Connector[];
  public readonly style: StyleOptions;

  constructor(data: MapData = EMPTY_PLOT) {
    Object.assign(this, data);
  }

  get startPoint(): Point {
    return {x: 0, y: 0, label: this.startLabel};
  }

  route(id: RouteId): Route {
    return this._routes.find(r => r.id === id);
  }

  get routes(): Route[] {
    return [...this._routes];
  }

  get connectors(): Connector[] {
    return [...this._connectors];
  }

  updateRoute(r: Route): void {
    const index = this._routes.findIndex(rt => rt.id === r.id);
    if (index === -1) {
      throw new Error(`No such route: ${r.id}`);
    }
    this._routes[index] = r;
  }

  get points(): Point[] {
    const arr: Point[] = this._routes.filter(r => r.opts.makeDot).map(r => r.endPoint);
    return [this.startPoint].concat(arr);
  }

  get lines(): PlotLine[] {
    return [...this._routes, ...this._connectors];
  }

  get bounds(): Bounds {
    let minX = 0;
    let maxX = 10;
    let minY = 0;
    let maxY = 10;
    this._routes.forEach(r => {
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

  addConnector(from: Route, to: Route, opts: LineOpts = {}): PlotLine {
    opts = {...{draw: true}, ...opts};
    const route: Connector = new Connector(this, from ? from.id : null, to.id, opts);
    this._connectors.push(route);
    return route;
  }

  addRoute(previous: Route, heading: number, distance: number,
      endLabel: string = undefined, opts: LineOpts = {}): Route {
    
    const prevId = previous ? previous.id : null;
    const route = new Route(this, prevId, heading,
        distance, endLabel, opts);
    this._routes.push(route);
    return route;
  }

  addRouteObject(route: Route, index: number = this._routes.length) {
    this._routes.splice(index, 0, route);
  }

  addRouteObjectAfter(route: Route, after: Route | RouteId) {
    if (after instanceof Route) {
      after = after.id;
    }
    const index = this._routes.findIndex(r => r.id === after);
    if (index === -1) {
      throw new Error(`No such route: ${after}`);
    }
    this.addRouteObject(route, index + 1);
  }

  draw(canvas: HTMLCanvasElement) {
    draw(this, canvas);
  }

  deleteRoute(route: RouteId | Route) {
    if (route instanceof Route) {
      route = route.id;
    }
    this._routes.filter(r => r.previousId === route).forEach(r => this.deleteRoute(r));
    const index = this._routes.findIndex(r => r.id === route);
    if (index === -1) return;
    this._routes.splice(index, 1);
    for (let i = 0; i < this._connectors.length; i++) {
      const c = this._connectors[i];
      if (c.r1 === route || c.r2 === route) {
        this._connectors.splice(i, 1);
        i--;
      }
    }
  }
}