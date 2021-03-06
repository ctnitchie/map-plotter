import { RouteData, Point, Bounds, LineOpts, DFLT_ROUTE_OPTS, nextId } from './types';

/**
 * We'll put a table on the array for speedier lookups.
 */
interface Lookup {
  table: {[key: string]: RouteData}
}

/**
 * Gets the route ID when you don't know whether you have a route or a route ID.
 * @param r The route or the ID.
 */
export function getId(r: RouteData | string): string {
  if ((r as RouteData).id) {
    return (r as RouteData).id;
  }
  return r as string;
}

export function find(arr: RouteData[], id: RouteData | string): RouteData {
  if (!id) return null;
  if ((id as RouteData).heading !== undefined) {
    return id as RouteData;
  }

  let lookup = arr as unknown as Lookup;
  if (!lookup.table) {
    lookup.table = {};
    arr.forEach(r => lookup.table[r.id] = r);
  }
  return lookup.table[id as string];
}

export function isDescendant(arr: RouteData[], child: RouteData, parent: RouteData | string): boolean {
  if (!child.previousId) {
    return false;
  }
  const parentRoute = find(arr, parent);
  if (!parentRoute) {
    return false;
  }
  if (child.previousId === parentRoute.id) {
    return true;
  }
  return isDescendant(arr, previous(arr, child), parentRoute);
}

export function isDescendantOrSelf(arr: RouteData[], child: RouteData, parent: RouteData | string): boolean {
  const parentRoute = find(arr, parent);
  if (!parentRoute) {
    return false;
  }
  return child.id === parentRoute.id || isDescendant(arr, child, parentRoute);
}

export function previous(arr: RouteData[], r: RouteData): RouteData {
  return find(arr, r.previousId);
}

export function startPoint(arr: RouteData[], r: RouteData): Point {
  const prev = previous(arr, r);
  return prev ? endPoint(arr, prev) : {x: 0, y: 0};
}

export function normalizeHeading(heading: number): number {
  if (heading === undefined) return 0;
  let h = heading;
  while (h < 0) h += 360;
  while (h >= 360) h -= 360;
  return h;
}

export function endPoint(arr: RouteData[], r: RouteData): Point {
  const heading = r.heading === null ? 0 : r.heading;
  const distance = r.distance === null ? 0 : r.distance;
  let orientedHeading = 90 - heading;
  while (orientedHeading < 0) {
    orientedHeading += 360;
  }
  const rads = orientedHeading * Math.PI / 180;
  const start = startPoint(arr, r);
  return {
    x: start.x + (Math.cos(rads) * distance),
    y: start.y + (Math.sin(rads) * distance),
    label: r.endLabel
  };
}

export function getStartLabel(arr: RouteData[], r: RouteData): string {
  const prev = previous(arr, r);
  return prev ? getEndLabel(arr, prev) : null;
}

export function getLineLabel(r: RouteData): string {
  if (r.opts.label) {
    return r.opts.customLabel || `${r.heading}° ${r.distance}'`;
  }
  return null;
}

export function getEndLabel(arr: RouteData[], r: RouteData): string {
  return r.endLabel || toString(endPoint(arr, r));
}

export function toString(p: Point): string {
  return p.label || `(${p.x}, ${p.y})`;
}

export function removeWithDescendants(arr: RouteData[], r: RouteData): RouteData[] {
  let narr = [...arr];
  const toRemove = [r.id];
  while (toRemove.length > 0) {
    const curId = toRemove.pop();
    narr = narr.filter(re => {
      if (re.previousId === curId) {
        toRemove.push(re.id);
        return false;
      }
      return re.id !== curId;
    });
  }
  return narr;
}

export function getBounds(routes: RouteData[]): Bounds {
  let minX = 0;
  let maxX = 10;
  let minY = 0;
  let maxY = 10;
  routes.forEach(r => {
    const p = endPoint(routes, r);
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

export function addRoute(arr: RouteData[], previous: RouteData, heading: number, distance: number,
    endLabel: string = undefined, opts: LineOpts = {}): RouteData {
  const route: RouteData = {
    id: nextId(),
    previousId: previous ? previous.id : null,
    heading,
    distance,
    endLabel,
    opts: {...DFLT_ROUTE_OPTS, ...opts}
  };
  arr.push(route);
  return route;
}
