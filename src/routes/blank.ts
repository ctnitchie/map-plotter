import { RouteData, LineType, MapData, DFLT_STYLE } from '../types';
import { addRoute } from '../routeUtils';

const routes: RouteData[] = [];

export default function(): MapData {
  const map: MapData = {
    startLabel: 'Origin Point',
    style: { ...DFLT_STYLE, padding: {...DFLT_STYLE.padding, right: 40}},
    routes: []
  };

  const one = addRoute(map.routes, null, 270, 50, 'One');
  const two = addRoute(map.routes, one, 0, 50, 'Two');
  const three = addRoute(map.routes, two, 90, 50, 'Three');
  const ret = addRoute(map.routes, three, 180, 50, 'Return', {labelDot: false});
  const oneToThree = addRoute(map.routes, one, 45, 71, 'One to Three', {type: LineType.DASHED, makeDot: false});
  return map;
}
