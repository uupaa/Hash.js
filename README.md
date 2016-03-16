# Hash.js [![Build Status](https://travis-ci.org/uupaa/Hash.js.svg)](https://travis-ci.org/uupaa/Hash.js)

[![npm](https://nodei.co/npm/uupaa.hash.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.hash.js/)

Hash functions.

This module made of [WebModule](https://github.com/uupaa/WebModule).

## Documentation
- [Spec](https://github.com/uupaa/Hash.js/wiki/)
- [API Spec](https://github.com/uupaa/Hash.js/wiki/Hash)

## Browser, NW.js and Electron

```js
<script src="<module-dir>/lib/WebModule.js"></script>
<script src="<module-dir>/lib/Hash.js"></script>
<script>

console.log( Hash.MD5("aaa", true)  ); // "47bce5c74f589f4867dbd57e9ca9f808"
console.log( Hash.SHA1("aaa", true) ); // "7e240de74fb1ed08fa08d38063f6a6a91462a815"
console.log( Hash.HMAC("MD5",  "key", "The quick brown fox jumps over the lazy dog", true) ); // "80070713463e7749b90c2dc24911e275"
console.log( Hash.HMAC("SHA1", "key", "The quick brown fox jumps over the lazy dog", true) ); // "de7c9b85b8b78aa6bc8a7a36f70a90701c9db4d9"
console.log( Hash.Adler32("The quick brown fox jumped over the lazy dogs.\n", true) ); // "9de210db"
console.log( Hash.XXHash("0123456789abcdef", true) ); // "c2c45b69"
console.log( Hash.Murmur("0123456789abcdef", true) ); // "36c7e0df"
console.log( Hash.CRC32("0123456789abcdef", true) );  // "68c4f033"

</script>
```

## WebWorkers

```js
importScripts("<module-dir>lib/WebModule.js");
importScripts("<module-dir>lib/Hash.js");

```

## Node.js

```js
require("<module-dir>lib/WebModule.js");
require("<module-dir>lib/Hash.js");

```

