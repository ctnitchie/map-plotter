export type Predicate<T> = (o: T) => boolean;
export type Comparator<T> = (a: T, b: T) => number;
export type Test<T> = (a: T, b: T) => boolean;
export type Transformer<T, R> = (a: T) => R;

export function simpleCompare<T>(a: T, b: T): number {
  if (a === b) {
    return 0;
  } else if (a < b) {
    return -1;
  }
  return 1;
}

export function simpleTest<T>(a: T, b: T): boolean {
  return simpleCompare(a, b) === 0;
}

export function replace<T>(arr: T[], old: T, rep: T, testFn: Test<T> = simpleTest): T[] {
  return testFn(old, rep) ? arr : arr.map(o => testFn(o, old) ? rep : o);
}

export function replaceAt<T>(arr: T[], at: number, rep: T): T[] {
  return [...arr.slice(0, at), rep, ...arr.slice(at + 1)];
}

export function updateMany<T>(arr: T[], testFn: Predicate<T>, transformer: Transformer<T, T>) {
  let mods = false;
  const newArr = arr.map(o => {
    if (testFn(o)) {
      mods = true;
      return transformer(o);
    }
    return o;
  });
  return mods ? newArr : arr;
}
