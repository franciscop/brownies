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
  const check = () => {
    if (toFlat(prev) === toFlat(obj[key])) return;
    cb(obj[key], prev);
    prev = clone(obj[key]);
  };
  const id = setInterval(check, 100);
  subscriptions.push({ id, key, check, cb });
  return id;
};
