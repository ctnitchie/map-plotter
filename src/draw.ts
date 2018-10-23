import { Point, LineOpts, LineType, MapData, RouteData} from './MapPlot';
import { getBounds, startPoint, endPoint, getLineLabel } from './mapEditor/routeUtils';

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
  get widthRatio() {
    return this.w / this.h;
  }
  get isWide() {
    return this.widthRatio > 1;
  }
  get isTall() {
    return this.widthRatio < 1;
  }
}

interface AdjustedLine {
  p1: Point;
  p2: Point;
  label: string;
  length: number;
  halfPoint: Point;
  opts: LineOpts;
}

interface Adjustor {
  point: (p: Point) => Point;
  line: (r: RouteData) => AdjustedLine;
}

// Initiate the canvas and set up a function for point adjustment
function setupCanvas(canvas: HTMLCanvasElement, plot: MapData): Adjustor {
  const bounds = getBounds(plot.routes);
  const cvs = new Frame(canvas.offsetWidth, canvas.offsetHeight);
  const img = new Frame(bounds.width + plot.style.padding.left + plot.style.padding.right,
        bounds.height + plot.style.padding.top + plot.style.padding.bottom);
  
  canvas.width = cvs.w;
  canvas.height = cvs.h;

  const isWider = img.widthRatio > cvs.widthRatio;
  const multiplier = isWider ? cvs.w / img.w : cvs.h / img.h;

  const adjustX = (x: number) => ((x - bounds.bottomLeft.x) + plot.style.padding.left) * multiplier;
  const adjustY = (y: number) => ((bounds.topRight.y - y) + plot.style.padding.top) * multiplier;
  const adjustPoint = (p: Point) => {
    return {
      ...p,
      x: adjustX(p.x),
      y: adjustY(p.y)
    };
  };
  const adjustLine = (l: RouteData) => {
    const start = startPoint(plot.routes, l);
    const end = endPoint(plot.routes, l);
    return <AdjustedLine> {
      p1: adjustPoint(start),
      p2: adjustPoint(end),
      length: Math.round(getDistance(start, end)),
      halfPoint: adjustPoint(getMidpoint(start, end)),
      label: getLineLabel(l),
      opts: l.opts
    };
  };
  return {
    point: adjustPoint,
    line: adjustLine
  };
}

function dot(plot: MapData, cxt: CanvasRenderingContext2D, p: Point, label: boolean) {
  cxt.beginPath();
  cxt.arc(p.x, p.y, plot.style.pointRadius, 0, 2 * Math.PI);
  cxt.fillStyle = plot.style.points;
  cxt.fill();

  if (p.label && label) {
    cxt.fillStyle = plot.style.pointLabels;
    cxt.font = plot.style.pointFont;
    cxt.fillText(p.label, p.x + 5, p.y + 8);
  }
}

export default function draw(plot: MapData, canvas: HTMLCanvasElement) {
  const adjust = setupCanvas(canvas, plot);
  
  const cxt = canvas.getContext('2d');
  cxt.clearRect(0, 0, canvas.width, canvas.height);
  canvas.parentElement.style.backgroundColor = plot.style.background;

  dot(plot, cxt, adjust.point({x: 0, y: 0, label: plot.startLabel}), true);
  
  const lines = plot.routes.map(adjust.line);
  lines.filter(l => l.opts.type !== LineType.NONE).forEach(l => {
    if (l.opts.type === LineType.DASHED) {
      cxt.setLineDash([8, 6]);
    } else {
      cxt.setLineDash([]);
    }
    cxt.beginPath();
    cxt.moveTo(l.p1.x, l.p1.y);
    cxt.lineTo(l.p2.x, l.p2.y);
    cxt.lineWidth = l.opts.highlighted ? plot.style.highlightWidth : plot.style.lineWidth;
    cxt.strokeStyle = l.opts.highlighted ? plot.style.highlight : plot.style.lines;
    cxt.stroke();
    if (l.label) {
      cxt.fillStyle = plot.style.lineLabels;
      cxt.font = plot.style.lineFont;
      cxt.fillText(l.label + '', l.halfPoint.x - 17, l.halfPoint.y + 4);
    }
  });

  dot(plot, cxt, adjust.point({x: 0, y: 0}), true);
  lines.filter(l => l.opts.makeDot).forEach(l => {
    dot(plot, cxt, l.p2, l.opts.labelDot);
  });
}
