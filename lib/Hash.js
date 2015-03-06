(function(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
//var _isNodeOrNodeWebKit = !!global.global;
//var _runOnNodeWebKit =  _isNodeOrNodeWebKit &&  /native/.test(setTimeout);
//var _runOnNode       =  _isNodeOrNodeWebKit && !/native/.test(setTimeout);
//var _runOnWorker     = !_isNodeOrNodeWebKit && "WorkerLocation" in global;
//var _runOnBrowser    = !_isNodeOrNodeWebKit && "document" in global;

var HEX = ["0", "1", "2", "3", "4", "5", "6", "7",
           "8", "9", "a", "b", "c", "d", "e", "f"];
//{@crc32
var CRC32_TABLE = new Uint32Array(256);
_createCRC32Table();
//}@crc32

// --- class / interfaces ----------------------------------
function Hash() {
}

//{@dev
Hash["repository"] = "https://github.com/uupaa/Hash.js"; // GitHub repository URL. http://git.io/Help
//}@dev

Hash["U8A_HEX"]         = U8A_HEX;      // Hash.U8A_HEX(source:Uint8Array):HexStringArray
Hash["U8A_STR"]         = U8A_STR;      // Hash.U8A_STR(source:Uint8Array):BinaryString
Hash["STR_U8A"]         = STR_U8A;      // Hash.STR_U8A(source:BinaryString):Uint8Array

//{@md5
Hash["MD5"]             = MD5;          // Hash.MD5(source:Uint8Array):Uint8Array
Hash["MD5String"]       = MD5String;    // Hash.MD5String(source:String):HexString
//}@md5
//{@sha1
Hash["SHA1"]            = SHA1;         // Hash.SHA1(source:Uint8Array):Uint8Array
Hash["SHA1String"]      = SHA1String;   // Hash.SHA1String(source:String):HexString
//}@sha1
//{@hmac
Hash["HMAC"]            = HMAC;         // Hash.HMAC(method:String, key:Uint8Array, message:Uint8Array):Uint8Array
Hash["HMACString"]      = HMACString;   // Hash.HMACString(method:String, key:String, message:String):String
//}@hamc
//{@adler32
Hash["Adler32"]         = Adler32;      // Hash.Adler32(source:Uint8Array, value:Integer = 1):UINT32
Hash["Adler32String"]   = Adler32String;// Hash.Adler32String(source:String, value:Integer = 1):HexString
//}@adler32
//{@xxhash
Hash["XXHash"]          = XXHash;       // Hash.XXHash(source:Uint8Array, seed:Integer = 0):UINT32
Hash["XXHashString"]    = XXHashString; // Hash.XXHashString(source:String, seed:Integer = 0):HexString
//}@xxhash
//{@murmur
Hash["Murmur"]          = Murmur;       // Hash.Murmur(source:Uint8Array, seed:Integer = 0):UINT32
Hash["MurmurString"]    = MurmurString; // Hash.MurmurString(source:String, seed:Integer = 0):HexString
//}@murmur
//{@crc32
Hash["CRC32"]           = CRC32;        // Hash.CRC32(source:Uint8Array, offset:UINT32 = 0, length:UINT32 = 0, crc:UINT32 = 0):UINT32
//}@crc32
//{@hexdump
Hash["HexDump"]         = HexDump;      // Hash.HexDump(source:Uint8Array|Uint8ArrayArray, options:Object = {}):void
//}@hexdump

// --- implements ------------------------------------------
function U8A_HEX(source) { // @arg Uint8Array - [0x00, 0x41, 0x53, 0x43, 0x49, 0x49, 0xff, ...]
                           // @ret HexStringArray - ["00", "41", "53", "43", "49", "49", "ff", ...]
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(source, "Uint8Array"), U8A_HEX, "source");
    }
//}@dev

    var result = [];
    for (var i = 0, iz = source.length; i < iz; ++i) {
        var v = source[i];
        result.push( HEX[v >> 4] + HEX[v & 0xf] );
    }
    return result;
}

