// import store from './';
import { cookies, local } from './';

describe('store', () => {
  it('is defined', () => {
    // expect(store).toBeDefined();
    // expect(store.cookies).toBeDefined();
    // expect(store.local).toBeDefined();
    expect(cookies).toBeDefined();
    expect(local).toBeDefined();
  });
});
