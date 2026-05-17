import options from './options';
import engine from './engine.js';
import type { CookieEngine, CookieOptions } from './engine.js';
import subscriptions from './subscriptions';

export type CookieStore = Record<string, unknown> & {
  get [options](): CookieEngine;
  set [options](v: Partial<CookieOptions>);
};

const getAll = (): Record<string, unknown> => {
  const pairs = document.cookie.split(';').filter(p => p.trim());
  const all: Record<string, unknown> = {};
  for (const pair of pairs) {
    const [rawKey = ''] = pair.split('=');
    const key = decodeURIComponent(rawKey.trim());
    if (key) {
      try {
        all[key] = get({}, key);
      } catch {
        // skip malformed cookies
      }
    }
  }
  return all;
};

const getIterator = (): (() => Generator<unknown>) => {
  const all = Object.values(getAll());
  return function* () {
    while (all.length) yield all.shift()!;
  };
};

const get = (_target: Record<string, unknown>, key: string | symbol): unknown => {
  if (key === Symbol.iterator) return getIterator();
  if (key === options) return engine;
  if (typeof key !== 'string') return undefined;
  const value = engine(key);
  return value === undefined ? null : value;
};

const set = (_target: Record<string, unknown>, key: string | symbol, value: unknown = null): boolean => {
  if (key === options) {
    for (const k in value as Record<string, unknown>) {
      engine[k] = (value as Record<string, unknown>)[k];
    }
    return true;
  }
  if (typeof key !== 'string') return false;
  engine({ [key]: value });
  subscriptions.filter(sub => sub.key === key).forEach(({ check }) => check());
  return true;
};

const deleteProperty = (_target: Record<string, unknown>, key: string | symbol): boolean =>
  set(_target, key, null);

const getOwnPropertyDescriptor = (): PropertyDescriptor => ({ enumerable: true, configurable: true });

const ownKeys = (): string[] => Object.keys(getAll());

const cookies: CookieStore = new Proxy({} as CookieStore, {
  get,
  set,
  deleteProperty,
  getOwnPropertyDescriptor,
  ownKeys,
}) as CookieStore;

export default cookies;
