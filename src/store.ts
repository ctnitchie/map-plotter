import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers';
import plotFn from './routes/adjusted2';
import ReduxThunk from 'redux-thunk';

export const initialMap = plotFn();

export const store = createStore(reducer, {data: initialMap}, applyMiddleware(ReduxThunk));
