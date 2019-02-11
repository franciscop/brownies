import stringify from '../lib/stringify';

const js = 'JSSTR:';

export const pack = str => {
  // The storage techs can only store Strings, so convert anything else
  if (typeof str !== 'string') {
    str = js + stringify(str);
  }
  return str;
};

export const unpack = str => {
  if (str && typeof str === 'string' && str.slice(0, js.length) === js) {
    return JSON.parse(str.slice(js.length));
  }
  return str;
};
