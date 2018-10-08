import unsubscribe from './unsubscribe';
import subscribe from './subscribe';
import sinon from 'sinon';
import delay from 'delay';

describe('subscribe', () => {
  it('is defined', () => {
    expect(subscribe).toBeDefined();
  });

  it('can unsubscribe with the id', async () => {
    const obj = {};
    const cb = sinon.spy();
    const id = subscribe(obj, 'id', cb);
    obj.id = 10;
    await delay(200);
    unsubscribe(id);
    obj.id = 20;
    await delay(200);
    expect(cb.calledOnce).toBe(true);
  });

  it('can unsubscribe with the callback', async () => {
    const obj = {};
    const cb = sinon.spy();
    subscribe(obj, 'id', cb);
    obj.id = 10;
    await delay(200);
    unsubscribe(cb);
    obj.id = 20;
    await delay(200);
    expect(cb.calledOnce).toBe(true);
  });
});
