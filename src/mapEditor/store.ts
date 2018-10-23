import { createStore } from 'redux';
import reducer, { State } from './reducers';
import plotFn from '../routes/adjusted2';

export const initialMap = plotFn().getData();

export const store = createStore(reducer, {data: initialMap});
