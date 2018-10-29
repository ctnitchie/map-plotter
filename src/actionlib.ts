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
type ActionFactoryBuilder<T extends string> = () => ActionFactory<T>;
type PayloadActionFactory<T extends string, P> = ((payload: P) => PayloadAction<T, P>) & TypeMeta<T>;
type PayloadActionFactoryBuilder<T extends string> = <P>() => PayloadActionFactory<T, P>;
type AsyncActionFactory<T extends string> = (() => AsyncActionHandler) & TypeMeta<T>;
type AsyncActionFactoryBuilder<T extends string> = (handler: AsyncActionHandler) => AsyncActionFactory<T>;

export function makeActionFactory<T extends string>(type: T): ActionFactoryBuilder<T> {
  const builder: ActionFactoryBuilder<T> = (): ActionFactory<T> => {
    return Object.assign(() => {return {type};}, {getType: () => type});
  };
  return builder;
}

export function makePActionFactory<T extends string>(type: T): PayloadActionFactoryBuilder<T> {
  const builder = <P>() => {
    const actionFactory = (payload: P) => {
      return {type, payload};
    }
    actionFactory.getType = () => type;
    return actionFactory;
  }
  return builder;
}

export function makeAsyncActionFactory<T extends string>(type: T): AsyncActionFactoryBuilder<T> {
  const builder = (handler: AsyncActionHandler): any => {
    const actionFactory = () => {
      return handler;
    };
    actionFactory.getType = () => type;
    return actionFactory;
  }
  return builder;
}
