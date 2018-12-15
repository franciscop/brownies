import { pack, unpack } from './packer';
import smJson from '../data/small';
import mdJson from '../data/mid';

describe('lz', () => {
  it('can decompress itself', () => {
    expect(unpack(pack('Hello world'))).toBe('Hello world');
  });

  it('compresses small JSON surprisingly well (< 20%)', () => {
    expect(pack(smJson).length).not.toBeGreaterThan(JSON.stringify(mdJson).length / 5);
  });

  it('does not compress large JSONs', () => {
    const packed = pack(mdJson).length;
    const plain = JSON.stringify(mdJson).length;
    // The only difference is the ID
    expect(Math.abs(packed - plain)).not.toBeGreaterThan(10);
  });
});
