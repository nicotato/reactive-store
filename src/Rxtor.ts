import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, skip } from 'rxjs/operators';
import deepEqual from 'fast-deep-equal';

type Middleware<T> = (prevState: T, nextState: T) => T | false;

export class Rxtor<T extends object> {
  private subject: BehaviorSubject<T>;
  private middleware: Middleware<T>[] = [];
  private listeners: ((state: T) => void)[] = [];

  constructor(initialState: T) {
    this.subject = new BehaviorSubject<T>(initialState);
  }

  getSnapshot(): T {
    return this.subject.getValue();
  }

  setState(partial: Partial<T>) {
    const prev = this.getSnapshot();
    const next = { ...prev, ...partial } as T;
    this.apply(next, prev);
  }

  set<K extends keyof T>(selector: (state: T) => T[K], value: T[K]) {
    const current = this.getSnapshot();
    const key = this.findKeyBySelector(selector);
    if (!key) return;
    const updated = { ...current, [key]: value } as T;
    this.apply(updated, current);
  }

  private apply(next: T, prev: T) {
    for (const mw of this.middleware) {
      const result = mw(prev, next);
      if (result === false) return;
      next = result;
    }

    if (!deepEqual(prev, next)) {
      this.subject.next(next);
      this.listeners.forEach(fn => fn(next));
    }
  }

  select<R>(selector: (state: T) => R, emitInitial = true): Observable<R> {
    const stream = this.subject.asObservable().pipe(
      map(selector),
      distinctUntilChanged()
    );
    return emitInitial ? stream : stream.pipe(skip(1));
  }

  selectMany<K extends keyof T>(keys: K[], emitInitial = true): Observable<Pick<T, K>> {
    const stream = this.subject.asObservable().pipe(
      map(state => {
        const result: Partial<T> = {};
        for (const k of keys) result[k] = state[k];
        return result as Pick<T, K>;
      }),
      distinctUntilChanged((a, b) => deepEqual(a, b))
    );
    return emitInitial ? stream : stream.pipe(skip(1));
  }

  use(mw: Middleware<T>) {
    this.middleware.push(mw);
  }

  onStateChange(listener: (state: T) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const idx = this.listeners.indexOf(listener);
      if (idx >= 0) this.listeners.splice(idx, 1);
    };
  }

  private findKeyBySelector<K extends keyof T>(selector: (state: T) => T[K]): K | null {
    const keys = Object.keys(this.getSnapshot()) as K[];
    const testValue = selector(this.getSnapshot());
    for (const key of keys) {
      if (this.getSnapshot()[key] === testValue) {
        return key;
      }
    }
    return null;
  }
}
