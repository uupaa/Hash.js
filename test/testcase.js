var ModuleTestHash = (function(global) {

var _runOnNode = "process" in global;
var _runOnWorker = "WorkerLocation" in global;
var _runOnBrowser = "document" in global;

var U8A_HEX       = Hash.U8A_HEX;
var U8A_STR       = Hash.U8A_STR;
var STR_U8A       = Hash.STR_U8A;

var MD5           = Hash.MD5;
var MD5String     = Hash.MD5String;
var SHA1          = Hash.SHA1;
var SHA1String    = Hash.SHA1String;
var HMAC          = Hash.HMAC;
var HMACString    = Hash.HMACString;
var Adler32       = Hash.Adler32;
var Adler32String = Hash.Adler32String;
var XXHash        = Hash.XXHash;
var XXHashString  = Hash.XXHashString;

return new Test("Hash", {
        disable:    false,
        browser:    true,
        worker:     true,
        node:       true,
        button:     true,
        both:       true, // test the primary module and secondary module
    }).add([
        // --- MD5 ---
        testMD5_String,
        testMD5_Binary,

        // --- SHA1 ---
        testSHA1_String,
        testSHA1_Binary,

        // --- HMAC ---
        testHMAC_MD5_String,
        testHMAC_MD5_StringWithKey,
        testHMAC_MD5_Binary,

        testHMAC_SHA1_String,
        testHMAC_SHA1_StringWithKey,
        testHMAC_SHA1_Binary,

        testHMAC_MD5,
        testHMAC_SHA1,

        // --- Adler32 ---
        testAdler32,

        // --- XXHash ---
        testXXHash,

        // --- Huffman ---
        testHuffman,

    ]).run().clone();

// --- MD5 ---
function testMD5_String(test, pass, miss) {

    var source = "aaa";
    var answer = "47bce5c74f589f4867dbd57e9ca9f808";
    var md5HashString = MD5String(source);

    if (answer === md5HashString) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testMD5_Binary(test, pass, miss) {

    var source = "aaa";
    var answer = "47bce5c74f589f4867dbd57e9ca9f808";
    var md5HashArray = MD5(STR_U8A(source));
    var array = Array.prototype.slice.call(md5HashArray);

    var match = array.every(function(value, index) {
            var hex = parseInt(answer.slice(index * 2, index * 2 + 2), 16);

            return value === hex;
        });

    if (match) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

// --- SHA1 ---
function testSHA1_String(test, pass, miss) {

    var source = "aaa";
    var answer = "7e240de74fb1ed08fa08d38063f6a6a91462a815";
    var sha1HashString = SHA1String(source);

    if (answer === sha1HashString) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testSHA1_Binary(test, pass, miss) {

    var source = "aaa";
    var answer = "7e240de74fb1ed08fa08d38063f6a6a91462a815";
    var sha1HashArray = SHA1(STR_U8A(source));
    var array = Array.prototype.slice.call(sha1HashArray);

    var match = array.every(function(value, index) {
            var hex = parseInt(answer.slice(index * 2, index * 2 + 2), 16);

            return value === hex;
        });

    if (match) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

// --- HMAC ---
function testHMAC_MD5_String(test, pass, miss) {

    // this magic value from http://en.wikipedia.org/wiki/HMAC
    var answer = "74e6f7298a9c2d168935f58c001bad88";
    var HMAC_MD5 = HMACString("MD5", "", "");

    if (answer === HMAC_MD5) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testHMAC_MD5_StringWithKey(test, pass, miss) {

    // this magic value from http://en.wikipedia.org/wiki/HMAC
    var answer = "80070713463e7749b90c2dc24911e275";
    var HMAC_MD5 = HMACString("MD5", "key", "The quick brown fox jumps over the lazy dog");

    if (answer === HMAC_MD5) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testHMAC_SHA1_String(test, pass, miss) {

    // this magic value from http://en.wikipedia.org/wiki/HMAC
    var answer = "fbdb1d1b18aa6c08324b7d64b71fb76370690e1d";
    var HMAC_SHA1 = HMACString("SHA1", "", "");

    if (answer === HMAC_SHA1) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testHMAC_SHA1_StringWithKey(test, pass, miss) {

    // this magic value from http://en.wikipedia.org/wiki/HMAC
    var answer = "de7c9b85b8b78aa6bc8a7a36f70a90701c9db4d9";
    var HMAC_SHA1 = HMACString("SHA1", "key", "The quick brown fox jumps over the lazy dog");

    if (answer === HMAC_SHA1) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testHMAC_MD5_Binary(test, pass, miss) {

    // this magic value from http://en.wikipedia.org/wiki/HMAC
    var answer = "74e6f7298a9c2d168935f58c001bad88";
    var HMAC_MD5 = HMAC("MD5", new Uint8Array(0), new Uint8Array(0));

  //var match = HMAC_MD5.every(function(value, index) {
    var match = Array.prototype.every.call(HMAC_MD5, function(value, index) {
            var hex = parseInt(answer.slice(index * 2, index * 2 + 2), 16);

            return value === hex;
        });

    if (match) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testHMAC_SHA1_Binary(test, pass, miss) {

    // this magic value from http://en.wikipedia.org/wiki/HMAC
    var answer = "fbdb1d1b18aa6c08324b7d64b71fb76370690e1d";
    var HMAC_SHA1 = HMAC("SHA1", new Uint8Array(0), new Uint8Array(0));

  //var match = HMAC_SHA1.every(function(value, index) {
    var match = Array.prototype.every.call(HMAC_SHA1, function(value, index) {
            var hex = parseInt(answer.slice(index * 2, index * 2 + 2), 16);

            return value === hex;
        });

    if (match) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testHMAC_MD5(test, pass, miss) {

    // this magic value from http://en.wikipedia.org/wiki/HMAC
    var answer = "74e6f7298a9c2d168935f58c001bad88";
    var hash = HMACString("MD5", "", "");

    if (answer === hash) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testHMAC_SHA1(test, pass, miss) {

    // this magic value from http://en.wikipedia.org/wiki/HMAC
    var answer = "fbdb1d1b18aa6c08324b7d64b71fb76370690e1d";
    var hash = HMACString("SHA1", "", "");

    if (answer === hash) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

// --- Adler32 ---
function testAdler32(test, pass, miss) {

    var source1 = new Uint8Array(STR_U8A("The quick brown fox jumped over the lazy dogs.\n"));
    var source2 = new Uint8Array([ // "The quick brown fox jumped over the lazy dogs.\n"
            0x54, 0x68, 0x65, 0x20, 0x71, 0x75, 0x69, 0x63,
            0x6b, 0x20, 0x62, 0x72, 0x6f, 0x77, 0x6e, 0x20,
            0x66, 0x6f, 0x78, 0x20, 0x6a, 0x75, 0x6d, 0x70,
            0x65, 0x64, 0x20, 0x6f, 0x76, 0x65, 0x72, 0x20,
            0x74, 0x68, 0x65, 0x20, 0x6c, 0x61, 0x7a, 0x79,
            0x20, 0x64, 0x6f, 0x67, 0x73, 0x2e, 0x0a]);
    var source3 = new Uint8Array([ // wrongChecksumWithAdler32Test
            1, 0, 5, 0, 15, 0, 1, 11, 0, 1]);
    var source4 = new Uint8Array(STR_U8A("Hellp Adler32"));

    var result1 = Adler32(source1);
    var result2 = Adler32(source2);
    var result3 = Adler32(source3);
    var result4 = Adler32(source4);

    if (result1 === 0x9DE210DB &&
        result2 === 0x9DE210DB &&
        result3 === 0xBC0023   &&
        result4 === 0x1FFA0463) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

// --- XXHash ---
// see https://gist.github.com/uupaa/8609d8d2d4ee6876eac1
//
//    printf("%x\n", XXH32("",             0, 0));      //  2cc5d05
//    printf("%x\n", XXH32("a",            1, 0));      // 550d7456
//    printf("%x\n", XXH32("ab",           2, 0));      // 4999fc53
//    printf("%x\n", XXH32("abc",          3, 0));      // 32d153ff
//    printf("%x\n", XXH32("abcd",         4, 0));      // a3643705
//    printf("%x\n", XXH32("abcd",         4, 0xabcd)); // cda8fae4
//    printf("%x\n", XXH32("abcde",        5, 0));      // 9738f19b
//    printf("%x\n", XXH32("abcdef",       6, 0));      // 8b7cd587
//    printf("%x\n", XXH32("abcdefg",      7, 0));      // 9dd093b3
//    printf("%x\n", XXH32("abcdefgh",     8, 0));      //  bb3c6bb
//    printf("%x\n", XXH32("abcdefghi",    9, 0));      // d03c13fd
//    printf("%x\n", XXH32("abcdefghij",  10, 0));      // 8b988cfe
//    printf("%x\n", XXH32("abcdefghijk", 11, 0));      // 9db8a215
//    printf("%x\n", XXH32("abcdefghijk", 11, 123));    // 69659438
//    printf("%x\n", XXH32("0123456789abcdef", 16, 0)); // c2c45b69
//    printf("%x\n", XXH32("0123456789abcdef0",17, 0)); // aa9118bd
//    printf("%x\n", XXH32("0123456789abcdef"
//                         "0123456789abcdef", 32, 0)); // eb888d30
//    printf("%x\n", XXH32("0123456789abcdef"
//                         "0123456789abcdef0",33, 0)); // 5c28f38d
//    printf("%x\n", XXH32("0123456789abcdef"
//                         "0123456789abcdef"
//                         "0123456789abcdef"
//                         "0123456789abcdef", 64, 0)); // e717e5fb
//    printf("%x\n", XXH32("0123456789abcdef"
//                         "0123456789abcdef"
//                         "0123456789abcdef"
//                         "0123456789abcdef", 64, 64)); // 1198f54

function testXXHash(test, pass, miss) {

    var source = {
            length_0:  "",
            length_1:  "a",
            length_2:  "ab",
            length_3:  "abc",
            length_4:  "abcd",
            length_5:  "abcde",
            length_6:  "abcdef",
            length_7:  "abcdefg",
            length_8:  "abcdefgh",
            length_9:  "abcdefghi",
            length_10: "abcdefghij",
            length_11: "abcdefghijk",
            length_16: "0123456789abcdef",
            length_17: "0123456789abcdef0",
            length_32: "0123456789abcdef" +
                       "0123456789abcdef",
            length_33: "0123456789abcdef" +
                       "0123456789abcdef0",
            length_64: "0123456789abcdef" +
                       "0123456789abcdef" +
                       "0123456789abcdef" +
                       "0123456789abcdef",
            bigArray: createBigArray(1024 * 100)
        };

    var result = [
            XXHash(STR_U8A(source.length_0))         === 0x02cc5d05,
            XXHash(STR_U8A(source.length_1))         === 0x550d7456,
            XXHash(STR_U8A(source.length_2))         === 0x4999fc53,
            XXHash(STR_U8A(source.length_3))         === 0x32d153ff,
            XXHash(STR_U8A(source.length_4))         === 0xa3643705,
            XXHash(STR_U8A(source.length_4), 0xabcd) === 0xcda8fae4,
            XXHash(STR_U8A(source.length_5))         === 0x9738f19b,
            XXHash(STR_U8A(source.length_6))         === 0x8b7cd587,
            XXHash(STR_U8A(source.length_7))         === 0x9dd093b3,
            XXHash(STR_U8A(source.length_8))         === 0x0bb3c6bb,
            XXHash(STR_U8A(source.length_9))         === 0xd03c13fd,
            XXHash(STR_U8A(source.length_10))        === 0x8b988cfe,
            XXHash(STR_U8A(source.length_11))        === 0x9db8a215,
            XXHash(STR_U8A(source.length_11), 123)   === 0x69659438,
            XXHash(STR_U8A(source.length_16))        === 0xc2c45b69,
            XXHash(STR_U8A(source.length_17))        === 0xaa9118bd,
            XXHash(STR_U8A(source.length_32))        === 0xeb888d30,
            XXHash(STR_U8A(source.length_33))        === 0x5c28f38d,
            XXHash(STR_U8A(source.length_64))        === 0xe717e5fb,
            XXHash(STR_U8A(source.length_64), 64)    === 0x01198f54,
            XXHash(source.bigArray)                  === 0xc419ee19,
        ];

    if (!/false/.test(result.join(","))) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function createBigArray(length) {
    var result = new Uint8Array(length);

    for (var i = 0; i < length; ++i) {
        result[i] = i;
    }
    return result;
}

// --- Huffman ---
function testHuffman(test, pass, miss) {

    // TODO: test impl.
    test.done(pass());
}

})((this || 0).self || global);

