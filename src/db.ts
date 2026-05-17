import subscriptions from './subscriptions';
import { get, set, del, keys } from 'idb-keyval';

const getAll = async (): Promise<Record<string, unknown>> => {
  const all: Record<string, unknown> = {};
  const ks = await keys<string>();
  await Promise.all(ks.map(async key => {
    all[key] = await get(key);
  }));
  return all;
};

const db = new Proxy(getAll, {
  get: (_target, key) => {
    return get(key as string).then(value =>
      typeof value === 'undefined' ? null : value
    );
  },

  set: (_target, key, value): boolean => {
    void set(key as string, value);
    subscriptions.filter(sub => sub.key === key).forEach(({ check }) => check());
    return true;
  },

  deleteProperty: (_target, key): boolean => {
    void del(key as string);
    subscriptions.filter(sub => sub.key === key).forEach(({ check }) => check());
    return true;
  },
});

export interface DbStore {
  (): Promise<Record<string, unknown>>;
  name: unknown;
  length: unknown;
  [key: string]: unknown;
}

export default db as unknown as DbStore;
