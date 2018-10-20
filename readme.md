# Brownies [![npm install brownies](https://img.shields.io/badge/npm%20install-brownies-blue.svg)](https://www.npmjs.com/package/brownies) [![gzip size](https://img.badgesize.io/franciscop/brownies/master/brownies.min.js.svg?compression=gzip)](https://github.com/franciscop/brownies/blob/master/brownies.min.js) [![dependencies](https://img.shields.io/badge/dependencies-0-limegreen.svg)](https://github.com/franciscop/brownies/blob/master/package.json) [![support](https://img.shields.io/badge/es-6-limegreen.svg)](https://caniuse.com/#feat=proxy) [![playground](https://img.shields.io/badge/play-jsfiddle-blue.svg)](https://jsfiddle.net/oc5ju3ge/)

Tastier cookies and local/session storage in 1.7kb:

```js
import { cookies, local } from 'brownies';

cookies.token = 42;      // Set it
const t = cookies.token; // Get it
delete cookies.token;    // Eat it

local.token = 42;        // Set it
const t = local.token;   // Get it
delete local.token;      // Del it
```

Subscribe to changes in any of the objects:

```js
import { session, subscribe } from 'brownies';

subscribe(session, 'token', value => {
  console.log(value);   // 42, 'Hello', null
});

session.token = 42;
session.token = 'Hello';
delete session.token;
```

