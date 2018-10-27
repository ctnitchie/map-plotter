import { createStore } from 'redux';
import reducer from './reducers';
import plotFn from './routes/adjusted2';

export const initialMap = plotFn();

export const store = createStore(reducer, {data: initialMap});
