# Hash.js [![Build Status](https://travis-ci.org/uupaa/Hash.js.png)](http://travis-ci.org/uupaa/Hash.js)

[![npm](https://nodei.co/npm/uupaa.hash.js.png?downloads=true&stars=true)](https://nodei.co/npm/uupaa.hash.js/)

Hash functions.

## Document

- [Hash.js wiki](https://github.com/uupaa/Hash.js/wiki/Hash)
- [WebModule](https://github.com/uupaa/WebModule)
    - [Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html)
    - [Development](https://github.com/uupaa/WebModule/wiki/Development)

## How to use

### Browser

```js
<script src="lib/Hash.js"></script>
<script>

console.log( Hash.MD5String("aaa")  ); // "47bce5c74f589f4867dbd57e9ca9f808"
console.log( Hash.SHA1String("aaa") ); // "7e240de74fb1ed08fa08d38063f6a6a91462a815"
console.log( Hash.HMACString("MD5",  "key", "The quick brown fox jumps over the lazy dog") ); // "80070713463e7749b90c2dc24911e275"
console.log( Hash.HMACString("SHA1", "key", "The quick brown fox jumps over the lazy dog") ); // "de7c9b85b8b78aa6bc8a7a36f70a90701c9db4d9"
console.log( Hash.Adler32String("The quick brown fox jumped over the lazy dogs.\n") ); // "9de210db"
console.log( Hash.XXHashString("0123456789abcdef") ); // "c2c45b69"
console.log( Hash.MurmurString("0123456789abcdef") ); // "36c7e0df"

</script>
```

### WebWorkers

```js
importScripts("lib/Hash.js");

...
```

### Node.js

```js
require("lib/Hash.js");

...
```

### NodeWebKit

```js
<script src="lib/Hash.js"></script>

...
```
