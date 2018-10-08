(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.store = {})));
}(this, (function (exports) { 'use strict';

var cookies$2 = function (data, opt) {
  function defaults (obj, defs) {
    obj = obj || {};
    for (var key in defs) {
      if (obj[key] === undefined) {
        obj[key] = defs[key];
      }
    }
    return obj;
  }

  defaults(cookies$2, {
    expires: 365 * 24 * 3600,
    path: '/',
    secure: window.location.protocol === 'https:',

    // Advanced
    nulltoremove: true,
    autojson: true,
    autoencode: true,
    encode: function (val) {
      return encodeURIComponent(val);
    },
    decode: function (val) {
      return decodeURIComponent(val);
    },
    fallback: false
  });

  opt = defaults(opt, cookies$2);

  function expires (time) {
    var expires = time;
    if (!(expires instanceof Date)) {
      expires = new Date();
      expires.setTime(expires.getTime() + (time * 1000));
    }
    return expires.toUTCString();
  }

  if (typeof data === 'string') {
    var value = document.cookie.split(/;\s*/)
      .map(opt.autoencode ? opt.decode : function (d) { return d; })
      .map(function (part) { return part.split('='); })
      .reduce(function (parts, part) {
        parts[part[0]] = part.splice(1).join('=');
        return parts;
      }, {})[data];
    if (!opt.autojson) return value;
    var real;
    try {
      real = JSON.parse(value);
    } catch (e) {
      real = value;
    }
    if (typeof real === 'undefined' && opt.fallback) real = opt.fallback(data, opt);
    return real;
  }

  // Set each of the cookies
  for (var key in data) {
    var val = data[key];
    var expired = typeof val === 'undefined' || (opt.nulltoremove && val === null);
    var str = opt.autojson ? JSON.stringify(val) : val;
    var encoded = opt.autoencode ? opt.encode(str) : str;
    if (expired) encoded = '';
    var res = opt.encode(key) + '=' + encoded +
      (opt.expires ? (';expires=' + expires(expired ? -10000 : opt.expires)) : '') +
      ';path=' + opt.path +
      (opt.domain ? (';domain=' + opt.domain) : '') +
      (opt.secure ? ';secure' : '');
    if (opt.test) opt.test(res);
    document.cookie = res;
  }
  return cookies$2;
};

// Thanks Keith Cirkel! https://www.keithcirkel.co.uk/metaprogramming-in-es6-symbols/
var options = Symbol('options');

const getAll = () => {
  const pairs = document.cookie.split(";");
  const cookies = {};
  for (var i=0; i<pairs.length; i++){
    const pair = pairs[i].split("=");
    cookies[(pair[0]+'').trim()] = JSON.parse(unescape(pair[1]));
  }
  return cookies;
};

const cookies = new Proxy({}, {
  get (target, key) {
    // For the `for (let key of value)` iteration
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
    if (key === Symbol.iterator) {
      const all = Object.values(getAll());
      return function* () {
        while(all.length) yield all.shift();
      };
    }
    if (key === options) {
      return cookies$2;
    }
    return cookies$2(key);
  },

  set (target, key, value) {
    if (key === options) {
      for (let key in value) {
        cookies$2[key] = value[key];
        return true;
      }
    }
    cookies$2({ [key]: value });
    return true;
  },

  deleteProperty (target, key) {
    cookies$2({ [key]: null });
    return true;
  },

  // Allow to do `for (let key in cookies) { ... }`
  getOwnPropertyDescriptor(k) {
    return {
      enumerable: true,
      configurable: true,
    };
  },

  ownKeys (target) {
    return Object.keys(getAll());
  }
});

const getAll$1 = () => {
  const all = {};
  for (var key in localStorage){
    if (local[key] !== null) {
      all[key] = local[key];
    }
  }
  return all;
};

const local = new Proxy({}, {
  get: (target, key) => {
    // For the `for (let key of value)` iteration
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
    if (key === Symbol.iterator) {
      const all = Object.values(getAll$1());
      return function* () {
        while(all.length) yield all.shift();
      };
    }
    return JSON.parse(localStorage.getItem(key));
  },

  set: (target, key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  },

  deleteProperty: (target, key) => {
    localStorage.removeItem(key);
    return true;
  },

  // Allow to do `for (let key in cookies) { ... }`
  getOwnPropertyDescriptor(k) {
    return {
      enumerable: true,
      configurable: true,
    };
  },

  ownKeys (target) {
    return Object.keys(getAll$1());
  }
});

exports.cookies = cookies;
exports.local = local;
exports.options = options;

Object.defineProperty(exports, '__esModule', { value: true });

})));
