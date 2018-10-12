import Plot, {Point, Bounds, InstalledLine} from './Plot';

function getDistance(p1: Point, p2: Point): number {
  const b = p2.x - p1.x;
  const h = p2.y - p1.y;
  return Math.sqrt(Math.pow(b, 2) + Math.pow(h, 2));
}

function getMidpoint(p1: Point, p2: Point): Point {
  return {
    x: ((p2.x - p1.x) / 2) + p1.x,
    y: ((p2.y - p1.y) / 2) + p1.y
  };
}

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

interface AdjustedLine extends InstalledLine {
  length: number,
  halfPoint: Point
}

interface Adjustor {
  point: (p: Point) => Point;
  line: (l: InstalledLine) => AdjustedLine;
}

// Initiate the canvas and set up a function for point adjustment
function setupCanvas(canvas: HTMLCanvasElement, bounds: Bounds): Adjustor {
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
  const adjustPoint = (p: Point) => {
    return {
      ...p,
      x: adjustX(p.x),
      y: adjustY(p.y)
    };
  };
  const adjustLine = (l: InstalledLine) => {
    return {
      ...l,
      p1: adjustPoint(l.p1),
      p2: adjustPoint(l.p2),
      length: Math.round(getDistance(l.p1, l.p2)),
      halfPoint: adjustPoint(getMidpoint(l.p1, l.p2))
    }
  };
  return {
    point: adjustPoint,
    line: adjustLine
  };
}

function dot(plot: Plot, cxt: CanvasRenderingContext2D, p: Point) {
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
  canvas.parentElement.style.backgroundColor = plot.style.background;
  
  lines.filter(l => l.draw).map(adjust.line).forEach(l => {
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

  points.map(adjust.point).forEach(p => dot(plot, cxt, p));
}
