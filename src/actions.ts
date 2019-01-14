import { RouteData, StyleOptions } from './types';
import { makePActionFactory, makeActionFactory, makeAsyncActionFactory } from './actionlib';

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
export const clear = makeActionFactory('CLEAR')();
export const reset = makeActionFactory('RESET')();
export const initDialog = makePActionFactory('INIT_DIALOG')<string>();
export const dismissDialog = makePActionFactory('DISMISS_DIALOG')<string>();

export const tryReset = makeAsyncActionFactory('TRY_RESET')(dispatch => {
  if (confirm('Are you sure you want to reset the map to its original state? Any changes will be lost.')) {
    dispatch(reset());
  }
});

export const tryClear = makeAsyncActionFactory('TRY_CLEAR')(dispatch => {
  if (confirm('This will discard the current map. Are you sure?')) {
    dispatch(clear());
  }
});
