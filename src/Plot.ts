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

export interface Route {
  readonly startsAt: Point;
  readonly endsAt: Point;
  readonly endLabel: string;
  readonly opts: LineOpts;
}

export class HeadingRoute implements Route {
  constructor(
    public startsAt: Point,
    private heading: number,
    private distance: number,
    public endLabel: string = null,
    public opts: LineOpts = {}
  ) {}

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

export default class Plot {
  private _routes: Route[] = [];
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
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  get routes(): Route[] {
    return [...this._routes];
  }

  get points(): Point[] {
    return [this.startPoint].concat(this._routes.map(r => r.endsAt));
  }

  get bounds(): Bounds {
    let minX = 0;
    let maxX = 10;
    let minY = 0;
    let maxY = 10;
    this._routes.forEach(r => {
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
    const r = this._routes.find(r => r.endLabel === name);
    return r ? r.endsAt : null;
  }

  findPointOrThrow(name: string): Point {
    const p = this.findPoint(name);
    if (!p) {
      throw new Error(`No such point: ${name}`);
    }
    return p;
  }

  addLineBetween(from: Point | string, to: Point | string, opts: LineOpts = {}): Route {
    opts = {...{draw: true}, ...opts};
    if (typeof from === 'string') {
      from = this.findPointOrThrow(from);
    }
    if (typeof to === 'string') {
      to = this.findPointOrThrow(to);
    }
    const route: Route = {
      startsAt: from,
      endsAt: to,
      endLabel: to.label,
      opts
    };
    this._routes.push(route);
    return route;
  }

  addLineFrom(from: Point | string, deg: number, distance: number, label: string = undefined, opts: LineOpts = {}): Point {
    opts = {...{draw: true, label: `${distance}' ${deg}°`}, ...opts};
    if (typeof from === 'string') {
      from = this.findPointOrThrow(from);
    }
    const route = new HeadingRoute(from, deg, distance, label, opts);
    this._routes.push(route);
    return route.endsAt;
  }

  addRoute(route: Route) {
    this._routes.push(route);
  }

  draw(canvas = this.canvas) {
    draw(this, canvas);
  }
}