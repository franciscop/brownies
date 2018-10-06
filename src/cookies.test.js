import cookies from './cookies';

describe('cookies', () => {
  it('is defined', () => {
    expect(cookies).toBeDefined();
  });

  it('can set, read and remove cookies', () => {
    expect(cookies.name).toBe(undefined);
    cookies.name = 'Francisco';
    expect(cookies.name).toBe('Francisco');
    delete cookies.name;
    expect(cookies.name).toBe(undefined);
  });

  it('does work with the underlying engine', () => {
    expect(document.cookie).toBe("");
    cookies.name = 'Francisco';
    const raw = decodeURIComponent(document.cookie);
    expect(raw).toBe('name=' + JSON.stringify('Francisco'));
    delete cookies.name;
    expect(document.cookie).toBe("");
  });
});
