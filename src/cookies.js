import options from './options';
import engine from 'cookiesjs';
import subscriptions from './subscriptions';

// Get a single item from the cookies (except for getting the options or iterator)
const get = (target, key) => {
  if (key === Symbol.iterator) return getIterator();
  if (key === options) return engine;
  const value = engine(key);
  return (typeof value === 'undefined') ? null : value;
};

// Set a specific cookie (except for setting the options)
const set = (target, key, value = null) => {
  if (key === options) {
    for (let key in value) {
      engine[key] = value[key];
      return true;
    }
  }
  engine({ [key]: value });
  subscriptions.filter(sub => sub.key === key).forEach(({ check }) => check());
  return true;
};

const getAll = () => {
  const pairs = document.cookie.split(";");
  const cookies = {};
  for (var i=0; i<pairs.length; i++){
    const pair = pairs[i].split("=");
    const key = (pair[0] + '').trim();
    try {
      cookies[key] = get({}, key);
    } catch (error) {
      console.warn(error);
    }
  }
  return cookies;
};

// This is for the `for (let key of value)` iteration
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
const getIterator = () => {
  const all = Object.values(getAll());
  return function* () {
    while(all.length) yield all.shift();
  };
}

// Allow to do `for (let key in cookies) { ... }`
const getOwnPropertyDescriptor = () => ({ enumerable: true, configurable: true });

// Allow to do `Object.keys(cookies)`
const ownKeys = () => Object.keys(getAll());

const traps = { get, set, deleteProperty: set, getOwnPropertyDescriptor, ownKeys };
export default new Proxy({}, traps);
