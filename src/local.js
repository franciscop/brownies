const local = new Proxy({}, {
  get: (target, key) => {
    return JSON.parse(localStorage.getItem(key));
  },
  set: (target, key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  },
  deleteProperty: (target, key) => {
    localStorage.removeItem(key);
    return true;
  }
});


export default local;
