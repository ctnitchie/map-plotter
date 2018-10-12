import draw from './draw';

export interface Line {
  fromPoint: Point;
  heading: number;
  label?: string;
}

export interface Point {
  x: number;
  y: number;
  label?: string;
}

export interface LineOpts {
  label?: string | boolean,
  draw?: boolean
}

export interface InstalledLine extends LineOpts {
  p1: Point;
  p2: Point;
  label?: string;
}

export interface StyleOptions {
  lineFont: string;
  lines: string;
  lineLabels: string;
  pointFont: string;
  points: string;
  pointLabels: string;
}

export interface Bounds {
  bottomLeft: Point;
  bottomRight: Point;
  topLeft: Point;
  topRight: Point;
  width: number;
  height: number;
}

export function toRads(deg: number): number {
  let r = 90 - deg;
  while (r < 0) {
    r += 360;
  }
  return r * Math.PI / 180;
}

export function relativeCoordinates(deg: number, distance: number): Point {
  const rads = toRads(deg);
  return {
    x: Math.cos(rads) * distance,
    y: Math.sin(rads) * distance
  };
}

export default class Plot {
  points: Point[] = [];
  lines: InstalledLine[];
  originName: string = 'Origin';
  style: StyleOptions = {
    lineFont: '12pt Sans Serif',
    lines: 'gray',
    lineLabels: 'red',
    pointFont: '14pt Sans Serif',
    points: 'black',
    pointLabels: 'black'
  };
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  getBounds(): Bounds {
    let minX = 0;
    let maxX = 10;
    let minY = 0;
    let maxY = 10;
    this.points.forEach(p => {
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

  addPoint(p: Point): Point {
    this.points.push(p);
    return p;
  }

  findPoint(name: string): Point {
    return this.points.find(p => p.label === name);
  }

  findPointOrThrow(name: string): Point {
    const p = this.findPoint(name);
    if (!p) {
      throw new Error(`No such point: ${name}`);
    }
    return p;
  }

  addLineBetween(from: Point | string, to: Point, opts: LineOpts = {}): InstalledLine {
    if (typeof from === 'string') {
      from = this.findPointOrThrow(from);
    }
    const l: InstalledLine = {
      ...opts,
      p1: from,
      p2: to,
      label: typeof opts.label === 'string' ? opts.label : null
    };
    this.lines.push(l);
    return l;
  }

  addLineFrom(from: Point | string, deg: number, distance: number, label: string = undefined, opts: LineOpts = {}) {
    opts = {...{label: true}, ...opts};
    if (typeof from === 'string') {
      from = this.findPointOrThrow(from);
    }
    const rel = relativeCoordinates(deg, distance);
    const newP = {
      x: from.x + rel.x,
      y: from.y + rel.y,
      label
    };
    this.points.push(newP);
    this.addLineBetween(from, newP, {
      ...opts,
      label: typeof opts.label !== 'string' ? `${distance}' ${deg}°` : null
    });
    return newP;
  }

  draw(canvas = this.canvas) {
    draw(this, canvas);
  }
}