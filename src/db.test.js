import db from './db';
global.indexedDB = global.indexedDB || require("fake-indexeddb");

describe('db', () => {
  it('is defined', () => {
    expect(db).toBeDefined();
  });

  it('can set, read and remove db', async () => {
    expect(await db.name).toBe(null);
    db.name = 'Francisco';
    expect(await db.name).toBe('Francisco');
    delete db.name;
    expect(await db.name).toBe(null);
  });

  // All of those depend on "ownKeys", and "ownKeys" cannot return a Promise...
  it('can list the db', async () => {
    db.firstname = 'Francisco';
    db.lastname = 'Presencia';
    expect(Object.keys(await db())).toEqual(['firstname', 'lastname']);
    expect(Object.values(await db())).toEqual(['Francisco', 'Presencia']);
    expect(Object.entries(await db())).toEqual([['firstname', 'Francisco'], ['lastname', 'Presencia']]);
    delete db.firstname;
    delete db.lastname;
  });

  // This again uses "ownKeys", so it cannot be reliably iterated
  it('can iterate with "in"', async () => {
    db.firstname = 'Francisco';
    db.lastname = 'Presencia';
    const keys = [];
    for (let key in await db()) {
      keys.push(key);
    }
    expect(keys).toEqual(['firstname', 'lastname']);
    delete db.firstname;
    delete db.lastname;
  });

  it('retains the types', async () => {
    db.id = 1;
    db.accepted = true;
    db.name = 'Francisco';
    db.friends = [3, 5];
    db.user = { id: 1, accepted: true, name: 'Francisco' };
    expect(typeof await db.id).toEqual('number');
    expect(typeof await db.accepted).toEqual('boolean');
    expect(typeof await db.name).toEqual('string');
    expect(Array.isArray(await db.friends)).toEqual(true);
    expect(typeof await db.user).toEqual('object');
    for (let key in await db()) {
      delete db[key];
    }
  });

  it('can iterate in many ways', async () => {
    db.firstname = 'Francisco';
    db.lastname = 'Presencia';
    db.age = '25';
    const keys = [];
    const values = [];
    for (let key in await db()) {
      keys.push(key);
      values.push(await db[key]);
    }
    expect(keys).toEqual(['age', 'firstname', 'lastname']);
    expect(values).toEqual(['25', 'Francisco', 'Presencia']);
    expect(Object.keys(await db())).toEqual(['age', 'firstname', 'lastname']);
    expect(Object.values(await db())).toEqual(['25', 'Francisco', 'Presencia']);
    expect(Object.entries(await db())).toEqual([
      ['age', '25'],
      ['firstname', 'Francisco'],
      ['lastname', 'Presencia']
    ]);
    delete db.firstname;
    delete db.lastname;
    delete db.age;
  });
});
