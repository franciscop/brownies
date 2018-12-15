// Note: to run this, the easiest is to just rename it to `ratios.test.js` and run npm test
import { pack, unpack } from '../src/packer';
import midJson from './mid';
import lrgJson from './large';
import shake from './shakespeare';

const compress = (name, str) => {
  const init = new Date();
  const packed = pack(str);
  console.log(`${name}: ${
    Math.floor(str.length / 1000)
  }kb →  ${
    Math.floor(packed.length / 1000)
  }kb in ${new Date() - init}ms`);
};

compress('Small Json', JSON.stringify(midJson[0]));
compress('Mid Json', JSON.stringify(midJson));
compress('Large Json', JSON.stringify(lrgJson));
compress('Shakespeare', shake);

describe('data ratios', () => {
  it('works', () => {})
});
