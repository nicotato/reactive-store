import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

type Middleware<T> = (prevState: T, nextState: T) => T | false;

export class ReactiveStore<T extends object> {
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

    if (JSON.stringify(prev) !== JSON.stringify(next)) {
      this.subject.next(next);
      this.listeners.forEach(fn => fn(next));
    }
  }

  select<R>(selector: (state: T) => R): Observable<R> {
    return this.subject.asObservable().pipe(
      map(selector),
      distinctUntilChanged()
    );
  }

  selectMany<K extends keyof T>(keys: K[]): Observable<Pick<T, K>> {
    return this.subject.asObservable().pipe(
      map(state => {
        const result: Partial<T> = {};
        for (const k of keys) result[k] = state[k];
        return result as Pick<T, K>;
      }),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    );
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
