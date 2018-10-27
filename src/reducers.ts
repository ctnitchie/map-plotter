import * as a from './actions';
import { EMPTY_PLOT, MapData, RouteData, StyleOptions, nextId, DFLT_ROUTE_OPTS, DFLT_STYLE } from './types';
import { Action, PayloadAction } from './actionlib';
import {combineReducers, Reducer} from 'redux';
import { removeWithDescendants } from './routeUtils';
import { initialMap } from './store';

export interface UIState {}

export interface State {
  readonly data: MapData,
  readonly uistate: UIState
}

function arrmod<T>(arr: T[], index: number, count: number, add?: T): T[] {
  const narr = [...arr];
  narr.splice(index, count, add);
  return narr;
}

export function combineReducersWithRoot(rootReducer: Reducer, reducers: {[key: string]: Reducer}): Reducer {
  return (state, action) => {
    // Ensure the root state object is a new object; otherwise
    // React may not re-render.
    const newState = {...rootReducer(state, action)};
    Object.keys(reducers).forEach(domain => {
      const obj = state ? state[domain] : undefined;
      newState[domain] = reducers[domain](obj, action);
    });
    return newState;
  };
}

export default combineReducers({
  data: combineReducers({
    startLabel: (state: string = EMPTY_PLOT.startLabel, action: PayloadAction<string, string>): string => {
      switch(action.type) {
        case a.setStartLabel.getType():
          return action.payload;
        case a.clear.getType():
          return 'Origin';
        case a.reset.getType():
          return initialMap.startLabel;
      }
      return state;
    },
    routes: (state: RouteData[] = EMPTY_PLOT.routes, action: PayloadAction<string, a.IndexedRoutePayload>): RouteData[] => {
      switch (action.type) {
        case a.addRoute.getType():
          return arrmod(state, action.payload.index, 0, action.payload.route);
        case a.removeRoute.getType():
          return removeWithDescendants(state, action.payload.route);
        case a.updateRoute.getType():
          return arrmod(state, action.payload.index, 1, action.payload.route);
        case a.clear.getType():
          return [{
            id: nextId(),
            previousId: null,
            distance: 10,
            heading: 0,
            endLabel: 'First Point',
            opts: DFLT_ROUTE_OPTS
          }];
        case a.reset.getType():
          return initialMap.routes;
      }
      return state;
    },
    style: (state: StyleOptions = EMPTY_PLOT.style, action: PayloadAction<string, StyleOptions>): StyleOptions => {
      switch (action.type) {
        case a.updateStyle.getType():
          return action.payload;
        case a.reset.getType():
          return initialMap.style;
        case a.clear.getType():
          return DFLT_STYLE;
      }
      return state;
    }
  }),
  uistate: (state: UIState = {}, action: Action) => {
    return {state};
  }
});
