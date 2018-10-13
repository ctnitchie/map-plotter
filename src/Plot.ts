import draw from './draw';

export interface Point {
  x: number;
  y: number;
  label?: string;
}

export interface LineOpts {
  label?: string | boolean,
  draw?: boolean
}

export interface StyleOptions {
  lineFont: string;
  lines: string;
  lineLabels: string;
  pointFont: string;
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

export interface PlotLine {
  readonly startsAt: Point;
  readonly endsAt: Point;
  readonly opts: LineOpts;
}

export interface RouteConfig {
  startsAt: Point;
  heading: number;
  distance: number;
  endLabel?: string;
  opts?: LineOpts;
  [key: string]: any;
}

export class Route implements PlotLine {
  startsAt: Point;
  heading: number;
  distance: number;
  endLabel?: string;
  opts: LineOpts = {};
  
  constructor(config: RouteConfig) {
    Object.assign(this, config);
    this.opts = {...{label: true, draw: true}, ...config.opts};
    if (this.opts.label === true) {
      this.opts.label = `${config.distance}' ${config.heading}°`;
    }
  }

  get endsAt(): Point {
    let orientedHeading = 90 - this.heading;
    while (orientedHeading < 0) {
      orientedHeading += 360;
    }
    const rads = orientedHeading * Math.PI / 180;
    return {
      x: this.startsAt.x + (Math.cos(rads) * this.distance),
      y: this.startsAt.y + (Math.sin(rads) * this.distance),
      label: this.endLabel
    };
  }
}

export function isSamePoint(p1: Point, p2: Point): boolean {
  return isSamePointLocation(p1, p2) && p1.label === p2.label;
}

export function isSamePointLocation(p1: Point, p2: Point): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}

export default class Plot {
  public readonly routes: Route[] = [];
  public readonly connectors: PlotLine[] = [];
  startPoint: Point = {
    x: 0,
    y: 0,
    label: 'Origin'
  };
  style: StyleOptions = {
    lineFont: '8pt sans-serif',
    lines: 'gray',
    lineLabels: 'red',
    pointFont: '10pt sans-serif',
    points: 'black',
    pointLabels: 'black',
    background: '#adf'
  };

  updateRoutes(arr: RouteConfig[]) {
    this.routes.length = 0;
    this.connectors.length = 0;
    arr.forEach(r => {
      this.addLineFrom(r.startsAt, r.heading, r.distance, r.endLabel, r.opts);
    });
  }

  get points(): Point[] {
    return [this.startPoint].concat(this.routes.map(r => r.endsAt));
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
      const p = r.endsAt;
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

  findPoint(name: string): Point {
    if (name === this.startPoint.label) {
      return this.startPoint;
    }
    const r = this.routes.find(r => r.endLabel === name);
    return r ? r.endsAt : null;
  }

  findPointOrThrow(name: string): Point {
    const p = this.findPoint(name);
    if (!p) {
      throw new Error(`No such point: ${name}`);
    }
    return p;
  }

  addLineBetween(from: Point | string, to: Point | string, opts: LineOpts = {}): PlotLine {
    opts = {...{draw: true}, ...opts};
    if (typeof from === 'string') {
      from = this.findPointOrThrow(from);
    }
    if (typeof to === 'string') {
      to = this.findPointOrThrow(to);
    }
    const route: PlotLine = {
      startsAt: from,
      endsAt: to,
      opts
    };
    this.connectors.push(route);
    return route;
  }

  addLineFrom(startsAt: Point | string, heading: number, distance: number,
      endLabel: string = undefined, opts: LineOpts = {}): Point {
    
    if (typeof startsAt === 'string') {
      startsAt = this.findPointOrThrow(startsAt);
    }
    const route = new Route({startsAt, heading, distance, endLabel, opts});
    this.routes.push(route);
    return route.endsAt;
  }

  addRoute(route: Route) {
    this.routes.push(route);
  }

  draw(canvas: HTMLCanvasElement) {
    draw(this, canvas);
  }
}