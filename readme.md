# Clean Store ![gzip size](https://img.badgesize.io/franciscop/clean-store/master/store.min.js.svg?compression=gzip)

A cleaner interface for browser storage technologies in 1kb:

```js
import { cookies, local } from 'clean-store'

cookies.token = 42;       // Set it
const t = cookies.token;  // Get it
delete cookies.token;     // Eat it

local.token = 42;         // Set it
const t = local.token;    // Get it
delete local.token;       // Forget it
```

You can also iterate them as expected with `Object.keys()`, `Object.values()`, `for(... in ...)` and `for (... of ...)`:

```js
cookies.token = 42;
cookies.name = 'Francisco';

console.log(Object.keys(cookies)); // token, name

for (let key in cookies) {
  console.log(key, cookies[key]); // token, 42; name, 'Francisco'
}

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
```

But then don't forget to extract them:

```js
const { cookies, local, ... } = store;
```



## Documentation

The above should be enough for most cases, but here are some extra details.

### Cookies

It uses the [library `cookiesjs`](https://github.com/franciscop/cookies.js) underneath and wraps it through a simple getter/setter interface:

```js
import { cookies } from 'clean-store';

cookies.token = 42;          // Set it
const res = cookies.token;   // Get it
delete cookies.token;        // Eat it
```

**Manually setting values**: values are encoded first with `JSON.stringify()` to allow for different types, and then with `encodeURIComponent()` to remain RFC 6265 compliant. This is implemented in [the underlying library](https://github.com/franciscop/cookies.js#advanced-options). If you are setting cookies manually, you'll have to follow the same process:

```js
import { cookies } from 'clean-store';
document.cookie = `name=${encodeURIComponent(JSON.stringify('Francisco'))}`

console.log(cookies.name);  // Francisco
```


### LocalStorage

For the localStorage, we define `local` to simplify the interface:

```js
import { local } from 'clean-store';

local.token = 42;          // Set it
const res = local.token;   // Get it
delete local.token;        // Lose it
```




## TODO

This is the documentation for the target result. Please feel free to collaborate:

## Subscribe()

It also can listen to change events on the browser stores:

```js
import { local, subscribe } from 'clean-store';

subscribe(local, 'token', value => {
  console.log(value);   // 42, 'Hello', undefined
});

local.token = 42;
local.token = 'Hello';
delete local.token;
```



## Options

With the objective of keeping the library lean, there are no options possible for each cookie. But you can set the cookie options globally:

```js
import { cookies, options } from 'clean-store';

cookies[options] = {
  expires: 100 * 24 * 3600,     // The time to expire in seconds
  domain: false,                // The domain for the cookie
  path: '/',                    // The path for the cookie
  secure: https ? true : false  // Require the use of https
};

cookies.token = 24;  // Will be stored for ~100 days
```

See [**all of the options** here](https://github.com/franciscop/cookies.js#options).
