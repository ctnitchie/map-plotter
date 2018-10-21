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
  lineFont?: string;
  lines?: string;
  lineLabels?: string;
  pointFont?: string;
  pointRadius?: number;
  points?: string;
  pointLabels?: string;
  background?: string;
  highlight?: string;
  lineWidth?: number;
  highlightWidth?: number;
  padding?: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }
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
export const nullLabeler: LabelCB = () => '';

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
  label: nullLabeler
};

export const DFLT_JOIN_OPTS: LineOpts = {
  ...DFLT_LINE_OPTS,
  labelDot: false
};

export const DFLT_STYLE: StyleOptions = {
  lineFont: '8pt sans-serif',
  lines: 'white',
  lineLabels: 'red',
  pointFont: '10pt sans-serif',
  pointRadius: 3,
  points: 'yellow',
  pointLabels: 'yellow',
  background: '#006',
  highlight: 'red',
  lineWidth: 1,
  highlightWidth: 3,
  padding: {
    left: 5,
    right: 20,
    top: 5,
    bottom: 5
  }
};

export interface PlotLine {
  readonly startPoint: Point;
  readonly endPoint: Point;
  readonly opts: LineOpts;
}

export interface RouteData {
  previousId: RouteId,
  heading: number,
  distance: number,
  endLabel?: string,
  opts?: LineOpts,
  id?: RouteId
}

export class Route implements PlotLine {
  previousId: RouteId;
  heading: number;
  distance: number;
  endLabel?: string;
  opts: LineOpts;
  id: RouteId;

  constructor(
    public plot: MapPlot,
    data: RouteData
  ) {
    Object.assign(this, data);
    this.opts = {...DFLT_ROUTE_OPTS, ...data.opts, ...{highlighted: false}};
    this.id = data.id || nextId();
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

  getData(): RouteData {
    return {
      previousId: this.previousId,
      heading: this.heading,
      distance: this.distance,
      endLabel: this.endLabel,
      opts: this.opts,
      id: this.id
    };
  }

  clone(): Route {
    return new Route(this.plot, this.getData());
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

export interface MapData {
  startLabel: string;
  routes: RouteData[];
  style: StyleOptions;
}

export const EMPTY_PLOT: MapData = {
  startLabel: 'Origin',
  routes: [],
  style: DFLT_STYLE
};

export class MapPlot {
  startLabel: string;
  private readonly _routes: Route[];
  public readonly style: StyleOptions;

  constructor(data: MapData = EMPTY_PLOT) {
    this.startLabel = data.startLabel;
    this.style = {...DFLT_STYLE, ...data.style};
    this._routes = data.routes.map(r => new Route(this, r));
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
    return [...this._routes];
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

  addRoute(previous: Route, heading: number, distance: number,
      endLabel: string = undefined, opts: LineOpts = {}): Route {

    const previousId = previous ? previous.id : null;
    const route = new Route(this, {previousId, heading,
        distance, endLabel, opts, id: nextId()});
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
  }

  getData(): MapData {
    return {
      startLabel: this.startLabel,
      routes: this._routes.map(r => r.getData()),
      style: this.style
    };
  }

  clone(): MapPlot {
    return new MapPlot(this.getData());
  }
}