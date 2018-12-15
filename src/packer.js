import LZString from 'lznext';
import stringify from '../lib/stringify';

const js = 'JSSTR:';
const lz = 'LZSTR:';

export const pack = str => {
  // The storage techs can only store Strings, so convert anything else
  if (typeof str !== 'string') {
    str = js + stringify(str);
  }
  // Compress it only for relatively small strings, since compression is O(N)
  //   so it takes too long for large strings
  if (str.length < 100 * 1000) {
    str = lz + LZString.compressToUTF16(str);
  }
  return str;
};

export const unpack = str => {
  try {
    if (str.slice(0, lz.length) === lz) {
      str = LZString.decompressFromUTF16(str.slice(lz.length));
    }
    if (str.slice(0, js.length) === js) {
      str = JSON.parse(str.slice(js.length));
    }
    return str;
  } catch (e) {
    return str;
  }
};
