import { RouteData, StyleOptions } from './types';
import { makePActionFactory, makeActionFactory } from './actionlib';

export interface IndexedRoutePayload {
  route: RouteData,
  index: number
}

export const addRoute = makePActionFactory('ADD_ROUTE')<IndexedRoutePayload>();
export const tryRemoveRoute = makePActionFactory('TRY_REMOVE_ROUTE')<IndexedRoutePayload>();
export const removeRoute = makePActionFactory('REMOVE_ROUTE')<IndexedRoutePayload>();
export const updateRoute = makePActionFactory('UPDATE_ROUTE')<IndexedRoutePayload>();
export const setStartLabel = makePActionFactory('SET_START_LABEL')<string>();
export const updateStyle = makePActionFactory('UPDATE_STYLE')<StyleOptions>();
export const tryClear = makeActionFactory('TRY_CLEAR')();
export const clear = makeActionFactory('CLEAR')();
export const tryReset = makeActionFactory('TRY_RESET')();
export const reset = makeActionFactory('RESET')();
