import subscriptions from './subscriptions';
import stringify from './lib/stringify';

const isBasic = (value: unknown): boolean =>
  !value || ['boolean', 'number', 'string'].includes(typeof value);

const clone = (value: unknown): unknown => {
  if (isBasic(value)) return value;
  return JSON.parse(stringify(value));
};

type MaybePromise = { then?: unknown };

export default (obj: object, key: PropertyKey, cb: (...args: unknown[]) => unknown): ReturnType<typeof setInterval> => {
  const get = () => (obj as Record<PropertyKey, unknown>)[key];
  const val = get();
  let prev: unknown = (val as MaybePromise)?.then
    ? (val as Promise<unknown>).then(clone)
    : clone(val);

  const check = () => {
    const value = get();
    if ((prev as MaybePromise)?.then || (value as MaybePromise)?.then) {
      void Promise.all([prev, value]).then(([previous, current]) => {
        if (stringify(previous) === stringify(current)) return;
        cb(current, previous);
        prev = clone(current);
      });
      return;
    }
    if (stringify(prev) === stringify(value)) return;
    cb(value, prev);
    prev = clone(value);
  };

  const id = setInterval(check, 100);
  subscriptions.push({ id, key, check, cb });
  return id;
};
