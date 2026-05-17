import { describe, it, expect } from 'bun:test';
import { pack, unpack } from './packer';

describe('packer', () => {
  it('round-trips strings', () => {
    expect(unpack(pack('Hello world'))).toBe('Hello world');
  });

  it('round-trips numbers', () => {
    expect(unpack(pack(42))).toBe(42);
  });

  it('round-trips objects', () => {
    expect(unpack(pack({ a: 1 }))).toEqual({ a: 1 });
  });

  it('returns null for null input', () => {
    expect(unpack(null)).toBe(null);
  });
});
