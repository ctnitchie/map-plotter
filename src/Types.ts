export type RouteId = string;

export const nextId: () => RouteId = (function() {
  let nextId = 0;
  return () => {
    return `path${++nextId}`;
  }
}());

export interface Point {
  x: number;
  y: number;
  label?: string;
}

export interface StyleOptions {
  lineFont?: string;
  lines?: string;
  lineLabels?: string;
  pointFont?: string;
  pointRadius?: number;
  points?: string;
  pointLabels?: string;
  background?: string;
  highlight?: string;
  lineWidth?: number;
  highlightWidth?: number;
  padding?: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }
}

export interface Bounds {
  bottomLeft: Point;
  bottomRight: Point;
  topLeft: Point;
  topRight: Point;
  width: number;
  height: number;
}

type LabelCB = (l: PlotLine) => string;

export enum LineType {
  SOLID,
  DASHED,
  NONE
}

export interface LineOpts {
  label?: boolean,
  customLabel?: string,
  type?: LineType,
  makeDot?: boolean,
  labelDot?: boolean,
  highlighted?: boolean
}

export const DFLT_ROUTE_OPTS: LineOpts = {
  label: true,
  type: LineType.SOLID,
  makeDot: true,
  labelDot: true,
  highlighted: false
};

export const DFLT_STYLE: StyleOptions = {
  lineFont: '8pt sans-serif',
  lines: 'white',
  lineLabels: 'red',
  pointFont: '10pt sans-serif',
  pointRadius: 3,
  points: 'yellow',
  pointLabels: 'yellow',
  background: '#006',
  highlight: 'red',
  lineWidth: 1,
  highlightWidth: 3,
  padding: {
    left: 5,
    right: 20,
    top: 5,
    bottom: 5
  }
};

export interface PlotLine {
  readonly startPoint: Point;
  readonly endPoint: Point;
  readonly opts: LineOpts;
}

export interface RouteData {
  previousId: RouteId,
  heading: number,
  distance: number,
  endLabel?: string,
  opts: LineOpts,
  id: RouteId
}

export function isSamePoint(p1: Point, p2: Point): boolean {
  return isSamePointLocation(p1, p2) && p1.label === p2.label;
}

export function isSamePointLocation(p1: Point, p2: Point): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}

export interface MapData {
  startLabel: string;
  routes: RouteData[];
  style: StyleOptions;
}

export const EMPTY_PLOT: MapData = {
  startLabel: 'Origin',
  routes: [],
  style: DFLT_STYLE
};
