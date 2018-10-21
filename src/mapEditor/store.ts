import { createStore } from 'redux';
import reducer from './reducers';
import plotFn from '../routes/adjusted2';

export const store = createStore(reducer, {data: plotFn().getData()});
