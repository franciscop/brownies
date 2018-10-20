import { cookies, local } from './brownies.min';
const brownies = require('./brownies.min.js');
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
});
