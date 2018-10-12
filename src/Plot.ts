import {relativeCoordinates} from './utils';
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

export interface InstalledLine {
  p1: Point;
  p2: Point;
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

export default class Plot {
  private points: Point[] = [];
  private pointsByLabel: {[label: string]: Point} = {};
  private lines: InstalledLine[];
  originName: string = 'Origin';
  style: StyleOptions = {
    lineFont: '12pt Sans Serif',
    lines: 'gray',
    lineLabels: 'red',
    pointFont: '14pt Sans Serif',
    points: 'black',
    pointLabels: 'black'
  };
  canvas: Element;

  constructor(canvas: Element) {
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

  addLineFrom(from: Point | string, deg: number, distance: number, label: string, opts = {}) {
    opts = {...{label: true}, ...opts};
    if (typeof from === 'string') {
      const pfrom = this.points.find(p => p.label === from);
      if (!pfrom) {
        throw new Error(`No such point: ${from}`);
      }
      from = pfrom;
    }
    const rel = relativeCoordinates(deg, distance);
    const newP = {
      x: from.x + rel.x,
      y: from.y + rel.y,
      label
    };
    this.points.push(newP);
    this.addLine(from, newP, {
      ...opts,
      label: opts.label && typeof opts.label !== 'string' ? `${distance}' ${deg}°` : null
    });
    return newP;
  }

  draw(canvas = this.canvas) {
    draw(this, canvas);
  }
}