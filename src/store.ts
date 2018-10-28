import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers';
import createSagaMiddleware from 'redux-saga';
import plotFn from './routes/adjusted2';
import rootSaga from './sagas';

export const initialMap = plotFn();

const saga = createSagaMiddleware();

export const store = createStore(
  reducer,
  {data: initialMap},
  applyMiddleware(saga)
);

saga.run(rootSaga);
