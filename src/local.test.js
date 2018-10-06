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
});
