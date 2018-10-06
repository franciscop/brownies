import engine from '../lib/cookies';

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
    return engine(key);
  },

  set (target, key, value) {
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
