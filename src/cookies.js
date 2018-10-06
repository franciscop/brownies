import engine from '../lib/cookies';

const cookies = new Proxy({}, {
  get: (target, key) => {
    return engine(key);
  },
  set: (target, key, value) => {
    engine({ [key]: value });
    return true;
  },
  deleteProperty: (target, key) => {
    engine({ [key]: null });
    return true;
  }
});


export default cookies;
