import options from './options';
import engine from '../lib/cookies';

// THOSE DO NOT WORK :(
// import engine from '../node_modules/cookiesjs/cookies.min.js';
// import engine from 'cookiesjs';
// import engine from '../node_modules/cookiesjs/cookies.js';

const getAll = () => {
  const pairs = document.cookie.split(";");
  const cookies = {};
  for (var i=0; i<pairs.length; i++){
    const pair = pairs[i].split("=");
    cookies[(pair[0]+'').trim()] = JSON.parse(unescape(pair[1]));
  }
  return cookies;
};

const cookies = new Proxy({}, {
  get (target, key) {
    // For the `for (let key of value)` iteration
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
    if (key === Symbol.iterator) {
      const all = Object.values(getAll());
      return function* () {
        while(all.length) yield all.shift();
      };
    }
    if (key === options) {
      return engine;
    }
    return engine(key);
  },

  set (target, key, value) {
    if (key === options) {
      for (let key in value) {
        engine[key] = value[key];
        return true;
      }
    }
    engine({ [key]: value });
    return true;
  },

  deleteProperty (target, key) {
    engine({ [key]: null });
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


export default cookies;
