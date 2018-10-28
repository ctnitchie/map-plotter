import { put, takeEvery, all } from 'redux-saga/effects';
import * as a from './actions';

function* tryReset(): any {
  yield takeEvery(a.tryReset.getType(), function*() {
    if (confirm('Are you sure you want to reset the map to its original state? Any changes will be lost.')) {
      yield put(a.reset());
    }
  });
}

function* tryClear(): any {
  yield takeEvery(a.tryClear.getType(), function*() {
    if (confirm('This will discard the current map. Are you sure?')) {
      yield put(a.clear());
    }
  });
}

export default function* rootSaga() {
  yield all([
    tryClear(),
    tryReset()
  ]);
}
