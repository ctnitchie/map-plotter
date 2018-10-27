import { RouteData, StyleOptions } from './Types';
import { makePActionFactory, makeActionFactory } from './actionlib';

export interface IndexedRoutePayload {
  route: RouteData,
  index: number
}

export const addRoute = makePActionFactory('ADD_ROUTE')<IndexedRoutePayload>();
export const removeRoute = makePActionFactory('REMOVE_ROUTE')<IndexedRoutePayload>();
export const updateRoute = makePActionFactory('UPDATE_ROUTE')<IndexedRoutePayload>();
export const setStartLabel = makePActionFactory('SET_START_LABEL')<string>();
export const updateStyle = makePActionFactory('UPDATE_STYLE')<StyleOptions>();
export const clear = makeActionFactory('CLEAR')();
export const reset = makeActionFactory('RESET')();
