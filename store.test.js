import { cookies, local } from './store.min';
const store = require('./store.min.js');
const { cookies: cookiesReq, local: localReq } = require('./store.min.js')

describe('minimized', () => {
  it('is defined', () => {
    expect(cookies).toBeDefined();
    expect(local).toBeDefined();

    expect(store).toBeDefined();
    expect(store.cookies).toBeDefined();
    expect(store.local).toBeDefined();
    expect(cookiesReq).toBeDefined();
    expect(localReq).toBeDefined();
  });
});
