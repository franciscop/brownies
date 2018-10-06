import store from './store.min';
import { cookies, local } from './store.min';
const storeReq = require('./store.min.js');
const { cookies: cookiesReq, local: localReq } = require('./store.min.js')

describe('minimized', () => {
  it('is defined', () => {
    // expect(store).toBeDefined();
    // expect(store.cookies).toBeDefined();
    // expect(store.local).toBeDefined();
    expect(cookies).toBeDefined();
    expect(local).toBeDefined();

    expect(storeReq).toBeDefined();
    expect(storeReq.cookies).toBeDefined();
    expect(storeReq.local).toBeDefined();
    expect(cookiesReq).toBeDefined();
    expect(localReq).toBeDefined();
  });
});
