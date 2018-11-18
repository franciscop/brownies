import subscriptions from './subscriptions';

const getAll = () => {
  const all = {};
  for (var key in sessionStorage){
    if (local[key] !== null) {
      all[key] = local[key];
    }
  }
  return all;
};

const local = new Proxy({}, {
  get: (target, key) => {
    // For the `for (let key of value)` iteration
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
    if (key === Symbol.iterator) {
      const all = Object.values(getAll());
      return function* () {
        while(all.length) yield all.shift();
      };
    }
    const item = sessionStorage.getItem(key);
    try {
      return JSON.parse(item);
    } catch (error) {
      console.warn(`sessionStorage item for "${key}" is not valid JSON`);
      return item;
    }
  },

  set: (target, key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
    subscriptions.filter(sub => sub.key === key).forEach(({ check }) => check());
    return true;
  },

  deleteProperty: (target, key) => {
    sessionStorage.removeItem(key);
    subscriptions.filter(sub => sub.key === key).forEach(({ check }) => check());
    return true;
  },

  // Allow to do `for (let key in cookies) { ... }`
  getOwnPropertyDescriptor(k) {
    return {
      enumerable: true,
      configurable: true,
    };
  },

  ownKeys (target) {
    return Object.keys(getAll());
  }
});

export default local;
