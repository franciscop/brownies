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
});
