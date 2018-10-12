import {getDistance, getMidpoint} from './utils';

import Plot, * as plot from './Plot';

class Frame {
  w: number;
  h: number;
  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;
  }
  widthRatio() {
    return this.w / this.h;
  }
  isWide() {
    return this.widthRatio() > 1;
  }
  isTall() {
    return this.widthRatio() < 1;
  }
}

type Adjustor = (p: plot.Point) => plot.Point;

// Initiate the canvas and set up a function for point adjustment
function setupCanvas(canvas: HTMLCanvasElement, bounds: plot.Bounds): Adjustor {
  const wPadding = [5, 20];
  const hPadding = [5, 5];
  const cvs = new Frame(canvas.offsetWidth, canvas.offsetHeight);
  const img = new Frame(bounds.width + wPadding[0] + wPadding[1], bounds.height + hPadding[0] + hPadding[1]);

  canvas.width = cvs.w;
  canvas.height = cvs.h;

  const isWider = img.widthRatio() > cvs.widthRatio();
  const multiplier = isWider ? cvs.w / img.w : cvs.h / img.h;

  const adjustX = (x: number) => ((x - bounds.bottomLeft.x) + wPadding[0]) * multiplier;
  const adjustY = (y: number) => ((bounds.topRight.y - y) + hPadding[0]) * multiplier;
  const adjust = (p: plot.Point) => {
    return {
      ...p,
      x: adjustX(p.x),
      y: adjustY(p.y)
    };
  };

  adjust.x = adjustX;
  adjust.y = adjustY;
  return adjust;
}

function dot(plot: Plot, cxt: CanvasRenderingContext2D, p: plot.Point) {
  cxt.beginPath();
  cxt.arc(p.x, p.y, 3, 0, 2 * Math.PI);
  cxt.fillStyle = plot.style.points;
  cxt.fill();

  if (p.label) {
    cxt.fillStyle = plot.style.pointLabels;
    cxt.font = plot.style.pointFont;
    cxt.fillText(p.label, p.x + 5, p.y + 8);
  }
}

export default function draw(plot: Plot, canvas: HTMLCanvasElement) {
  const {points, lines} = plot;
  const bounds = plot.getBounds();
  const adjust = setupCanvas(canvas, bounds);
  
  const cxt = canvas.getContext('2d');
  cxt.clearRect(0, 0, canvas.width, canvas.height);
  
  lines.filter(l => l.draw).map(l => {
    return {
      ...l,
      p1: adjust(l.p1),
      p2: adjust(l.p2),
      length: Math.round(getDistance(l.p1, l.p2)),
      halfPoint: adjust(getMidpoint(l.p1, l.p2))
    };
  }).forEach(l => {
    cxt.beginPath();
    cxt.moveTo(l.p1.x, l.p1.y);
    cxt.lineTo(l.p2.x, l.p2.y);
    cxt.strokeStyle = plot.style.lines;
    cxt.stroke();
    if (l.label) {
      cxt.fillStyle = plot.style.lineLabels;
      cxt.font = plot.style.lineFont;
      cxt.fillText(l.label, l.halfPoint.x - 17, l.halfPoint.y);
    }
  });

  points.map(adjust).forEach(p => dot(plot, cxt, p));
}
