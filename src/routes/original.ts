import { RouteData } from '../Types';
import { addRoute } from '../mapEditor/routeUtils';

const routes: RouteData[] = [];
const baseLine = 250;
const eastLine = 110;
const westLine = 35;

const brynne = addRoute(routes, null, baseLine, 134, 'HMCS Brynne');
const dino = addRoute(routes, brynne, 0, 85, 'Scubasaurus');
const buddha = addRoute(routes, dino, 330, 51, 'Buddha');
const david = addRoute(routes, buddha, eastLine, 70, 'David');
const soldier = addRoute(routes, david, eastLine, 58, 'Soldier');
const platformReturn = addRoute(routes, soldier, eastLine, 46, 'Platform (from Buddah)');
const lady = addRoute(routes, platformReturn, 325, 19, 'Lady');
const tub = addRoute(routes, lady, 0, 63, 'Tub');

const pvcPipe = addRoute(routes, brynne, baseLine, 75, 'PVC Pipe');
const westPlatform = addRoute(routes, pvcPipe, baseLine, 67, 'West Platform');
const westPlatformWest = addRoute(routes, westPlatform, 270, 10);
const hoop = addRoute(routes, westPlatformWest, 315, 64, 'Hoop');
const trash = addRoute(routes, hoop, 315, 50, 'Trash');
const hoop2 = addRoute(routes, westPlatformWest, 335, 21, 'Hoop');
const end = addRoute(routes, hoop2, 335, 113, 'End of the Line');
const gocart = addRoute(routes, westPlatform, westLine, 56, 'Cart');
const hoop3 = addRoute(routes, gocart, westLine, 19, 'Hoop');
const buddah2 = addRoute(routes, hoop3, westLine, 150, 'Buddah (from West Platform)');

export default routes;
