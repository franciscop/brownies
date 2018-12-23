import local from './local';
import { pack } from './packer';

describe('local', () => {
  it('is defined', () => {
    expect(local).toBeDefined();
  });

  it('can set, read and remove local', () => {
    expect(local.name).toBe(null);
    local.name = 'Francisco';
    expect(local.name).toBe('Francisco');
    delete local.name;
    expect(local.name).toBe(null);
  });

  it('does work with the underlying engine', () => {
    expect(localStorage.getItem('name')).toBe(null);
    local.name = 'Francisco';
    expect(localStorage.getItem('name')).toBe(pack('Francisco'));
    delete local.name;
    expect(localStorage.getItem('name')).toBe(null);
  });

  it('can list the local', () => {
    local.firstname = 'Francisco';
    local.lastname = 'Presencia';
    expect(Object.keys(local)).toEqual(['firstname', 'lastname']);
    expect(Object.values(local)).toEqual(['Francisco', 'Presencia']);
    expect(Object.entries(local)).toEqual([['firstname', 'Francisco'], ['lastname', 'Presencia']]);
    delete local.firstname;
    delete local.lastname;
  });

  it('can iterate with "in"', () => {
    local.firstname = 'Francisco';
    local.lastname = 'Presencia';
    const keys = [];
    for (let key in local) {
      keys.push(key);
    }
    expect(keys).toEqual(['firstname', 'lastname']);
    delete local.firstname;
    delete local.lastname;
  });

  it('throws for the iteration since it is not yet ready', () => {
    local.firstname = 'Francisco';
    local.lastname = 'Presencia';
    const values = [];
    for (let val of local) {
      values.push(val);
    }
    expect(values).toEqual(['Francisco', 'Presencia']);
  });

  it('retains the types', () => {
    local.id = 1;
    local.accepted = true;
    local.name = 'Francisco';
    local.friends = [3, 5];
    local.user = { id: 1, accepted: true, name: 'Francisco' };
    expect(typeof local.id).toEqual('number');
    expect(typeof local.accepted).toEqual('boolean');
    expect(typeof local.name).toEqual('string');
    expect(Array.isArray(local.friends)).toEqual(true);
    expect(typeof local.user).toEqual('object');
    for (let key in local) {
      delete local[key];
    }
  });

  it('can iterate with invalid items', () => {
    local.firstname = 'Francisco';
    localStorage.setItem('lastname', 'Presencia');
    localStorage.setItem('age', '25');
    const keys = [];
    for (let key in local) {
      keys.push(key);
    }
    const values = [];
    for (let key of local) {
      values.push(key);
    }
    expect(keys).toEqual(['firstname', 'lastname', 'age']);
    expect(values).toEqual(['Francisco', 'Presencia', '25']);
    expect(Object.keys(local)).toEqual(['firstname', 'lastname', 'age']);
    expect(Object.values(local)).toEqual(['Francisco', 'Presencia', '25']);
    expect(Object.entries(local)).toEqual([
      ['firstname', 'Francisco'],
      ['lastname', 'Presencia'],
      ['age', '25']
    ]);
    delete local.firstname;
    delete local.lastname;
    delete local.age;
  });
});
