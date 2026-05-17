import { describe, it, expect, mock } from 'bun:test';
import unsubscribe from './unsubscribe';
import subscribe from './subscribe';
import delay from 'delay';

describe('unsubscribe', () => {
  it('is defined', () => {
    expect(unsubscribe).toBeDefined();
  });

  it('can unsubscribe with the id', async () => {
    const obj: Record<string, unknown> = {};
    const cb = mock(() => {});
    const id = subscribe(obj, 'id', cb);
    obj.id = 10;
    await delay(200);
    unsubscribe(id);
    obj.id = 20;
    await delay(200);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('can unsubscribe with the callback', async () => {
    const obj: Record<string, unknown> = {};
    const cb = mock(() => {});
    subscribe(obj, 'id', cb);
    obj.id = 10;
    await delay(200);
    unsubscribe(cb);
    obj.id = 20;
    await delay(200);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('can unsubscribe multiple callbacks', async () => {
    const obj: Record<string, unknown> = {};
    const cb = mock(() => {});
    subscribe(obj, 'id', cb);
    subscribe(obj, 'key', cb);
    subscribe(obj, 'bla', cb);
    obj.id = 10;
    await delay(200);
    unsubscribe(cb);
    obj.id = 20;
    obj.key = 20;
    obj.bla = 20;
    await delay(200);
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
