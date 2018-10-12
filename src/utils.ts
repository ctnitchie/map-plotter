import { Point } from "./Plot";

// Convert compass heading to rads, 0=3 o'clock, counter-clockwise
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
