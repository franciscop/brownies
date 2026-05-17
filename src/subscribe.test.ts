import { describe, it, expect, mock } from 'bun:test';
import subscribe from './subscribe';
import delay from 'delay';

describe('subscribe', () => {
  it('is defined', () => {
    expect(subscribe).toBeDefined();
  });

  it('can listen to any object', async () => {
    const obj: Record<string, unknown> = {};
    const cb = mock(() => {});
    subscribe(obj, 'id', cb);
    obj.id = 10;
    await delay(200);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('can listen on deletion as well', async () => {
    const obj: Record<string, unknown> = { id: 10 };
    const cb = mock(() => {});
    subscribe(obj, 'id', cb);
    delete obj.id;
    await delay(200);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('does well with undefined/null', async () => {
    const obj: Record<string, unknown> = {};
    const cb = mock(() => {});
    subscribe(obj, 'id', cb);
    obj.id = null;
    await delay(200);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('does well with string/number', async () => {
    const obj: Record<string, unknown> = { id: 10 };
    const cb = mock(() => {});
    subscribe(obj, 'id', cb);
    obj.id = '10';
    await delay(200);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('does well with objects', async () => {
    const obj: Record<string, unknown> = { user: { id: 10 } };
    const cb = mock(() => {});
    subscribe(obj, 'user', cb);
    (obj.user as Record<string, unknown>).id = 20;
    await delay(200);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('does well with promises without changes', async () => {
    const obj: Record<string, unknown> = { user: Promise.resolve({ id: 10 }) };
    const cb = mock(() => {});
    subscribe(obj, 'user', cb);
    obj.user = { id: 10 };
    await delay(200);
    expect(cb).not.toHaveBeenCalled();
  });

  it('does well with promises', async () => {
    const obj: Record<string, unknown> = { user: Promise.resolve({ id: 10 }) };
    const cb = mock(() => {});
    subscribe(obj, 'user', cb);
    obj.user = { id: 20 };
    await delay(200);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('will not trigger with the same object', async () => {
    const obj = { user: { id: 10, name: 'Francisco' } };
    const cb = mock(() => {});
    subscribe(obj, 'user', cb);
    obj.user.id = 10;
    await delay(200);
    expect(cb).not.toHaveBeenCalled();
  });

  // Note: this fails with JSON.stringify, but works with the deterministic one
  it('will not trigger with the same object but flipped', async () => {
    const obj = { user: { id: 10, name: 'Francisco' } };
    const cb = mock(() => {});
    subscribe(obj, 'user', cb);
    obj.user = { name: 'Francisco', id: 10 };
    await delay(200);
    expect(cb).not.toHaveBeenCalled();
  });
});