function U8A_STR(source) { // @arg Uint8Array
                           // @ret BinaryString
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(source, "Uint8Array"), U8A_STR, "source");
    }
//}@dev
    var rv = [], i = 0, iz = source.length, bulkSize = 32000;

    // Avoid String.fromCharCode.apply(null, BigArray) exception
    if (iz < bulkSize) {
        return String.fromCharCode.apply(null, source);
    }
    for (; i < iz; i += bulkSize) {
        rv.push( String.fromCharCode.apply(null, source.subarray(i, i + bulkSize)) );
    }
    return rv.join("");
}

function STR_U8A(source) { // @arg BinaryString
                           // @ret Uint8Array
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(source, "BinaryString"), STR_U8A, "source");
    }
//}@dev
    var result = new Uint8Array(source.length);

    for (var i = 0, iz = source.length; i < iz; ++i) {
        result[i] = source.charCodeAt(i) & 0xff;
    }
    return result;
}

function _createBufferWith64BytePadding(source) {
    var iz     = source.length;
    var remain = (iz + 1) % 64;
    var times  = (iz + 1) >> 6;

    if (remain > 56) {
        ++times;
    }
    var buffer = new Uint8Array( (times + 1) << 6 );

    buffer.set(source);
    buffer[iz] = 0x80;
    return buffer;
}

// === MD5 =================================================
//{@md5
// pre-calculated value tables
var MD5_A = [
        0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf,
        0x4787c62a, 0xa8304613, 0xfd469501, 0x698098d8, 0x8b44f7af,
        0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e,
        0x49b40821, 0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
        0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8, 0x21e1cde6,
        0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8,
        0x676f02d9, 0x8d2a4c8a, 0xfffa3942, 0x8771f681, 0x6d9d6122,
        0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
        0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039,
        0xe6db99e5, 0x1fa27cf8, 0xc4ac5665, 0xf4292244, 0x432aff97,
        0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d,
        0x85845dd1, 0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
        0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391 ];
var MD5_S = [
        7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,
        5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,
        4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,
        6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21 ];
var MD5_X = [
        0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
        1,  6, 11,  0,  5, 10, 15,  4,  9, 14,  3,  8, 13,  2,  7, 12,
        5,  8, 11, 14,  1,  4,  7, 10, 13,  0,  3,  6,  9, 12, 15,  2,
        0,  7, 14,  5, 12,  3, 10,  1,  8, 15,  6, 13,  4, 11,  2,  9 ];

function MD5String(source) { // @arg String - source string
                             // @ret HexString
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(source, "String"), MD5String, "source");
    }
//}@dev

    return U8A_HEX( MD5( STR_U8A(source) ) ).join("");
}

function MD5(source) { // @arg Uint8Array
                       // @ret Uint8Array
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(source, "Uint8Array"), MD5, "source");
    }
//}@dev

    var buffer = _createBufferWith64BytePadding(source);
    var e = source.length * 8;

    buffer[buffer.length - 8] = e        & 0xff;
    buffer[buffer.length - 7] = e >>>  8 & 0xff;
    buffer[buffer.length - 6] = e >>> 16 & 0xff;
    buffer[buffer.length - 5] = e >>> 24 & 0xff;

    var hash   = _MD5(buffer); // [a, b, c, d]
    var result = new Uint8Array(16);

    for (var ri = 0, hi = 0; hi < 4; ri += 4, ++hi) {
        result[ri    ] = hash[hi]        & 0xff;
        result[ri + 1] = hash[hi] >>>  8 & 0xff;
        result[ri + 2] = hash[hi] >>> 16 & 0xff;
        result[ri + 3] = hash[hi] >>> 24 & 0xff;
    }
    return result;
}

