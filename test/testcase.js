var ModuleTestHash = (function(global) {

var _isNodeOrNodeWebKit = !!global.global;
var _runOnNodeWebKit =  _isNodeOrNodeWebKit &&  /native/.test(setTimeout);
var _runOnNode       =  _isNodeOrNodeWebKit && !/native/.test(setTimeout);
var _runOnWorker     = !_isNodeOrNodeWebKit && "WorkerLocation" in global;
var _runOnBrowser    = !_isNodeOrNodeWebKit && "document" in global;

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
var Murmur        = Hash.Murmur;
var MurmurString  = Hash.MurmurString;
var CRC32         = Hash.CRC32;
var HexDump       = Hash.HexDump;

var test = new Test("Hash", {
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     true,  // enable worker test.
        node:       true,  // enable node test.
        nw:         true,  // enable nw.js test.
        button:     true,  // show button.
        both:       true,  // test the primary and secondary modules.
        ignoreError:false, // ignore error.
    });

    if (Hash.MD5) {
        test.add([
            testMD5_String,
            testMD5_Binary,
        ]);
    }
    if (Hash.SHA1) {
        test.add([
            testSHA1_String,
            testSHA1_Binary,
        ]);
    }
    if (Hash.HMAC) {
        if (Hash.MD5) {
            test.add([
                testHMAC_MD5_String,
                testHMAC_MD5_StringWithKey,
                testHMAC_MD5_Binary,
                testHMAC_MD5,
            ]);
        }
        if (Hash.SHA1) {
            test.add([
                testHMAC_SHA1_String,
                testHMAC_SHA1_StringWithKey,
                testHMAC_SHA1_Binary,
                testHMAC_SHA1,
            ]);
        }
    }
    if (Hash.Adler32) {
        test.add([
            testAdler32,
        ]);
    }
    if (Hash.XXHash) {
        test.add([
            testXXHash,
        ]);
    }
    if (Hash.Murmur) {
        test.add([
            testMurmur,
        ]);
    }
    if (Hash.CRC32) {
        test.add([
            testCRC32,
        ]);
    }
    // --- bench mark ---
    if (Hash.XXHash && Hash.Murmur) {
        test.add([
            testBenchMark,
        ]);
    }

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

// --- Murmur ---
function testMurmur(test, pass, miss) {
// see https://gist.github.com/uupaa/8609d8d2d4ee6876eac1

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
            Murmur(STR_U8A(source.length_0))         === 0x00000000,
            Murmur(STR_U8A(source.length_1))         === 0x3c2569b2,
            Murmur(STR_U8A(source.length_2))         === 0x9bbfd75f,
            Murmur(STR_U8A(source.length_3))         === 0xb3dd93fa,
            Murmur(STR_U8A(source.length_4))         === 0x43ed676a,
            Murmur(STR_U8A(source.length_4), 0xabcd) === 0xb95c4c63,
            Murmur(STR_U8A(source.length_5))         === 0xe89b9af6,
            Murmur(STR_U8A(source.length_6))         === 0x6181c085,
            Murmur(STR_U8A(source.length_7))         === 0x883c9b06,
            Murmur(STR_U8A(source.length_8))         === 0x49ddccc4,
            Murmur(STR_U8A(source.length_9))         === 0x421406f0,
            Murmur(STR_U8A(source.length_10))        === 0x88927791,
            Murmur(STR_U8A(source.length_11))        === 0x5f3b25df,
            Murmur(STR_U8A(source.length_11), 123)   === 0x3cbdcdaa,
            Murmur(STR_U8A(source.length_16))        === 0x36c7e0df,
            Murmur(STR_U8A(source.length_17))        === 0x8efa0e6d,
            Murmur(STR_U8A(source.length_32))        === 0xb3431dee,
            Murmur(STR_U8A(source.length_33))        === 0x2ef10cb3,
            Murmur(STR_U8A(source.length_64))        === 0x1329ed6a,
            Murmur(STR_U8A(source.length_64), 64)    === 0x58638bb6,
            Murmur(source.bigArray)                  === 0x74835d3a,
        ];

    if (!/false/.test(result.join(","))) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

// --- XXHash ---
// see https://gist.github.com/uupaa/8609d8d2d4ee6876eac1

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

// --- CRC32 ---
function testCRC32(test, pass, miss) {
    var png_IEND      = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44,                                                                               0xAE, 0x42, 0x60, 0x82]);
    var png_IDAT_3x3  = new Uint8Array([0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x08, 0x06, 0x00, 0x00, 0x00, 0x56, 0x28, 0xB5, 0xBF]);
    //                                  ~~~~~~~~~~~~~~~~~~~~~~  ~~~~~~~~~~~~~~~~~~~~~~  ~~~~~~~~~~~~~~~~~~~~~~  ~~~~~~~~~~~~~~~~~~~~~~  ~~~~  ~~~~  ~~~~~~~~~~~~~~~~  ~~~~~~~~~~~~~~~~~~~~~~
    //                                    chunkDataSize = 13         "IHDR"                   width                     height          depth type       dummy                checksum
    var png_IDAT_gold = new Uint8Array([0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0xC8, 0x00, 0x00, 0x00, 0xC8, 0x08, 0x02, 0x00, 0x00, 0x00, 0x22, 0x3A, 0x39, 0xC9]);

    var r1 = Hash.CRC32(png_IEND,      4, 4 + 0);
    var r2 = Hash.CRC32(png_IDAT_3x3,  4, 4 + 13);
    var r3 = Hash.CRC32(png_IDAT_gold, 4, 4 + 13);

    if (HexDump) {
        var hexOptions = { width: 8, joint: "", upper: true, noprefix: true };
        HexDump( new Uint8Array([r1 >>> 24, r1 >> 16, r1 >> 8, r1]), hexOptions);
        HexDump( new Uint8Array([r2 >>> 24, r2 >> 16, r2 >> 8, r2]), hexOptions);
        HexDump( new Uint8Array([r3 >>> 24, r3 >> 16, r3 >> 8, r3]), hexOptions);
    }

    if (r1 === 0xAE426082 &&
        r2 === 0x5628B5BF &&
        r3 === 0x223A39C9) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

// --- Benchmark ---
function testBenchMark(test, pass, miss) {
    global["BENCHMARK"] = true; {

        var MB = 1024 * 1024;
        var big = createBigArray(1 * MB);
        var PERFORMANCE = global["performance"] || Date;

        var point1 = PERFORMANCE.now(); {
            Hash.XXHash(big);
        }

        var point2 = PERFORMANCE.now(); {
            Hash.Murmur(big);
        }

        var point3 = PERFORMANCE.now(); {

            console.log("XXHash: " + (point2 - point1));
            console.log("Murmur: " + (point3 - point2));

            /*
            alert("XXHash: " + (point2 - point1));
            alert("Murmur: " + (point3 - point2));
             */
        }

        global["BENCHMARK"] = false;
    }

    test.done(pass());
}

// --- Utility ---
function testHexDump(test, pass, miss) {
}

return test.run().clone();

})((this || 0).self || global);

