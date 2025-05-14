import { useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import { ReactiveStore } from './ReactiveStore';

export function useReactiveSelector<T, R>(
  store: ReactiveStore<T>,
  selector: (state: T) => R
): R {
  const [selected, setSelected] = useState(() => selector(store.getSnapshot()));

  useEffect(() => {
    const sub: Subscription = store.select(selector).subscribe(setSelected);
    return () => sub.unsubscribe();
  }, [store, selector]);

  return selected;
}
