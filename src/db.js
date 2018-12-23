import subscriptions from './subscriptions';
import { get, set, del, keys } from 'idb-keyval';

const getAll = async () => {
  const all = {};
  const ks = await keys();
  await Promise.all(ks.map(async key => {
    all[key] = await get(key);
  }));
  return all;
};

const db = new Proxy(getAll, {
  get: async (target, key) => {
    // Make it consistent with the other browser storage technologies
    const value = await get(key);
    return typeof value === 'undefined' ? null : value;
  },

  set: (target, key, value) => {
    set(key, value);
    subscriptions.filter(sub => sub.key === key).forEach(({ check }) => check());
    return true;
  },

  deleteProperty: (target, key) => {
    del(key);
    subscriptions.filter(sub => sub.key === key).forEach(({ check }) => check());
    return true;
  },

  // Allow to do `for (let key in cookies) { ... }`
  // getOwnPropertyDescriptor(target, prop) {
  //   return {
  //     enumerable: true,
  //     configurable: true
  //   };
  // },

  // Works, but cannot be solved since keys() is async
  // return ['a', 'b'];
  // Does not work, a promise will be evaluated as an empty array []
  // return Promise.resolve(['a', 'b']);
  // ownKeys (target) {
  //   return ...;
  // }
});


export default db;