function _MD5(source) { // @arg Uint8Array
                        // @ret Array - MD5 hash. [a, b, c, d]
    // setup default values
    var a = 0x67452301;
    var b = 0xefcdab89;
    var c = 0x98badcfe;
    var d = 0x10325476;

    // working and temporary
    var i = 0, iz = source.length, j = 0, k = 0, n = 0;
    var word = [];

    for (; i < iz; i += 64) {
        for (j = 0; j < 16; ++j) {
            k = i + j * 4;
            word[j] = source[k] + (source[k + 1] <<  8) +
                                  (source[k + 2] << 16) +
                                  (source[k + 3] << 24);
        }
        var aa = a;
        var bb = b;
        var cc = c;
        var dd = d;

        for (j = 0; j < 64; ++j) {
            n = j < 16 ? (b & c) | (~b & d) // ff - Round 1
              : j < 32 ? (b & d) | (c & ~d) // gg - Round 2
              : j < 48 ?  b ^ c ^ d         // hh - Round 3
                       :  c ^ (b | ~d);     // ii - Round 4
            n += a + word[MD5_X[j]] + MD5_A[j];

            var ra = b + ((n << MD5_S[j]) | (n >>> (32 - MD5_S[j])));
            var rb = b;
            var rc = c;
            // --- rotate ---
            a = d;
            b = ra;
            c = rb;
            d = rc;
        }
        a += aa;
        b += bb;
        c += cc;
        d += dd;
    }
    return [a, b, c, d];
}
//}@md5

// === SHA1 ================================================
//{@sha1
function SHA1String(source) { // @arg String - source string
                              // @ret HexString
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(source, "String"), SHA1String, "source");
    }
//}@dev

    return U8A_HEX( SHA1( STR_U8A(source) ) ).join("");
}

function SHA1(source) { // @arg Uint8Array
                        // @ret Uint8Array
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(source, "Uint8Array"), SHA1, "source");
    }
//}@dev

    var buffer = _createBufferWith64BytePadding(source);
    var e = source.length * 8;

    buffer[buffer.length - 1] = e        & 0xff;
    buffer[buffer.length - 2] = e >>>  8 & 0xff;
    buffer[buffer.length - 3] = e >>> 16 & 0xff;
    buffer[buffer.length - 4] = e >>> 24 & 0xff;

    var hash   = _SHA1(buffer); // [a, b, c, d, e]
    var result = new Uint8Array(20);

    for (var ri = 0, hi = 0; hi < 5; ri += 4, ++hi) {
        result[ri    ] = hash[hi] >>> 24 & 0xff;
        result[ri + 1] = hash[hi] >>> 16 & 0xff;
        result[ri + 2] = hash[hi] >>>  8 & 0xff;
        result[ri + 3] = hash[hi]        & 0xff;
    }
    return result;
}

function _SHA1(source) { // @arg Uint8Array
                         // @ret Array - SHA1. [a, b, c, d, e]
    // setup default values
    var a = 0x67452301;
    var b = 0xefcdab89;
    var c = 0x98badcfe;
    var d = 0x10325476;
    var e = 0xc3d2e1f0;

    // working and temporary
    var i = 0, iz = source.length, j = 0, jz = 0, n = 0;
    var word = [];

    for (; i < iz; i += 64) {
        var aa = a;
        var bb = b;
        var cc = c;
        var dd = d;
        var ee = e;

        for (j = i, jz = i + 64, n = 0; j < jz; j += 4, ++n) {
            word[n] = (source[j]     << 24) | (source[j + 1] << 16) |
                      (source[j + 2] <<  8) |  source[j + 3];
        }
        for (j = 16; j < 80; ++j) {
            n = word[j - 3] ^ word[j - 8] ^ word[j - 14] ^ word[j - 16];
            word[j] = (n << 1) | (n >>> 31);
        }
        for (j = 0; j < 80; ++j) {
            n = j < 20 ? ((b & c) ^ (~b & d))           + 0x5a827999
              : j < 40 ?  (b ^ c ^ d)                   + 0x6ed9eba1
              : j < 60 ? ((b & c) ^  (b & d) ^ (c & d)) + 0x8f1bbcdc
                       :  (b ^ c ^ d)                   + 0xca62c1d6;
            n += ((a << 5) | (a >>> 27)) + word[j] + e;

            e = d;
            d = c;
            c = (b << 30) | (b >>> 2);
            b = a;
            a = n;
        }
        a += aa;
        b += bb;
        c += cc;
        d += dd;
        e += ee;
    }
    return [a, b, c, d, e];
}
//}@sha1

