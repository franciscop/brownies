import { describe, it, expect, mock } from 'bun:test';
import { cookies, local, session, subscribe } from './index';
import delay from 'delay';

describe('integration', () => {
  it('exports are defined', () => {
    expect(cookies).toBeDefined();
    expect(local).toBeDefined();
    expect(session).toBeDefined();
  });

  it('subscribe triggers immediately via proxy set', () => {
    const fn = mock(() => {});
    subscribe(cookies, 'same', fn);
    cookies.same = 'should trigger';
    expect(fn).toHaveBeenCalledWith('should trigger', null);
    delete cookies.same;
    unsubscribe(fn);
  });

  it('does not cross-subscribe', async () => {
    const fn = mock(() => {});
    subscribe(cookies, 'cross', fn);
    session.cross = 'should not trigger';
    local.cross = 'should not trigger';
    await delay(300);
    expect(fn).not.toHaveBeenCalled();
    delete session.cross;
    delete local.cross;
    unsubscribe(fn);
  });
});

import unsubscribe from './unsubscribe';
