import { pack, unpack } from './packer';
import smJson from '../data/small';
import mdJson from '../data/mid';

describe('lz', () => {
  it('can decompress itself', () => {
    expect(unpack(pack('Hello world'))).toBe('Hello world');
  });
});
