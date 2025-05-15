import { Rxtor } from '../src';

describe('RxtorStore', () => {
  type TestState = { count: number; user: { name: string } };
  let store: Rxtor<TestState>;

  beforeEach(() => {
    store = new Rxtor({ count: 0, user: { name: 'Alice' } });
  });

  test('initial state is correct', () => {
    expect(store.getSnapshot()).toEqual({ count: 0, user: { name: 'Alice' } });
  });

  test('setState updates state', () => {
    store.setState({ count: 5 });
    expect(store.getSnapshot().count).toBe(5);
  });

  test('select returns correct value', (done) => {
    const sub = store.select(s => s.count, false).subscribe(value => {
      expect(value).toBe(10);
      sub.unsubscribe();
      done();
    });

    store.setState({ count: 10 });
  });

  test('selectMany returns selected values', (done) => {
    const sub = store.selectMany(['count'], false).subscribe(val => {
      expect(val).toEqual({ count: 3 });
      sub.unsubscribe();
      done();
    });

    store.setState({ count: 3 });
  });

  test('set using selector updates correct value', () => {
    store.set(s => s.count, 42);
    expect(store.getSnapshot().count).toBe(42);
  });

  test('middleware can log and allow state', () => {
    const logger = jest.fn((prev, next) => next);
    store.use(logger);
    store.setState({ count: 100 });
    expect(logger).toHaveBeenCalledWith({ count: 0, user: { name: 'Alice' } }, expect.any(Object));
  });

  test('middleware can block state change', () => {
    store.use(() => false);
    store.setState({ count: 100 });
    expect(store.getSnapshot().count).toBe(0);
  });

  test('onStateChange triggers listener', () => {
    const listener = jest.fn();
    const unsubscribe = store.onStateChange(listener);
    store.setState({ count: 7 });
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ count: 7 }));
    unsubscribe();
  });
});
