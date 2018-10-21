import * as a from './actions';
import { EMPTY_PLOT, MapData, RouteData, StyleOptions } from '../MapPlot';
import { Action, PayloadAction } from './actionlib';
import {combineReducers} from 'redux';

export interface UIState {}

export interface State {
  readonly data: MapData,
  readonly uistate: UIState
}

function arrmod<T>(arr: T[], index: number, count: number, add?: T) {
  const narr = [...arr];
  narr.splice(index, count, add);
  return narr;
}

export default combineReducers({
  data: combineReducers({
    startLabel: (state: string = EMPTY_PLOT.startLabel, action: PayloadAction<string, string>): string => {
      switch(action.type) {
        case a.setStartLabel.getType():
          return action.payload;
      }
      return state;
    },
    routes: (state: RouteData[] = EMPTY_PLOT.routes, action: PayloadAction<string, a.IndexedRoutePayload>): RouteData[] => {
      switch (action.type) {
        case a.addRoute.getType():
          return arrmod(state, action.payload.index, 0, action.payload.route);
        case a.removeRoute.getType():
          return arrmod(state, action.payload.index, 1);
        case a.updateRoute.getType():
          return arrmod(state, action.payload.index, 1, action.payload.route);
      }
      return state;
    },
    style: (state: StyleOptions = EMPTY_PLOT.style, action: PayloadAction<string, StyleOptions>): StyleOptions => {
      switch (action.type) {
        case a.updateStyle.getType():
          return action.payload;
      }
      return state;
    }
  }),
  uistate: (state: UIState = {}, action: Action) => {
    return state;
  }
});
