import { LineType, RouteData, MapData, DFLT_STYLE } from "../Types";
import { addRoute } from '../mapEditor/routeUtils';

export default function(): MapData {
  const map: MapData = {
    startLabel: 'East Platform',
    style: { ...DFLT_STYLE, padding: {...DFLT_STYLE.padding, right: 40}},
    routes: []
  };
  const baseLine = 250;
  const eastLine = 115;
  const westLine = 30;
  
  const mid = addRoute(map.routes, null, baseLine, 134, 'Base Midpoint', {makeDot: false, label: true});
  const dino = addRoute(map.routes, mid, 355, 85, 'Scubasaurus', {label: true});
  const buddha = addRoute(map.routes, dino, 330, 51, 'SinkaBuddha', {label: true});
  const david = addRoute(map.routes, buddha, eastLine, 70, 'El Dudarino', {labelDot: false, makeDot: false, label: true});
  const soldier = addRoute(map.routes, david, eastLine, 58, 'Brazierian Soldier', {labelDot: false, makeDot: false, label: true});
  const platformReturn = addRoute(map.routes, soldier, eastLine, 46, 'Platform NW', {labelDot: false, label: true});
  const lady = addRoute(map.routes, platformReturn, 325, 19, 'Lady of the Lake', {label: false});
  const dome = addRoute(map.routes, lady, 0, 63, 'Dome', {label: true});
  addRoute(map.routes, dome, 145, 30, 'Mirror', {type: LineType.DASHED, label: true});
  addRoute(map.routes, lady, 24, 45, 'Mirror', {makeDot: false, type: LineType.DASHED, label: true});
  
  // West platform square
  const platNE = addRoute(map.routes, platformReturn, 82, 16, '', {label: false, makeDot: false});
  const platSE = addRoute(map.routes, platNE, 172, 10, '', {label: false, makeDot: false});
  addRoute(map.routes, platformReturn, 172, 10, '', {label: false, makeDot: false});
  addRoute(map.routes, platSE, 262, 16, '', {label: false, makeDot: false});
  
  // Misc. lines
  addRoute(map.routes, david, 45, 5, 'El Dudarino', {type: LineType.NONE});
  addRoute(map.routes, soldier, 45, 5, 'Brazierian Soldier', {type: LineType.NONE});
  addRoute(map.routes, mid, 25, 10, 'HMCS Brynne Wreck', {type: LineType.NONE});
  addRoute(map.routes, mid, 175, 6, 'Mid-line anchor', {makeDot: false, label: false});
  
  const pvcPipe = addRoute(map.routes, mid, baseLine, 75, 'PVC Pipe', {label: true});
  const westPlatform = addRoute(map.routes, pvcPipe, baseLine, 67, 'West Platform', {label: true});
  const westPlatformWest = addRoute(map.routes, westPlatform, 270, 9, 'West Platform West Corner', {label: false, labelDot: false});
  const hoop2 = addRoute(map.routes, westPlatformWest, 335, 21, 'Hoop A');
  addRoute(map.routes, hoop2, 335, 113, 'End of the Line');
  const hoop1 = addRoute(map.routes, westPlatformWest, 315, 64, 'Hoop B');
  addRoute(map.routes, hoop1, 315, 50, 'Trash');
  const hoop3 = addRoute(map.routes, westPlatform, westLine, 67, 'Hoop D', {makeDot: false, label: true});
  addRoute(map.routes, hoop3, westLine, 139, 'Buddah', {makeDot: false, label: true});
  
  hoopRoute(map, hoop2, false);
  
  // West platform square
  const wpSW = addRoute(map.routes, westPlatformWest, 180, 9, '', {makeDot: false, label: false});
  const wpSE = addRoute(map.routes, wpSW, 90, 9, '', {makeDot: false, label: false});
  addRoute(map.routes, wpSE, 0, 9, '', {makeDot: false, label: false});
  
  // Shelter routes
  const shelter = addRoute(map.routes, null, 160, 265, 'Shelter', {type: LineType.DASHED, labelDot: false, label: true});
  const boat = addRoute(map.routes, shelter, 270, 122, 'Boat', {type: LineType.DASHED, labelDot: false, label: true});
  addRoute(map.routes, boat, 265, 297, 'Beach Corner', {type: LineType.DASHED, label: true});
  
  function hoopRoute(map: MapData, from: RouteData, label: boolean): void {
    addRoute(map.routes, from, 305, 40, 'Hoop B', {makeDot: false, type: LineType.DASHED, label: label});
    const hoopC = addRoute(map.routes, hoop1, 35, 44, 'Hoop C', {type: LineType.DASHED, label: label});
    const hoopD = addRoute(map.routes, hoop3, 290, 5, 'Hoop D', {type: LineType.NONE, label: label});
    addRoute(map.routes, hoopC, 110, 57, 'Hoop D', {makeDot: false, type: LineType.DASHED, label: label});
    const hoopE = addRoute(map.routes, hoopD, 180, 39, 'Hoop E', {type: LineType.DASHED, label: label});
    addRoute(map.routes, hoopE, 270, 45, 'Hoop A', {type: LineType.DASHED, makeDot: false, label: label});
  }

  return map;
}