// === HMAC ================================================
//{@hmac
function HMACString(method,    // @arg String - hash method. "SHA1", "MD5"
                    key,       // @arg String
                    message) { // @arg String
                               // @ret String - HMAC hash string.
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(method, "String"),  HMACString, "method");
        $valid(/SHA1|MD5/.test(method),  HMACString, "method");
        $valid($type(key, "String"),     HMACString, "key");
        $valid($type(message, "String"), HMACString, "message");
    }
//}@dev

    return U8A_HEX( HMAC( method, STR_U8A(key), STR_U8A(message) ) ).join("");
}

function HMAC(method,    // @arg String - hash method. "SHA1", "MD5"
              key,       // @arg Uint8Array
              message) { // @arg Uint8Array
                         // @ret Uint8Array
                         // @desc encode HMAC-SHA1, HMAC-MD5
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(method, "String"),      HMAC, "method");
        $valid(/SHA1|MD5/.test(method),      HMAC, "method");
        $valid($type(key, "Uint8Array"),     HMAC, "key");
        $valid($type(message, "Uint8Array"), HMAC, "message");
    }
//}@dev

    // see http://en.wikipedia.org/wiki/HMAC
    var blockSize = 64; // magic word(MD5.blockSize = 64, SHA1.blockSize = 64)

    if (key.length > blockSize) {
        key = Hash[method](key);
    }

    var padSize = Math.max(key.length, blockSize);
    var opad = new Uint8Array(padSize);
    var ipad = new Uint8Array(padSize);

    opad.set(key);
    ipad.set(key);

    for (var i = 0; i < blockSize; ++i) {
        opad[i] ^= 0x5C; // xor
        ipad[i] ^= 0x36; // xor
    }
    return Hash[method](
                U8A_add( opad, Hash[method](
                    U8A_add(ipad, message) ) ) );
}
//}@hmac

function U8A_add(source, add) {
    var result = new Uint8Array(source.length + add.length);

    result.set(source, 0);
    result.set(add, source.length);
    return result;
}

// === Adler32 =============================================
function Adler32String(source,  // @arg String
                       value) { // @arg Integer = 1 - initial value
                                // @ret HexString
                                // @desc http://en.wikipedia.org/wiki/Adler-32
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(source, "String"),       Adler32String, "source");
        $valid($type(value,  "Integer|omit"), Adler32String, "value");
    }
//}@dev

    var u32 = Adler32( STR_U8A(source), value );

    return U8A_HEX( new Uint8Array([u32 >>> 24, u32 >> 16, u32 >> 8, u32]) ).join("");
}

function Adler32(source,  // @arg Uint8Array
                 value) { // @arg Integer = 1 - initial value
                          // @ret UINT32
                          // @desc http://en.wikipedia.org/wiki/Adler-32
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(source, "Uint8Array"),   Adler32, "source");
        $valid($type(value,  "Integer|omit"), Adler32, "value");
    }
//}@dev

    value = value === undefined ? 1 : value;

    var MOD_ADLER    = 65521;
    var MAGIC_NUMBER = 5550;

    var a =  value         & 0xffff;
    var b = (value >>> 16) & 0xffff;

    var len = source.length;
    var i = 0;

    while (len > 0) {
        var tlen = len > MAGIC_NUMBER ? MAGIC_NUMBER : len;

        len -= tlen;

        do {
            a += source[i++];
            b += a;
        } while (--tlen);

        a %= MOD_ADLER;
        b %= MOD_ADLER;
    }
    return ((b << 16) | a) >>> 0;
}

