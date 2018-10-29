import { State } from './reducers';
import { ThunkAction } from 'redux-thunk';

export interface Action<T extends string = string> {
  readonly type: T;
}

export interface PayloadAction<T extends string = string, P = undefined> extends Action<T> {
  readonly payload: P
}

export type AsyncActionHandler = ThunkAction<any, State, any, Action>;

interface TypeMeta<T extends string> {
  getType: () => T;
}
type ActionFactory<T extends string> = (() => Action<T>) & TypeMeta<T>;
type ActionFactory2<T extends string> = () => ActionFactory<T>;
type PayloadActionFactory<T extends string, P> = ((payload: P) => PayloadAction<T, P>) & TypeMeta<T>;
type PayloadActionFactory2<T extends string> = <P>() => PayloadActionFactory<T, P>;
type AsyncActionFactory<T extends string> = (() => AsyncActionHandler) & TypeMeta<T>;
type AsyncActionFactory2<T extends string> = (handler: AsyncActionHandler) => AsyncActionFactory<T>;

export function makeActionFactory<T extends string>(type: T): ActionFactory2<T> {
  const fn2: ActionFactory2<T> = (): ActionFactory<T> => {
    return Object.assign(() => {return {type};}, {getType: () => type});
  };
  return fn2;
}

export function makePActionFactory<T extends string>(type: T): PayloadActionFactory2<T> {
  const fn2 = <P>() => {
    const fn = (payload: P) => {
      return {type, payload};
    }
    fn.getType = () => type;
    return fn;
  }
  return fn2;
}

export function makeAsyncActionFactory<T extends string>(type: T): AsyncActionFactory2<T> {
  const fn2 = (handler: AsyncActionHandler): any => {
    const fn = () => {
      return handler;
    };
    fn.getType = () => type;
    return fn;
  }
  return fn2;
}
