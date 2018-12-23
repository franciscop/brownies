import subscribe from './subscribe';
import sinon from 'sinon';
import delay from 'delay';

describe('subscribe', () => {
  it('is defined', () => {
    expect(subscribe).toBeDefined();
  });

  it('can listen to any object', async () => {
    const obj = {};
    const cb = sinon.spy();
    subscribe(obj, 'id', cb);
    obj.id = 10;
    await delay(200);
    expect(cb.calledOnce).toBe(true);
  });

  it('can listen on deletion as well', async () => {
    const obj = { id: 10 };
    const cb = sinon.spy();
    subscribe(obj, 'id', cb);
    delete obj.id;
    await delay(200);
    expect(cb.calledOnce).toBe(true);
  });

  it('does well with undefined/null', async () => {
    const obj = {};
    const cb = sinon.spy();
    subscribe(obj, 'id', cb);
    obj.id = null;
    await delay(200);
    expect(cb.calledOnce).toBe(true);
  });

  it('does well with string/number', async () => {
    const obj = { id: 10 };
    const cb = sinon.spy();
    subscribe(obj, 'id', cb);
    obj.id = '10';
    await delay(200);
    expect(cb.calledOnce).toBe(true);
  });

  it('does well with objects', async () => {
    const obj = { user: { id: 10 } };
    const cb = sinon.spy();
    subscribe(obj, 'user', cb);
    obj.user.id = 20;
    await delay(200);
    expect(cb.calledOnce).toBe(true);
  });

  it('does well with promises without changes', async () => {
    const obj = { user: Promise.resolve({ id: 10 }) };
    const cb = sinon.spy();
    subscribe(obj, 'user', cb);
    obj.user = { id: 10 };
    await delay(200);
    expect(cb.calledOnce).toBe(false);
  });

  it('does well with promises', async () => {
    const obj = { user: Promise.resolve({ id: 10 }) };
    const cb = sinon.spy();
    subscribe(obj, 'user', cb);
    obj.user = { id: 20 };
    await delay(200);
    expect(cb.calledOnce).toBe(true);
  });

  it('will not trigger with the same object', async () => {
    const obj = { user: { id: 10, name: 'Francisco' } };
    const cb = sinon.spy();
    subscribe(obj, 'user', cb);
    obj.user.id = 10;
    await delay(200);
    expect(cb.calledOnce).toBe(false);
  });

  // Note: this fails with JSON.stringify, but works with the deterministic one
  it('will not trigger with the same object but flipped', async () => {
    const obj = { user: { id: 10, name: 'Francisco' } };
    const cb = sinon.spy();
    subscribe(obj, 'user', cb);
    obj.user = { name: 'Francisco', id: 10 };
    await delay(200);
    expect(cb.calledOnce).toBe(false);
  });
});
