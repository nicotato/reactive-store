export type Middleware<T> = (prev: T, next: T) => T | false;