// === XXHash ==============================================
function XXHashString(source, // @arg String
                      seed) { // @arg Integer = 0 - seed
                              // @ret HexString
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(source, "String"),       XXHashString, "source");
        $valid($type(seed,   "Integer|omit"), XXHashString, "seed");
    }
//}@dev

    var u32 = XXHash( STR_U8A(source), seed );
    return U8A_HEX( new Uint8Array([u32 >>> 24, u32 >> 16, u32 >> 8, u32]) ).join("");
}

function XXHash(source, // @arg Uint8Array
                seed) { // @arg Integer = 0 - seed
                        // @ret Uint32
                        // @desc XXHash 32 bit hash string.
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(source, "Uint8Array"),   XXHash, "source");
        $valid($type(seed,   "Integer|omit"), XXHash, "seed");
    }
//}@dev

    return _createXXHash(source, source.length, seed || 0);
}

function _createXXHash(input,  // @arg Uint8Array
                       len,    // @arg Integer - input length
                       seed) { // @arg Uint32
                               // @ret Uint32 - xxHash result
                               // @desc XXHash 32 bit hash.
    // https://gist.github.com/uupaa/8609d8d2d4ee6876eac1

    var Math_imul = Math["imul"] || es6_polyfill_math_imul;

    var PRIME32_1 = 2654435761;
    var PRIME32_2 = 2246822519;
    var PRIME32_3 = 3266489917;
    var PRIME32_4 =  668265263;
    var PRIME32_5 =  374761393;

    var p = 0;
    var bEnd = p + len;
    var v = new Uint32Array(5); // v[0] aka h32

    // bulk loop (unit: 16bytes)
    if (len >= 16) {
        var limit = bEnd - 16;

        v[1] = seed + PRIME32_1 + PRIME32_2; // aka v1
        v[2] = seed + PRIME32_2;             // aka v2
        v[3] = seed + 0;                     // aka v3
        v[4] = seed - PRIME32_1;             // aka v4

        do {
            v[1] += Math_imul(XXH_get32bits(input, p), PRIME32_2);
            v[1]  = XXH_rotl32(v[1], 13);
            v[1]  = Math_imul(v[1], PRIME32_1);
            p += 4;

            v[2] += Math_imul(XXH_get32bits(input, p), PRIME32_2);
            v[2]  = XXH_rotl32(v[2], 13);
            v[2]  = Math_imul(v[2], PRIME32_1);
            p += 4;

            v[3] += Math_imul(XXH_get32bits(input, p), PRIME32_2);
            v[3]  = XXH_rotl32(v[3], 13);
            v[3]  = Math_imul(v[3], PRIME32_1);
            p += 4;

            v[4] += Math_imul(XXH_get32bits(input, p), PRIME32_2);
            v[4]  = XXH_rotl32(v[4], 13);
            v[4]  = Math_imul(v[4], PRIME32_1);
            p += 4;
        }
        while (p <= limit);

        v[0] = XXH_rotl32(v[1], 1)  + XXH_rotl32(v[2], 7) +
               XXH_rotl32(v[3], 12) + XXH_rotl32(v[4], 18);
    } else {
        v[0] = seed + PRIME32_5;
    }

    v[0] += len;

    // bulk loop (unit: 4bytes)
    while (p + 4 <= bEnd) {
        v[0] += Math_imul(XXH_get32bits(input, p), PRIME32_3);
        v[0]  = Math_imul(XXH_rotl32(v[0], 17), PRIME32_4);
        p += 4;
    }

    // remain loop (unit: 1byte)
    while (p < bEnd) {
        v[0] += Math_imul(input[p], PRIME32_5);
        v[0]  = Math_imul(XXH_rotl32(v[0], 11), PRIME32_1);
        p++;
    }

    v[0] ^= v[0] >>> 15;
    v[0]  = Math_imul(v[0], PRIME32_2);
    v[0] ^= v[0] >>> 13;
    v[0]  = Math_imul(v[0], PRIME32_3);
    v[0] ^= v[0] >>> 16;

    return v[0];
}

