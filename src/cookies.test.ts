import { describe, it, expect } from 'bun:test';
import cookies from './cookies';
import options from './options';
import delay from 'delay';

describe('cookies', () => {
  it('is defined', () => {
    expect(cookies).toBeDefined();
  });

  it('can set, read and remove cookies', () => {
    expect(cookies.name).toBe(null);
    cookies.name = 'Francisco';
    expect(cookies.name).toBe('Francisco');
    delete cookies.name;
    expect(cookies.name).toBe(null);
  });

  it('does work with the underlying engine', () => {
    expect(document.cookie).toBe('');
    cookies.name = 'Francisco';
    const raw = decodeURIComponent(document.cookie);
    expect(raw).toBe('name=' + JSON.stringify('Francisco'));
    delete cookies.name;
    expect(document.cookie).toBe('');
  });

  it('can list the cookies', () => {
    cookies.firstname = 'Francisco';
    cookies.lastname = 'Presencia';
    expect(Object.keys(cookies)).toEqual(['firstname', 'lastname']);
    expect(Object.values(cookies)).toEqual(['Francisco', 'Presencia']);
    expect(Object.entries(cookies)).toEqual([['firstname', 'Francisco'], ['lastname', 'Presencia']]);
    delete cookies.firstname;
    delete cookies.lastname;
  });

  it('can iterate with "in"', () => {
    cookies.firstname = 'Francisco';
    cookies.lastname = 'Presencia';
    const keys = [];
    for (const key in cookies) {
      keys.push(key);
    }
    expect(keys).toEqual(['firstname', 'lastname']);
    delete cookies.firstname;
    delete cookies.lastname;
  });

  it('can iterate with "of"', () => {
    cookies.firstname = 'Francisco';
    cookies.lastname = 'Presencia';
    const values = [];
    for (const val of cookies as unknown as Iterable<unknown>) {
      values.push(val);
    }
    expect(values).toEqual(['Francisco', 'Presencia']);
    delete cookies.firstname;
    delete cookies.lastname;
  });

  it('retains the types', () => {
    cookies.id = 1;
    cookies.accepted = true;
    cookies.name = 'Francisco';
    cookies.friends = [3, 5];
    cookies.user = { id: 1, accepted: true, name: 'Francisco' };
    expect(typeof cookies.id).toEqual('number');
    expect(typeof cookies.accepted).toEqual('boolean');
    expect(typeof cookies.name).toEqual('string');
    expect(Array.isArray(cookies.friends)).toEqual(true);
    expect(typeof cookies.user).toEqual('object');
    for (const key in cookies) {
      delete cookies[key];
    }
  });

  it('can iterate with invalid items', () => {
    cookies.firstname = 'Francisco';
    document.cookie = 'lastname=Presencia';
    document.cookie = 'age=25';
    const keys = [];
    for (const key in cookies) {
      keys.push(key);
    }
    const values = [];
    for (const val of cookies as unknown as Iterable<unknown>) {
      values.push(val);
    }
    expect(keys).toEqual(['firstname', 'lastname', 'age']);
    expect(values).toEqual(['Francisco', 'Presencia', 25]);
    expect(Object.keys(cookies)).toEqual(['firstname', 'lastname', 'age']);
    expect(Object.values(cookies)).toEqual(['Francisco', 'Presencia', 25]);
    expect(Object.entries(cookies)).toEqual([
      ['firstname', 'Francisco'],
      ['lastname', 'Presencia'],
      ['age', 25],
    ]);
    delete cookies.firstname;
    delete cookies.lastname;
    delete cookies.age;
  });

  describe('options', () => {
    it('will expire naturally', async () => {
      cookies[options] = {};
      expect(cookies.id).toBe(null);
      cookies.id = 10;
      await delay(100);
      expect(cookies.id).toBe(10);
      delete cookies.id;
      await delay(100);
      expect(cookies.id).toBe(null);
    });

    it('can set the expiration', async () => {
      cookies[options] = { expires: 1 };
      expect(cookies.id).toBe(null);
      cookies.id = 10;
      expect(cookies.id).toBe(10);
      await delay(1500);
      expect(cookies[options].expires).toBe(1);
      expect(cookies.id).toBe(null);
    });

    it('can set the expiration', async () => {
      cookies[options].expires = 2;
      expect(cookies.id).toBe(null);
      cookies.id = 10;
      expect(cookies.id).toBe(10);
      expect(cookies[options].expires).toBe(2);
      await delay(1100);
      expect(cookies.id).toBe(10);
      await delay(1500);
      expect(cookies.id).toBe(null);
    });
  });
});
