import { MapPlot, LineType, Route } from "../MapPlot";

export default function(p: MapPlot = new MapPlot()): MapPlot {
  const plot = new MapPlot();
  plot.startLabel = 'East Platform';
  plot.style.padding.right = 40;
  const baseLine = 250;
  const eastLine = 115;
  const westLine = 30;
  
  const mid = plot.addRoute(null, baseLine, 134, 'Base Midpoint', {makeDot: false, label: true});
  const dino = plot.addRoute(mid, 355, 85, 'Scubasaurus', {label: true});
  const buddha = plot.addRoute(dino, 330, 51, 'SinkaBuddha', {label: true});
  const david = plot.addRoute(buddha, eastLine, 70, 'El Dudarino', {labelDot: false, makeDot: false, label: true});
  const soldier = plot.addRoute(david, eastLine, 58, 'Brazierian Soldier', {labelDot: false, makeDot: false, label: true});
  const platformReturn = plot.addRoute(soldier, eastLine, 46, 'Platform NW', {labelDot: false, label: true});
  const lady = plot.addRoute(platformReturn, 325, 19, 'Lady of the Lake', {showLabel: false});
  const dome = plot.addRoute(lady, 0, 63, 'Dome', {label: true});
  plot.addRoute(dome, 145, 30, 'Mirror', {type: LineType.DASHED, label: true});
  plot.addRoute(lady, 24, 45, 'Mirror', {makeDot: false, type: LineType.DASHED, label: true});
  
  // West platform square
  const platNE = plot.addRoute(platformReturn, 82, 16, '', {label: false, makeDot: false});
  const platSE = plot.addRoute(platNE, 172, 10, '', {label: false, makeDot: false});
  plot.addRoute(platformReturn, 172, 10, '', {label: false, makeDot: false});
  plot.addRoute(platSE, 262, 16, '', {label: false, makeDot: false});
  
  // Misc. lines
  plot.addRoute(david, 45, 5, 'El Dudarino', {type: LineType.NONE});
  plot.addRoute(soldier, 45, 5, 'Brazierian Soldier', {type: LineType.NONE});
  plot.addRoute(mid, 25, 10, 'HMCS Brynne Wreck', {type: LineType.NONE});
  plot.addRoute(mid, 175, 6, 'Mid-line anchor', {makeDot: false, label: false});
  
  const pvcPipe = plot.addRoute(mid, baseLine, 75, 'PVC Pipe', {label: true});
  const westPlatform = plot.addRoute(pvcPipe, baseLine, 67, 'West Platform', {label: true});
  const westPlatformWest = plot.addRoute(westPlatform, 270, 9, 'West Platform West Corner', {showLabel: false, labelDot: false});
  const hoop2 = plot.addRoute(westPlatformWest, 335, 21, 'Hoop A');
  plot.addRoute(hoop2, 335, 113, 'End of the Line');
  const hoop1 = plot.addRoute(westPlatformWest, 315, 64, 'Hoop B');
  plot.addRoute(hoop1, 315, 50, 'Trash');
  const hoop3 = plot.addRoute(westPlatform, westLine, 67, 'Hoop D', {makeDot: false, label: true});
  plot.addRoute(hoop3, westLine, 139, 'Buddah', {makeDot: false, label: true});
  
  hoopRoute(plot, hoop2, false);
  
  // West platform square
  const wpSW = plot.addRoute(westPlatformWest, 180, 9, '', {makeDot: false, label: false});
  const wpSE = plot.addRoute(wpSW, 90, 9, '', {makeDot: false, label: false});
  plot.addRoute(wpSE, 0, 9, '', {makeDot: false, label: false});
  
  // Shelter routes
  const shelter = plot.addRoute(null, 160, 265, 'Shelter', {type: LineType.DASHED, labelDot: false, label: true});
  const boat = plot.addRoute(shelter, 270, 122, 'Boat', {type: LineType.DASHED, labelDot: false, label: true});
  plot.addRoute(boat, 265, 297, 'Beach Corner', {type: LineType.DASHED, label: true});
  
  function hoopRoute(plot: MapPlot, from: Route, label: boolean): void {
    const lblFn = label ?true : false;
    plot.addRoute(from, 305, 40, 'Hoop B', {makeDot: false, type: LineType.DASHED, label: lblFn});
    const hoopC = plot.addRoute(hoop1, 35, 44, 'Hoop C', {type: LineType.DASHED, label: lblFn});
    const hoopD = plot.addRoute(hoop3, 290, 5, 'Hoop D', {type: LineType.NONE, label: lblFn});
    plot.addRoute(hoopC, 110, 57, 'Hoop D', {makeDot: false, type: LineType.DASHED, label: lblFn});
    const hoopE = plot.addRoute(hoopD, 180, 39, 'Hoop E', {type: LineType.DASHED, label: lblFn});
    plot.addRoute(hoopE, 270, 45, 'Hoop A', {type: LineType.DASHED, makeDot: false, label: lblFn});
  }

  return plot;
}
