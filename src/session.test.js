import session from './session';
import { pack } from './packer';

describe('session', () => {
  it('is defined', () => {
    expect(session).toBeDefined();
  });

  it('can set, read and remove session', () => {
    expect(session.name).toBe(null);
    session.name = 'Francisco';
    expect(session.name).toBe('Francisco');
    delete session.name;
    expect(session.name).toBe(null);
  });

  it('does work with the underlying engine', () => {
    expect(sessionStorage.getItem('name')).toBe(null);
    session.name = 'Francisco';
    expect(sessionStorage.getItem('name')).toBe(pack('Francisco'));
    delete session.name;
    expect(sessionStorage.getItem('name')).toBe(null);
  });

  it('can list the session', () => {
    session.firstname = 'Francisco';
    session.lastname = 'Presencia';
    expect(Object.keys(session)).toEqual(['firstname', 'lastname']);
    expect(Object.values(session)).toEqual(['Francisco', 'Presencia']);
    expect(Object.entries(session)).toEqual([['firstname', 'Francisco'], ['lastname', 'Presencia']]);
    delete session.firstname;
    delete session.lastname;
  });

  it('can iterate with "in"', () => {
    session.firstname = 'Francisco';
    session.lastname = 'Presencia';
    const keys = [];
    for (let key in session) {
      keys.push(key);
    }
    expect(keys).toEqual(['firstname', 'lastname']);
    delete session.firstname;
    delete session.lastname;
  });

  it('throws for the iteration since it is not yet ready', () => {
    session.firstname = 'Francisco';
    session.lastname = 'Presencia';
    const values = [];
    for (let val of session) {
      values.push(val);
    }
    expect(values).toEqual(['Francisco', 'Presencia']);
  });

  it('retains the types', () => {
    session.id = 1;
    session.accepted = true;
    session.name = 'Francisco';
    session.friends = [3, 5];
    session.user = { id: 1, accepted: true, name: 'Francisco' };
    expect(typeof session.id).toEqual('number');
    expect(typeof session.accepted).toEqual('boolean');
    expect(typeof session.name).toEqual('string');
    expect(Array.isArray(session.friends)).toEqual(true);
    expect(typeof session.user).toEqual('object');
    for (let key in session) {
      delete session[key];
    }
  });

  it('can iterate with invalid items', () => {
    session.firstname = 'Francisco';
    sessionStorage.setItem('lastname', 'Presencia');
    sessionStorage.setItem('age', '25');
    const keys = [];
    for (let key in session) {
      keys.push(key);
    }
    const values = [];
    for (let key of session) {
      values.push(key);
    }
    expect(keys).toEqual(['firstname', 'lastname', 'age']);
    expect(values).toEqual(['Francisco', 'Presencia', '25']);
    expect(Object.keys(session)).toEqual(['firstname', 'lastname', 'age']);
    expect(Object.values(session)).toEqual(['Francisco', 'Presencia', '25']);
    expect(Object.entries(session)).toEqual([
      ['firstname', 'Francisco'],
      ['lastname', 'Presencia'],
      ['age', '25']
    ]);
    delete session.firstname;
    delete session.lastname;
    delete session.age;
  });
});
