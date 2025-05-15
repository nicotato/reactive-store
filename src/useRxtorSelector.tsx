import { useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import { Rxtor } from './Rxtor';

export function useRxtorSelector<T, R>(
  store: Rxtor<T extends object ? T : never>,
  selector: (state: T) => R,
  emitInitial = true
): R | undefined {
  const [selected, setSelected] = useState<R | undefined>(() => {
    return emitInitial ? selector(store.getSnapshot()) : undefined;
  });

  useEffect(() => {
    const sub: Subscription = store
      .select(selector, emitInitial)
      .subscribe(setSelected);
    return () => sub.unsubscribe();
  }, [store, selector, emitInitial]);

  return selected;
}
