import subscriptions from './subscriptions';

const isBasic = value => !value || ['boolean', 'number', 'string'].includes(typeof value);

const toFlat = value => {
  if (isBasic(value)) return value;
  return JSON.stringify(value);
};

const clone = value => {
  if (isBasic(value)) return value;
  return JSON.parse(JSON.stringify(value));
};

export default (obj, key, cb) => {
  let prev = clone(obj[key]);
  const id = setInterval(() => {
    if (toFlat(prev) !== toFlat(obj[key])) {
      cb(obj[key], prev);
      prev = clone(obj[key]);
    }
  }, 100);
  subscriptions.push([id, cb]);
  return id;
};
