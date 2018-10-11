// Convert compass heading to rads, 0=3 o'clock, counter-clockwise
export function toRads(deg) {
  let r = 90 - deg;
  while (r < 0) {
    r += 360;
  }
  return r * Math.PI / 180;
}

export function getDistance(p1, p2) {
  const b = p2.x - p1.x;
  const h = p2.y - p1.y;
  return Math.sqrt(Math.pow(b, 2) + Math.pow(h, 2));
}

export function getMidpoint(p1, p2) {
  return {
    x: ((p2.x - p1.x) / 2) + p1.x,
    y: ((p2.y - p1.y) / 2) + p1.y
  };
}

export function relativeCoordinates(deg, distance) {
  const rads = toRads(deg);
  return {
    x: Math.cos(rads) * distance,
    y: Math.sin(rads) * distance
  };
}
