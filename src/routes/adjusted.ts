import { MapPlot } from "../MapPlot";

const plot = new MapPlot();
const baseLine = 250;
const eastLine = 117;
const westLine = 31;

const brynne = plot.addRoute(null, baseLine, 134, 'HMCS Brynne');
const dino = plot.addRoute(brynne, 0, 85, 'Scubasaurus');
const buddha = plot.addRoute(dino, 330, 51, 'Buddha');
const david = plot.addRoute(buddha, eastLine, 71, 'David');
const soldier = plot.addRoute(david, eastLine, 58, 'Soldier');
const platformReturn = plot.addRoute(soldier, eastLine, 41);
const lady = plot.addRoute(platformReturn, 325, 19, 'Lady');
const tub = plot.addRoute(lady, 0, 63, 'Tub');

const pvcPipe = plot.addRoute(brynne, baseLine, 75, 'PVC Pipe');
const westPlatform = plot.addRoute(pvcPipe, baseLine, 67, 'West Platform');
const westPlatformWest = plot.addRoute(westPlatform, 270, 10);
const hoop = plot.addRoute(westPlatformWest, 315, 64, 'Hoop');
const trash = plot.addRoute(hoop, 315, 50, 'Trash');
const hoop2 = plot.addRoute(westPlatformWest, 335, 21, 'Hoop');
const end = plot.addRoute(hoop2, 335, 113, 'End of the Line');
const gocart = plot.addRoute(westPlatform, westLine, 56, 'Cart');
const hoop3 = plot.addRoute(gocart, westLine, 19, 'Hoop');
const buddah2 = plot.addRoute(hoop3, westLine, 132);

export default plot;