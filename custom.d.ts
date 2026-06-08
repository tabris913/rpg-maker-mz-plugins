interface Array<T> {
  clone: () => Array<T>;
  contains: (element: T) => boolean;
  equals: (array: Array<any>) => boolean;
  remove: (element: T) => Array<T>;
}

interface Math {
  randomInt: (max: number) => number;
}

interface Number {
  clamp: (min: number, max: number) => number;
  mod: (n: number) => number;
  padZero: (length: number) => string;
}

interface String {
  contains: (string: string) => boolean;
  format: (...args: Array<any>) => string;
  padZero: (length: number) => string;
}