function XXH_get32bits(source, // @arg Uint8Array
                       p) {    // @arg Integer - pointer(source index)
    return (source[p + 3] << 24) | (source[p + 2] << 16) |
           (source[p + 1] <<  8) |  source[p];
}

function XXH_rotl32(x,   // @arg Uint32  - value
                    r) { // @arg Uint8   - bit shift value (0 - 31)
                         // @ret Integer
    return (x << r) | (x >>> (32 - r));
}
//}@xxhash

//{@es6_polyfill
function es6_polyfill_math_imul(a,   // @arg Uint32|Uint64 - value a
                                b) { // @arg Uint32|Uint64 - value b
                                     // @ret Uint32 - the C-like 32-bit multiplication of the two parameters.
    var a_high = (a >>> 16) & 0xffff;
    var a_low  =  a         & 0xffff;
    var b_high = (b >>> 16) & 0xffff;
    var b_low  =  b         & 0xffff;

    return ((a_low * b_low) + (((a_high * b_low + a_low * b_high) << 16) >>> 0)|0);
}
//}@es6_polyfill

// === Murmur ==============================================
function MurmurString(source, // @arg String
                      seed) { // @arg Integer = 0 - seed
                              // @ret HexString
                              // @desc create Murmur 32bit hash string.
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(source, "String"),       MurmurString, "source");
        $valid($type(seed,   "Integer|omit"), MurmurString, "seed");
    }
//}@dev

    var u32 = Murmur( STR_U8A(source), seed );
    return U8A_HEX( new Uint8Array([u32 >>> 24, u32 >> 16, u32 >> 8, u32]) ).join("");
}

function Murmur(source, // @arg Uint8Array
                seed) { // @arg Integer = 0 - seed
                        // @ret Uint32
                        // @desc create Murmur 32bit hash.
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(source, "Uint8Array"),   Murmur, "source");
        $valid($type(seed,   "Integer|omit"), Murmur, "seed");
    }
//}@dev

    return _createMurmur32(source, seed || 0);
}

function _createMurmur32(source, // @arg Uint8Array
                         seed) { // @arg Integer
                                 // @ret Uint32Number
    // http://en.wikipedia.org/wiki/MurmurHash
    // https://gist.github.com/uupaa/8609d8d2d4ee6876eac1
    var Math_imul = Math["imul"] || es6_polyfill_math_imul;
    var u32 = new Uint32Array([seed, 0, 0]); // [hash, k, k1]
    var remain = source.length;
    var cursor = 0; // source cursor

    while (remain >= 4) {
        u32[1] = source[cursor]            | (source[cursor + 1] <<  8) |
                (source[cursor + 2] << 16) | (source[cursor + 3] << 24);

        u32[1] = Math_imul(u32[1], 0xcc9e2d51);                 // k *= c1;
        u32[1] = (u32[1] << 15) | (u32[1] >>> (32 - 15));       // k = (k << r1) | (k >> (32 - r1));
        u32[1] = Math_imul(u32[1], 0x1b873593);                 // k *= c2;

        u32[0] ^= u32[1];                                       // hash ^= k;
        u32[0] = (u32[0] << 13) | (u32[0] >>> (32 - 13));       // hash = ((hash << r2) | (hash >> (32 - r2)));
        u32[0] = Math_imul(u32[0], 5) + 0xe6546b64;             // hash = hash * m + n;

        cursor += 4;
        remain -= 4;
    }

    switch (remain) {
    case 3: u32[2] ^= source[cursor + 2] << 16;                 // k1 ^= source[i + 2] << 16;
    /* falls through */
    case 2: u32[2] ^= source[cursor + 1] << 8;                  // k1 ^= source[i + 1] << 8;
    /* falls through */
    case 1: u32[2] ^= source[cursor];                           // k1 ^= source[i];

            u32[2] = Math_imul(u32[2], 0xcc9e2d51);             // k1 *= c1;
            u32[2] = (u32[2] << 15) | (u32[2] >>> (32 - 15));   // k1 = (k1 << r1) | (k1 >> (32 - r1));
            u32[2] = Math_imul(u32[2], 0x1b873593);             // k1 *= c2;
            u32[0] ^= u32[2];                                   // hash ^= k1;
    }

    u32[0] ^= source.length;                                    // hash ^= len;
    u32[0] ^= (u32[0] >>> 16);                                  // hash ^= (hash >> 16);
    u32[0]  = Math_imul(u32[0], 0x85ebca6b);                    // hash *= 0x85ebca6b;
    u32[0] ^= (u32[0] >>> 13);                                  // hash ^= (hash >> 13);
    u32[0]  = Math_imul(u32[0], 0xc2b2ae35);                    // hash *= 0xc2b2ae35;
    u32[0] ^= (u32[0] >>> 16);                                  // hash ^= (hash >> 16);

    return u32[0];
}

