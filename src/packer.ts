import stringify from './lib/stringify';

const js = 'JSSTR:';

export const pack = (value: unknown): string => {
  if (typeof value !== 'string') {
    return js + stringify(value);
  }
  return value;
};

export const unpack = (str: string | null): unknown => {
  if (str && str.startsWith(js)) {
    return JSON.parse(str.slice(js.length));
  }
  return str;
};
