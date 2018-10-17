import { MapPlot, LineType } from "../MapPlot";

const plot = new MapPlot();
const baseLine = 250;
const eastLine = 115;
const westLine = 30;

const platform = plot.startPoint;
const mid = plot.addRoute(null, baseLine, 134, 'Base Midpoint', {makeDot: false});
const dino = plot.addRoute(mid, 355, 85, 'Scubasaurus');
const buddha = plot.addRoute(dino, 330, 51, 'SinkaBuddha');
const david = plot.addRoute(buddha, eastLine, 70, 'David Point', {labelDot: false, makeDot: false});
const soldier = plot.addRoute(david, eastLine, 58, 'Soldier Point', {labelDot: false, makeDot: false});
const platformReturn = plot.addRoute(soldier, eastLine, 46, 'Platform NW', {labelDot: false});
const lady = plot.addRoute(platformReturn, 325, 19, 'Lady', {showLabel: false});
const dome = plot.addRoute(lady, 0, 63, 'Dome');
plot.addRoute(dome, 145, 30, 'Mirror', {type: LineType.DASHED});


plot.addRoute(lady, 24, 45, 'Mirror from Lady', {makeDot: false, type: LineType.DASHED});
plot.addRoute(david, 45, 5, 'El Dudarino', {type: LineType.NONE});
plot.addRoute(soldier, 45, 5, 'Soldier', {type: LineType.NONE});
plot.addRoute(mid, 25, 10, 'HMCS Brynne', {type: LineType.NONE});

const pvcPipe = plot.addRoute(mid, baseLine, 75, 'PVC Pipe');
const westPlatform = plot.addRoute(pvcPipe, baseLine, 67, 'West Platform');
const westPlatformWest = plot.addRoute(westPlatform, 270, 10, 'West Platform Far Corner', {showLabel: false, labelDot: false});
const hoop = plot.addRoute(westPlatformWest, 315, 64, 'Hoop 2');
const trash = plot.addRoute(hoop, 315, 50, 'Trash');
const hoop2 = plot.addRoute(westPlatformWest, 335, 21, 'Hoop 1');
const end = plot.addRoute(hoop2, 335, 113, 'End of the Line');
const hoop3 = plot.addRoute(westPlatform, westLine, 75, 'Hoop 5');
const buddah2 = plot.addRoute(hoop3, westLine, 129, 'Buddah (return)', {makeDot: false});

// Draw the East platform
plot.addConnector(null, platformReturn);

export default plot;