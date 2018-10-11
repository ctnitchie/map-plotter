import {relativeCoordinates} from './utils';
import draw from './draw';

export default class Plot {
  constructor(canvas) {
    this.points = [];
    this.lines = [];
    this.style = {
      lineFont: '12px sans-serif',
      lines: '#999',
      lineLabels: 'red',
      pointFont: '16px sans-serif',
      points: 'white',
      pointLabels: 'white'
    };
    this.canvas = canvas;
  }

  getBounds() {
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

  addPoint(p) {
    this.points.push(p);
    return p;
  }

  addLine(p1, p2, opts = {}) {
    const line = {
      ...{draw: true},
      ...opts,
      p1,
      p2
    };
    this.lines.push(line);
    return line;
  }

  addLineFrom(from, deg, distance, label, opts = {}) {
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