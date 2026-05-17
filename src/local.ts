import subscriptions from './subscriptions';
import { pack, unpack } from './packer';

const getAll = (): Record<string, unknown> => {
  const all: Record<string, unknown> = {};
  for (const key in localStorage) {
    const val = local[key];
    if (val !== null) all[key] = val;
  }
  return all;
};

const local = new Proxy({} as Record<string, unknown>, {
  get(_target, key): unknown {
    if (key === Symbol.iterator) {
      const all = Object.values(getAll());
      return function* () {
        while (all.length) yield all.shift()!;
      };
    }
    if (typeof key !== 'string') return undefined;
    return unpack(localStorage.getItem(key));
  },

  set(_target, key, value: unknown): boolean {
    if (typeof key !== 'string') return false;
    localStorage.setItem(key, pack(value));
    subscriptions.filter(sub => sub.key === key).forEach(({ check }) => check());
    return true;
  },

  deleteProperty(_target, key): boolean {
    if (typeof key !== 'string') return false;
    localStorage.removeItem(key);
    subscriptions.filter(sub => sub.key === key).forEach(({ check }) => check());
    return true;
  },

  getOwnPropertyDescriptor(): PropertyDescriptor {
    return { enumerable: true, configurable: true };
  },

  ownKeys(): string[] {
    return Object.keys(getAll());
  },
});

export default local;