You can also [iterate them as expected](https://github.com/franciscop/brownies/blob/master/src/cookies.test.js) with `Object.keys()`, `Object.values()`, etc:

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
npm install brownies
```

Then import the different parts:

```js
import { cookies, local, ... } from 'brownies';
const { cookies, local, ... } = require('brownies');
```

Or use a CDN for the browser:

```html
<script src="https://cdn.jsdelivr.net/npm/brownies"></script>
<script>
  // Extract it since we only define `brownies` globally
  const { cookies, local, ... } = brownies;
</script>
```

If you just want to play, go to the [**JSFiddle playground**](https://jsfiddle.net/oc5ju3ge/).



## Cookies

Manipulate cookies with the simple getter/setter interface:

```js
import { cookies } from 'brownies';

cookies.token = 42;          // Set it
const res = cookies.token;   // Get it
delete cookies.token;        // Eat it
```

Cookies will retain the types that is set. This is possible thanks to [the underlying library](https://github.com/franciscop/cookies.js):

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

<details>
<summary><strong>Warning: Manually setting cookies</strong> with <code>document.cookie</code> or server-side [click for details]</summary>

Values are encoded first with `JSON.stringify()` to allow for different types, and then with `encodeURIComponent()` to remain RFC 6265 compliant. See the details in [the underlying library](https://github.com/franciscop/cookies.js#advanced-options). If you are setting cookies manually, you'll have to follow the same process:

```js
import { cookies } from 'brownies';
document.cookie = `name=${encodeURIComponent(JSON.stringify('Francisco'))}`
console.log(cookies.name);  // Francisco
```

</details>

To delete a item, you have to call `delete` on it as you would normally do with object properties:

```js
console.log(cookies.id);  // null
cookies.id = 1;
console.log(cookies.id);  // 1
delete cookies.id;
console.log(cookies.id);  // null
```

> Note: the default value for deleted cookies is set to `null` to be consistent with other local storage technologies.

You can iterate over the cookies in many different standard ways as normal:

```js
Object.keys(cookies);
Object.values(cookies);
Object.entries(cookies);
for (let key in cookies) {}
for (let val of cookies) {}
```


### Options

You can change the [cookies **options**](https://github.com/franciscop/cookies.js#options) globally:

```js
import { cookies, options } from 'brownies';

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




## LocalStorage

For `localStorage`, we define `local` to simplify the interface:

```js
import { local } from 'brownies';

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

<details>
<summary><strong>Warning: Manually setting values</strong> with <code>localStorage</code> [click for details]</summary>

The values are encoded by `brownies` with `JSON.stringify()` to maintain the types. If you are want to manually set a value with `localStorage.setItem()` that you will later read with `brownies`, you'll have to stringify it first:

```js
localStorage.setItem('name', JSON.stringify('Francisco'));
console.log(local.name);  // Francisco
```

Same the other way around, if you want to read a value set by `brownies` with plain Javascript, you'll have to parse it first:

```js
local.name = 'Francisco';
console.log(JSON.parse(localStorage.getItem('name'))); // Francisco
```

Of course we recommend to stick to the library as much as possible for a cleaner interface:

```js
import { local } from 'brownies';
local.name = 'Francisco';
console.log(local.name);  // Francisco
```

</details>

To delete a item, you have to call `delete` on it as you would normally do with object properties:

```js
console.log(local.id);  // null
local.id = 1;
console.log(local.id);  // 1
delete local.id;
console.log(local.id);  // null
```

You can iterate over the items in many different standard ways as normal:

```js
Object.keys(local);
Object.values(local);
Object.entries(local);
for (let key in local) {}
for (let val of local) {}
```

So if you wanted to delete them all, you can do so by looping them easily:

```js
for (let key in local) {
  console.log('Deleting:', key, local[key]);
  delete local[key];
}
```



## SessionStorage

For the `sessionStorage`, we define `session` to simplify the interface:

```js
import { session } from 'brownies';

session.token = 42;          // Set it
const res = session.token;   // Get it
delete session.token;        // Remove it
```

sessionStorage items can be set to many different standard values, and they will retain the types:

```js
session.id = 1;
session.accepted = true;
session.name = 'Francisco';
session.friends = [3, 5];
session.user = { id: 1, accepted: true, name: 'Francisco' };
console.log(typeof session.id);               // 'number'
console.log(typeof session.accepted);         // 'boolean'
console.log(typeof session.name);             // 'string'
console.log(Array.isArray(session.friends));  // true
console.log(typeof session.user);             // 'object'
```

<details>
<summary><strong>Warning: Manually setting values</strong> with <code>sessionStorage</code> [click for details]</summary>

The values are encoded by `brownies` with `JSON.stringify()` to maintain the types. If you are want to manually set a value with `sessionStorage.setItem()` that you will later read with `brownies`, you'll have to stringify it first:

```js
sessionStorage.setItem('name', JSON.stringify('Francisco'));
console.log(session.name);  // Francisco
```

Same the other way around, if you want to read a value set by `brownies` with plain Javascript, you'll have to parse it first:

```js
session.name = 'Francisco';
console.log(JSON.parse(sessionStorage.getItem('name'))); // Francisco
```

Of course we recommend to stick to the library as much as possible for a cleaner interface:

```js
import { session } from 'brownies';
session.name = 'Francisco';
console.log(session.name);  // Francisco
```

</details>

To delete a item, you have to call `delete` on it as you would normally do with object properties:

```js
console.log(session.id);  // null
session.id = 1;
console.log(session.id);  // 1
delete session.id;
console.log(session.id);  // null
```

You can iterate over the items in many different standard ways as normal:

```js
Object.keys(session);
Object.values(session);
Object.entries(session);
for (let key in session) {}
for (let val of session) {}
```

So if you wanted to delete them all, you can do so by looping them easily:

```js
for (let key in session) {
  console.log('Deleting:', key, session[key]);
  delete session[key];
}
```



## Subscribe

Subscribe allows you to listen to changes to *any* object, including yours:

```js
import { local, subscribe } from 'brownies';

subscribe(local, 'token', value => {
  console.log(value);   // 42, null, 'Hello'
});

local.token = 42;
delete local.token;
local.token = 'Hello';
```

**Warning**: `subscribe()` cannot assure that it is synchronous nor that the order is maintained, so the above might not trigger if the end value is the same as the initial value or middle steps might not be shown.

Changes work even if you use the native API to change the values, or even if the changes happen on another tab:

```js
import { local, subscribe } from 'brownies';

subscribe(local, 'token', value => {
  console.log(value);   // 42, 'Hello', null
});

// Note that this is the native one:
localStorage.setItem('token', JSON.stringify(42));
```

To unsubscribe, store the value returned by `subscribe()` and then use it with `unsubscribe()`:

```js
import { cookies, subscribe, unsubscribe } from 'brownies';

const id = subscribe(cookies, 'token', token => {
  console.log(token);
});

unsubscribe(id);
```

You can also unsubscribe by the callback, which is very useful in a React context:

```js
import { cookies, subscribe, unsubscribe } from 'brownies';

const cb = token => console.log('NEW TOKEN:', token);
subscribe(cookies, 'token', cb);
unsubscribe(cb);
```

For instance, if you want to keep the user points synced across tabs with localStorage:

```js
import { local, subscribe, unsubscribe } from 'brownies';

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



### Trivia

My former coworker made delicious brownies when leaving the company and asked me to name a library brownies. I thought it was a fantastic idea, since brownies are tastier cookies after all 🙂.

Brownies are [technically](https://wow-cookies.com/brownies-are-they-cookies-or-cake/) [cookies](https://www.quora.com/Are-brownies-classified-as-a-cake-or-a-cookie) because they are finger food.

This library was previously named `clean-store`, but I never really liked that name.
