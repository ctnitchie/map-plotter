import {getHeading, getDistance, getMidpoint} from './utils';

// Initiate the canvas and set up a function for point adjustment
function setupCanvas(canvas, bounds) {
  const wPadding = [5, 20];
  const hPadding = [5, 5];
  const wpad = wPadding[0] + wPadding[1];
  const hpad = hPadding[0] + hPadding[1];

  const cvs = {
    w: canvas.offsetWidth,
    h: canvas.offsetHeight,
    widthRatio: canvas.offsetWidth / canvas.offsetHeight
  };
  const img = {
    w: bounds.width + wpad,
    h: bounds.height + hpad,
    widthRatio: (bounds.width + wpad) / (bounds.height + hpad)
  };

  canvas.width = cvs.w;
  canvas.height = cvs.h;

  const isWide = img.widthRatio > cvs.widthRatio;
  const multiplier = isWide ? cvs.w / img.w : cvs.h / img.h;

  const adjustX = x => ((x - bounds.bottomLeft.x) + wPadding[0]) * multiplier;
  const adjustY = y => ((bounds.topRight.y - y) + hPadding[0]) * multiplier;
  const adjust = p => {
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

function dot(plot, cxt, p) {
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

export default function draw(plot, canvas) {
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
