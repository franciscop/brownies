import { cookies, local, session, subscribe } from './brownies';
const brownies = require('./brownies.min.js');
const delay = require('delay');
const { cookies: cookiesReq, local: localReq } = require('./brownies.min.js');

describe('minimized', () => {
  it('is defined', () => {
    expect(cookies).toBeDefined();
    expect(local).toBeDefined();

    expect(brownies).toBeDefined();
    expect(brownies.cookies).toBeDefined();
    expect(brownies.local).toBeDefined();
    expect(cookiesReq).toBeDefined();
    expect(localReq).toBeDefined();
  });

  it('will call it appropriately', () => {
    const fn = jest.fn();
    subscribe(cookies, 'same', fn);
    cookies.same = 'should not trigger';
    expect(fn).toBeCalledWith('should not trigger', null);
  });

  it('does not cross-subscribe', async () => {
    const fn = jest.fn();
    subscribe(cookies, 'cross', fn);
    session.cross = 'should not trigger';
    local.cross = 'should not trigger';
    await delay(300);
    expect(fn).not.toBeCalled();
  });
});
