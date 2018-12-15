import subscriptions from './subscriptions';
import stringify from '../lib/stringify';

const isBasic = value => !value || ['boolean', 'number', 'string'].includes(typeof value);

const clone = value => {
  if (isBasic(value)) return value;
  return JSON.parse(stringify(value));
};

export default (obj, key, cb) => {
  let prev = clone(obj[key]);
  const check = () => {
    if (stringify(prev) === stringify(obj[key])) return;
    cb(obj[key], prev);
    prev = clone(obj[key]);
  };
  const id = setInterval(check, 100);
  subscriptions.push({ id, key, check, cb });
  return id;
};
