import subscriptions from './subscriptions';
import stringify from '../lib/stringify';

const isBasic = value => !value || ['boolean', 'number', 'string'].includes(typeof value);

const clone = value => {
  if (isBasic(value)) return value;
  return JSON.parse(stringify(value));
};

export default (obj, key, cb) => {
  let prev = obj[key] && obj[key].then ? obj[key].then(clone) : clone(obj[key]);
  const check = () => {
    const value = obj[key];
    if ((prev && prev.then) || (value && value.then)) {
      return Promise.all([prev, value]).then(([previous, value]) => {
        if (stringify(previous) === stringify(value)) return;
        cb(value, previous);
        prev = clone(value);
      });
    }
    if (stringify(prev) === stringify(value)) return;
    cb(value, prev);
    prev = clone(value);
  };
  const id = setInterval(check, 100);
  subscriptions.push({ id, key, check, cb });
  return id;
};