// === CRC32 ===============================================
//{@crc32
function _createCRC32Table() {
    var c = new Uint32Array(1);
    for (var i = 0; i < 256; ++i) {
        c[0] = i;

        for (var j = 0; j < 8; ++j) {
            c[0] = (c[0] & 1) ? (0xedb88320 ^ (c[0] >>> 1)) : (c[0] >>> 1);
        }
        CRC32_TABLE[i] = c[0];
    }
}
function CRC32(source, // @arg Uint8Array
               offset, // @arg UINT32 = 0
               length, // @arg UINT32 = source.length
               crc) {  // @arg UINT32 = 0 - initial value
                       // @ret UINT32
    var c  = new Uint32Array([crc || 0]);
    var i  = offset || 0;
    var l  = length || source.length - i;
    var iz = i + l;

    c[0] ^= 0xffffffff;

    for (; i < iz; ++i) {
        c[0] = (c[0] >>> 8) ^ CRC32_TABLE[(c[0] ^ source[i]) & 0xff];
    }
    return (c[0] ^ 0xffffffff) >>> 0;
}
//}@crc32

// === Utility =============================================
//{@hexdump
function HexDump(source,    // @arg Uint8Array|Uint8ArrayArray
                 options) { // @arg Object = {} - { width, joint, upper, noprefix }
                            // @options.width Integer = 8
                            // @options.joint String = ","
                            // @options.upper Boolean = false - toUpperCase
                            // @options.noprefix Boolean = false
    options = options || {};

    var src = Array.isArray(source) ? source : [source];
    var width  = options["width"]  || 8;
    var joint  = options["joint"] === undefined ? "," : options["joint"];
    var upper  = options["upper"]  || false;
    var prefix = options["noprefix"] ? "" : "0x";
    var line = [];

    for (var i = 0, iz = src.length; i < iz; ++i) {
        for (var j = 0, jz = src[i].length; j < jz; ++j) {
            if (src[i][j] < 16) {
                line.push(prefix + "0" + src[i][j].toString(16));
            } else {
                line.push(prefix + src[i][j].toString(16));
            }
            if (line.length >= width) {
                console.log(upper ? line.join(joint).toUpperCase()
                                  : line.join(joint));
                line = [];
            }
        }
    }
    if (line.length) {
        console.log(upper ? line.join(joint).toUpperCase()
                          : line.join(joint));
    }
}
//}@hexdump

// --- validate / assertions -------------------------------
//{@dev
function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
//function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
//function $some(val, str, ignore) { return global["Valid"] ? global["Valid"].some(val, str, ignore) : true; }
//function $args(fn, args) { if (global["Valid"]) { global["Valid"].args(fn, args); } }
//}@dev

// --- exports ---------------------------------------------
if (typeof module !== "undefined") {
    module["exports"] = Hash;
}
global["Hash" in global ? "Hash_" : "Hash"] = Hash; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule

