# Clean Store [![npm install clean-store](https://img.shields.io/badge/npm%20install-clean--store-blue.svg)](https://www.npmjs.com/package/clean-store) [![gzip size](https://img.badgesize.io/franciscop/clean-store/master/store.min.js.svg?compression=gzip)](https://github.com/franciscop/clean-store/blob/master/store.min.js) [![dependencies](https://img.shields.io/badge/dependencies-0-green.svg)](https://github.com/franciscop/clean-store/blob/master/package.json)

A clean interface for browser storage technologies in 1.5kb:

```js
import { cookies, local } from 'clean-store';

cookies.token = 42;      // Set it
const t = cookies.token; // Get it
delete cookies.token;    // Eat it

local.token = 42;        // Set it
const t = local.token;   // Get it
delete local.token;      // Del it
```

Subscribe to changes in any of the objects:

```js
import { local, subscribe } from 'clean-store';

subscribe(local, 'token', value => {
  console.log(value);   // 42, 'Hello', undefined
});

local.token = 42;
local.token = 'Hello';
delete local.token;
```

You can also [iterate them as expected](https://github.com/franciscop/clean-store/blob/master/src/cookies.test.js) with `Object.keys()`, `Object.values()`, etc:

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

```html
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

You can change the [cookies **options**](https://github.com/franciscop/cookies.js#options) globally:

```js
import { cookies, options } from 'clean-store';

// Options with its defaults. Note that expires is set to 100 days
cookies[options] = {
  expires: 100 * 24 * 3600,     // The time to expire in seconds
  domain: false,                // The domain for the cookie
  path: '/',                    // The path for the cookie
  secure: https ? true : false  // Require the use of https
};

cookies.token = 24;  // Will be stored for ~100 days
```

> **WARNING**: you should import `options` and then use it as a variable like `cookies[options]`. You CANNOT do ~~`cookies.options`~~ nor ~~`cookies['options']`~~.

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

localStorage items can be set to many different standard values, and they will retain the types:

```js
local.id = 1;
local.accepted = true;
local.name = 'Francisco';
local.friends = [3, 5];
local.user = { id: 1, accepted: true, name: 'Francisco' };
console.log(typeof local.id);               // 'number'
console.log(typeof local.accepted);         // 'boolean'
console.log(typeof local.name);             // 'string'
console.log(Array.isArray(local.friends));  // true
console.log(typeof local.user);             // 'object'
```

**Warning: manually setting values.** Values are encoded first with `JSON.stringify()` to allow for different types. If you are mixing localStorage with `clean-store`, you'll have to follow the same process:

```js
import { local } from 'clean-store';
localStorage.setItem('name', JSON.stringify('Francisco'));
console.log(local.name);  // Francisco
console.log(JSON.parse(localStorage.getItem('name'))); // Francisco
```

Of course we recommend to stick to the library as much as possible for a cleaner interface:

```js
import { local } from 'clean-store';
local.name = 'Francisco';
console.log(local.name);  // Francisco
```

You can iterate over the items in many different standard ways as normal:

```js
Object.keys(local);
Object.values(local);
Object.entries(local);
for (let key in local) {}
for (let val of local) {}
```



### Subscribe

Subscribe allows you to listen to changes to *any* object, including yours. It is **asynchronous** and the callback order is not guaranteed.

```js
import { local, subscribe } from 'clean-store';

subscribe(local, 'token', value => {
  console.log(value);   // 42, 'Hello', undefined
});

local.token = 42;
local.token = 'Hello';
delete local.token;
```

Changes work even if you use the native API to change the values, or even if the changes happen on another tab:

```js
import { local, subscribe } from 'clean-store';

subscribe(local, 'token', value => {
  console.log(value);   // 42, 'Hello', undefined
});

// Note that this is the native one:
localStorage.setItem('token', JSON.stringify(42));
```

To unsubscribe, store the value returned by `subscribe()` and then use it with `unsubscribe()`:

```js
import { cookies, subscribe, unsubscribe } from 'clean-store';

const id = subscribe(cookies, 'token', token => {
  console.log(token);
});

unsubscribe(id);
```

You can also unsubscribe by the callback, which is very useful in a React context:

```js
import { cookies, subscribe, unsubscribe } from 'clean-store';

const cb = token => console.log('NEW TOKEN:', token);
subscribe(cookies, 'token', cb);
unsubscribe(cb);
```

For instance, if you want to keep the user points synced across tabs with localStorage:

```js
import { local, subscribe, unsubscribe } from 'clean-store';

export default class extends React.Component {
  constructor (props) {
    super(props);
    this.state = { points: local.points };
    this.updatePoints = this.updatePoints.bind(this);
    subscribe(local, 'points', this.updatePoints);
  }
  updatePoints (points) {
    this.setState({ points });
  }
  componentWillUnmount () {
    unsubscribe(this.updatePoints);
  }
  render () {
    return <div>Points: {this.state.points}</div>;
  }
}
```

> Note: `subscribe()` implementation is very basic right now using `setInterval()` internally. If you are going to use hundreds of `subscribe()` or need more realtime data this might not be well suited.
