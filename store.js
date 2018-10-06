(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.store = factory());
}(this, (function () { 'use strict';

var cookies = 'cookies';

var index = {
  cookies
};

return index;

})));
