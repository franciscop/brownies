import local from './local';

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
    expect(localStorage.getItem('name')).toBe(JSON.stringify('Francisco'));
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
    expect(Object.keys(local)).toEqual(['firstname', 'lastname']);
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
});
