export interface Action<T extends string = string> {
  readonly type: T;
}

export interface PayloadAction<T extends string = string, P = undefined> extends Action<T> {
  readonly payload: P
}

interface TypeMeta<T extends string> {
  getType: () => T;
}
type ActionFactory<T extends string> = (() => Action<T>) & TypeMeta<T>;
type ActionFactory2<T extends string> = () => ActionFactory<T>;
type PayloadActionFactory<T extends string, P> = ((payload: P) => PayloadAction<T, P>) & TypeMeta<T>;
type PayloadActionFactory2<T extends string> = <P>() => PayloadActionFactory<T, P>;

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


