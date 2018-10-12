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

export class Route implements PlotLine {
  public endsAt: Point;

  constructor(
    public startsAt: Point,
    public heading: number,
    public distance: number,
    public endLabel: string = null,
    public opts: LineOpts = {}
  ) {
    this.opts = {...{label: true, draw: true}, ...opts};
    if (this.opts.label === true) {
      this.opts.label = `${distance}' ${heading}°`;
    }

    let orientedHeading = 90 - this.heading;
    while (orientedHeading < 0) {
      orientedHeading += 360;
    }
    const rads = orientedHeading * Math.PI / 180;
    this.endsAt = {
      x: this.startsAt.x + (Math.cos(rads) * this.distance),
      y: this.startsAt.y + (Math.sin(rads) * this.distance),
      label: this.endLabel
    };
  }
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

  addLineFrom(from: Point | string, deg: number, distance: number, label: string = undefined, opts: LineOpts = {}): Point {
    opts = {...{draw: true, label: `${distance}' ${deg}°`}, ...opts};
    if (typeof from === 'string') {
      from = this.findPointOrThrow(from);
    }
    const route = new Route(from, deg, distance, label, opts);
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