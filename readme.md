# Clean Store [![npm install clean-store](https://img.shields.io/badge/npm%20install-clean--store-blue.svg)](https://www.npmjs.com/package/clean-store) [![gzip size](https://img.badgesize.io/franciscop/clean-store/master/store.min.js.svg?compression=gzip)](https://github.com/franciscop/clean-store/blob/master/store.min.js) [![dependencies](https://img.shields.io/badge/dependencies-0-green.svg)](https://github.com/franciscop/clean-store/blob/master/package.json)

A clean interface for browser storage technologies in 1kb:

```js
import { cookies, local } from 'clean-store';

cookies.token = 42;      // Set it
const t = cookies.token; // Get it
delete cookies.token;    // Eat it

local.token = 42;        // Set it
const t = local.token;   // Get it
delete local.token;      // Del it
```

You can also [iterate them as expected](https://github.com/franciscop/clean-store/blob/master/src/cookies.test.js) with `Object.keys()`, `Object.values()`, `for(...)`, etc:

```js
cookies.token = 42;
cookies.name = 'Francisco';

console.log(Object.keys(cookies)); // token, name

for (let val of cookies) {
  console.log(val); // 42, 'Francisco'
}
```



## Getting started

Install it with npm:

```
npm install clean-store
```

Then import the different parts:

```js
import { cookies, local, ... } from 'clean-store';
const { cookies, local, ... } = require('clean-store');
```

Or use a CDN for the browser:

```js
<script src="https://cdn.jsdelivr.net/npm/clean-store"></script>
<script>
  const { cookies, local, ... } = store;
</script>
```



## Documentation

The above should be enough for most cases, but here are some extra details.

### Cookies

Manipulate cookies with the simple getter/setter interface:

```js
import { cookies } from 'clean-store';

cookies.token = 42;          // Set it
const res = cookies.token;   // Get it
delete cookies.token;        // Eat it
```

Cookies can be set to many different standard values, and they will retain the types. This is possible thanks to [the underlying library](https://github.com/franciscop/cookies.js):

```js
cookies.id = 1;
cookies.accepted = true;
cookies.name = 'Francisco';
cookies.friends = [3, 5];
cookies.user = { id: 1, accepted: true, name: 'Francisco' };
console.log(typeof cookies.id);               // 'number'
console.log(typeof cookies.accepted);         // 'boolean'
console.log(typeof cookies.name);             // 'string'
console.log(Array.isArray(cookies.friends));  // true
console.log(typeof cookies.user);             // 'object'
```

**Warning: manually setting values.** Values are encoded first with `JSON.stringify()` to allow for different types, and then with `encodeURIComponent()` to remain RFC 6265 compliant. See the details in [the underlying library](https://github.com/franciscop/cookies.js#advanced-options). If you are setting cookies manually, you'll have to follow the same process:

```js
import { cookies } from 'clean-store';
document.cookie = `name=${encodeURIComponent(JSON.stringify('Francisco'))}`
console.log(cookies.name);  // Francisco
```

You can iterate over the cookies in many different standard ways as normal:

```js
Object.keys(cookies);
Object.values(cookies);
Object.entries(cookies);
for (let key in cookies) {}
for (let val of cookies) {}
```



### LocalStorage

For the localStorage, we define `local` to simplify the interface:

```js
import { local } from 'clean-store';

local.token = 42;          // Set it
const res = local.token;   // Get it
delete local.token;        // Remove it
```
