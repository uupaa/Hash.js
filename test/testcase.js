var ModuleTestHash = (function(global) {

var test = new Test(["Hash"], { // Add the ModuleName to be tested here (if necessary).
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     true,  // enable worker test.
        node:       true,  // enable node test.
        nw:         true,  // enable nw.js test.
        el:         true,  // enable electron (render process) test.
        button:     true,  // show button.
        both:       true,  // test the primary and secondary modules.
        ignoreError:false, // ignore error.
        callback:   function() {
        },
        errorback:  function(error) {
            console.error(error.message);
        }
    });

    if (Hash.MD5) {
        test.add([ testMD5_String, testMD5_Binary ]);
    }
    if (Hash.SHA1) {
        test.add([ testSHA1_String, testSHA1_Binary ]);
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
        test.add([ testAdler32 ]);
    }
    if (Hash.XXHash) {
        test.add([ testXXHash ]);
    }
    if (Hash.Murmur) {
        test.add([ testMurmur ]);
    }
    if (Hash.CRC) {
        test.add([
            testCRC16_CCITT,
            testCRC16_IBM,
            testCRC32,
            testCRC32_MPEG,
        ]);
        test.add([
            testCRC32_PNG,
            testCRC32_MPEG_PAT,
            testCRC32_MPEG_PMT
        ]);
    }
    // --- bench mark ---
    if (Hash.XXHash && Hash.Murmur) {
        test.add([
            testBenchMark,
        ]);
    }

// --- test cases ------------------------------------------
// --- MD5 ---
function testMD5_String(test, pass, miss) {

    var source = "aaa";
    var answer = "47bce5c74f589f4867dbd57e9ca9f808";
    var md5HashString = Hash.MD5(source, true);

    if (answer === md5HashString) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testMD5_Binary(test, pass, miss) {

    var source = "aaa";
    var answer = "47bce5c74f589f4867dbd57e9ca9f808";
    var md5HashArray = Hash.MD5(source);
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
    var sha1HashString = Hash.SHA1(source, true);

    if (answer === sha1HashString) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testSHA1_Binary(test, pass, miss) {

    var source = "aaa";
    var answer = "7e240de74fb1ed08fa08d38063f6a6a91462a815";
    var sha1HashArray = Hash.SHA1(source);
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
    var HMAC_MD5 = Hash.HMAC("MD5", "", "", true);

    if (answer === HMAC_MD5) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testHMAC_MD5_StringWithKey(test, pass, miss) {

    // this magic value from http://en.wikipedia.org/wiki/HMAC
    var answer = "80070713463e7749b90c2dc24911e275";
    var HMAC_MD5 = Hash.HMAC("MD5", "key", "The quick brown fox jumps over the lazy dog", true);

    if (answer === HMAC_MD5) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testHMAC_SHA1_String(test, pass, miss) {

    // this magic value from http://en.wikipedia.org/wiki/HMAC
    var answer = "fbdb1d1b18aa6c08324b7d64b71fb76370690e1d";
    var HMAC_SHA1 = Hash.HMAC("SHA1", "", "", true);

    if (answer === HMAC_SHA1) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testHMAC_SHA1_StringWithKey(test, pass, miss) {

    // this magic value from http://en.wikipedia.org/wiki/HMAC
    var answer = "de7c9b85b8b78aa6bc8a7a36f70a90701c9db4d9";
    var HMAC_SHA1 = Hash.HMAC("SHA1", "key", "The quick brown fox jumps over the lazy dog", true);

    if (answer === HMAC_SHA1) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testHMAC_MD5_Binary(test, pass, miss) {

    // this magic value from http://en.wikipedia.org/wiki/HMAC
    var answer = "74e6f7298a9c2d168935f58c001bad88";
    var HMAC_MD5 = Hash.HMAC("MD5", new Uint8Array(0), new Uint8Array(0));

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
    var HMAC_SHA1 = Hash.HMAC("SHA1", new Uint8Array(0), new Uint8Array(0));

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
    var hash = Hash.HMAC("MD5", "", "", true);

    if (answer === hash) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testHMAC_SHA1(test, pass, miss) {

    // this magic value from http://en.wikipedia.org/wiki/HMAC
    var answer = "fbdb1d1b18aa6c08324b7d64b71fb76370690e1d";
    var hash = Hash.HMAC("SHA1", "", "", true);

    if (answer === hash) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

// --- Adler32 ---
function testAdler32(test, pass, miss) {

    var source1 = "The quick brown fox jumped over the lazy dogs.\n";
    var source2 = new Uint8Array([ // "The quick brown fox jumped over the lazy dogs.\n"
            0x54, 0x68, 0x65, 0x20, 0x71, 0x75, 0x69, 0x63,
            0x6b, 0x20, 0x62, 0x72, 0x6f, 0x77, 0x6e, 0x20,
            0x66, 0x6f, 0x78, 0x20, 0x6a, 0x75, 0x6d, 0x70,
            0x65, 0x64, 0x20, 0x6f, 0x76, 0x65, 0x72, 0x20,
            0x74, 0x68, 0x65, 0x20, 0x6c, 0x61, 0x7a, 0x79,
            0x20, 0x64, 0x6f, 0x67, 0x73, 0x2e, 0x0a]);
    var source3 = new Uint8Array([ // wrongChecksumWithAdler32Test
            1, 0, 5, 0, 15, 0, 1, 11, 0, 1]);
    var source4 = "Hellp Adler32";

    var result1 = Hash.Adler32(source1);
    var result2 = Hash.Adler32(source2);
    var result3 = Hash.Adler32(source3);
    var result4 = Hash.Adler32(source4);

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
            Hash.Murmur(source.length_0)         === 0x00000000,
            Hash.Murmur(source.length_1)         === 0x3c2569b2,
            Hash.Murmur(source.length_2)         === 0x9bbfd75f,
            Hash.Murmur(source.length_3)         === 0xb3dd93fa,
            Hash.Murmur(source.length_4)         === 0x43ed676a,
            Hash.Murmur(source.length_4, false, 0xabcd) === 0xb95c4c63,
            Hash.Murmur(source.length_5)         === 0xe89b9af6,
            Hash.Murmur(source.length_6)         === 0x6181c085,
            Hash.Murmur(source.length_7)         === 0x883c9b06,
            Hash.Murmur(source.length_8)         === 0x49ddccc4,
            Hash.Murmur(source.length_9)         === 0x421406f0,
            Hash.Murmur(source.length_10)        === 0x88927791,
            Hash.Murmur(source.length_11)        === 0x5f3b25df,
            Hash.Murmur(source.length_11, false, 123)   === 0x3cbdcdaa,
            Hash.Murmur(source.length_16)        === 0x36c7e0df,
            Hash.Murmur(source.length_17)        === 0x8efa0e6d,
            Hash.Murmur(source.length_32)        === 0xb3431dee,
            Hash.Murmur(source.length_33)        === 0x2ef10cb3,
            Hash.Murmur(source.length_64)        === 0x1329ed6a,
            Hash.Murmur(source.length_64, false, 64)    === 0x58638bb6,
            Hash.Murmur(source.bigArray)         === 0x74835d3a,
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
            Hash.XXHash(source.length_0)         === 0x02cc5d05,
            Hash.XXHash(source.length_1)         === 0x550d7456,
            Hash.XXHash(source.length_2)         === 0x4999fc53,
            Hash.XXHash(source.length_3)         === 0x32d153ff,
            Hash.XXHash(source.length_4)         === 0xa3643705,
            Hash.XXHash(source.length_4, false, 0xabcd) === 0xcda8fae4,
            Hash.XXHash(source.length_5)         === 0x9738f19b,
            Hash.XXHash(source.length_6)         === 0x8b7cd587,
            Hash.XXHash(source.length_7)         === 0x9dd093b3,
            Hash.XXHash(source.length_8)         === 0x0bb3c6bb,
            Hash.XXHash(source.length_9)         === 0xd03c13fd,
            Hash.XXHash(source.length_10)        === 0x8b988cfe,
            Hash.XXHash(source.length_11)        === 0x9db8a215,
            Hash.XXHash(source.length_11, false, 123)   === 0x69659438,
            Hash.XXHash(source.length_16)        === 0xc2c45b69,
            Hash.XXHash(source.length_17)        === 0xaa9118bd,
            Hash.XXHash(source.length_32)        === 0xeb888d30,
            Hash.XXHash(source.length_33)        === 0x5c28f38d,
            Hash.XXHash(source.length_64)        === 0xe717e5fb,
            Hash.XXHash(source.length_64, false, 64)    === 0x01198f54,
            Hash.XXHash(source.bigArray)         === 0xc419ee19,
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

// --- CRC ---
function testCRC16_CCITT(test, pass, miss) {
    // ./pycrc.py --model crc-16-ccitt --check-file hello.txt -> 0x32ac
    var sample = new Uint8Array([0x68, 0x65, 0x6C, 0x6C, 0x6F]);
    var r1     = Hash.CRC(sample, Hash.CRC16_CCITT);

    if (HexDump) {
        HexDump( new Uint8Array([r1 >>> 24, r1 >> 16, r1 >> 8, r1]), { title: "CRC16_CCITT", rule: {} } );
    }
    if (r1 === 0x32AC) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testCRC16_IBM(test, pass, miss) {
    // ./pycrc.py --model crc-16 --check-file hello.txt -> 0x34d2
    var sample = new Uint8Array([0x68, 0x65, 0x6C, 0x6C, 0x6F]);
    var r1     = Hash.CRC(sample, Hash.CRC16_IBM);
    var r2     = Hash.CRC(sample, Hash.CRC16_IBM, { hex: true });

    if (HexDump) {
        HexDump( new Uint8Array([r1 >>> 24, r1 >> 16, r1 >> 8, r1]), { title: "CRC16_IBM", rule: {} } );
    }
    if (r1 === 0x34D2) { // 0x34D2 = 13522
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testCRC32(test, pass, miss) {
    // ./pycrc.py --model crc-32 --check-file hello.txt -> 0x3610a686
    var sample = new Uint8Array([0x68, 0x65, 0x6C, 0x6C, 0x6F]);
    var r1     = Hash.CRC(sample, Hash.CRC32);

    if (HexDump) {
        HexDump( new Uint8Array([r1 >>> 24, r1 >> 16, r1 >> 8, r1]), { title: "CRC32", rule: {} } );
    }

    if (r1 === 0x3610A686) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testCRC32_MPEG(test, pass, miss) {
    // ./pycrc.py --model crc-32-mpeg --check-file hello.txt -> 0xe6ce9ac2
    var sample = new Uint8Array([0x68, 0x65, 0x6C, 0x6C, 0x6F]);
    var r1     = Hash.CRC(sample, Hash.CRC32_MPEG2);

    if (HexDump) {
        HexDump( new Uint8Array([r1 >>> 24, r1 >> 16, r1 >> 8, r1]), { title: "CRC32_MPEG2", rule: {} } );
    }

    if (r1 === 0xE6CE9AC2) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testCRC32_PNG(test, pass, miss) {
    var png_IEND      = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44,                                                                               0xAE, 0x42, 0x60, 0x82]);
    var png_IDAT_3x3  = new Uint8Array([0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x08, 0x06, 0x00, 0x00, 0x00, 0x56, 0x28, 0xB5, 0xBF]);
    //                                  ~~~~~~~~~~~~~~~~~~~~~~  ~~~~~~~~~~~~~~~~~~~~~~  ~~~~~~~~~~~~~~~~~~~~~~  ~~~~~~~~~~~~~~~~~~~~~~  ~~~~  ~~~~  ~~~~~~~~~~~~~~~~  ~~~~~~~~~~~~~~~~~~~~~~
    //                                    chunkDataSize = 13         "IHDR"                   width                     height          depth type       dummy                checksum
    var png_IDAT_gold = new Uint8Array([0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0xC8, 0x00, 0x00, 0x00, 0xC8, 0x08, 0x02, 0x00, 0x00, 0x00, 0x22, 0x3A, 0x39, 0xC9]);

    var r1 = Hash.CRC(png_IEND,      Hash.CRC32, { hex: false, offset: 4, length: 4 + 0  });
    var r2 = Hash.CRC(png_IDAT_3x3,  Hash.CRC32, { hex: false, offset: 4, length: 4 + 13 });
    var r3 = Hash.CRC(png_IDAT_gold, Hash.CRC32, { hex: false, offset: 4, length: 4 + 13 });

    if (HexDump) {
        HexDump( new Uint8Array([r1 >>> 24, r1 >> 16, r1 >> 8, r1]), { title: "IEND",      rule: {} } );
        HexDump( new Uint8Array([r2 >>> 24, r2 >> 16, r2 >> 8, r2]), { title: "IDAT_3x3",  rule: {} } );
        HexDump( new Uint8Array([r3 >>> 24, r3 >> 16, r3 >> 8, r3]), { title: "IDAT_gold", rule: {} } );
    }

    if (r1 === 0xAE426082 &&
        r2 === 0x5628B5BF &&
        r3 === 0x223A39C9) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testCRC32_MPEG_PAT(test, pass, miss) {
    /* MPEG2-TS MPEG2/CRC32 PAT
    ADRESS  0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F
    ------ -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
    000000 00 b0 0d 00 01 c1 00 00 00 01 ef ff
    */
    var PAT = new Uint8Array([0x00, 0xb0, 0x0d, 0x00, 0x01, 0xc1, 0x00, 0x00, 0x00, 0x01, 0xef, 0xff]);
    var r1  = Hash.CRC(PAT, Hash.CRC32_MPEG2);

    if (HexDump) {
        HexDump( new Uint8Array([r1 >>> 24, r1 >> 16, r1 >> 8, r1]), { title: "PAT", rule: {} } );
    }

    if (r1 === 0x3690e23d) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testCRC32_MPEG_PMT(test, pass, miss) {
    /* MPEG2-TS MPEG2/CRC32 PMT
    ADRESS  0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F
    ------ -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
    000000 02 b0 3c 00 01 c1 00 00 e1 00 f0 11 25 0f ff ff
    000010 49 44 33 20 ff 49 44 33 20 00 1f 00 01 15 e1 02
    000020 f0 0f 26 0d ff ff 49 44 33 20 ff 49 44 33 20 00
    000030 0f 1b e1 00 f0 00 0f e1 01 f0 00 d2 7f 16 89
                                            ~~~~~~~~~~~ CRC-32/MPEG2 value
     */
    var PMT = new Uint8Array([0x02, 0xb0, 0x3c, 0x00, 0x01, 0xc1, 0x00, 0x00, 0xe1, 0x00, 0xf0, 0x11, 0x25, 0x0f, 0xff, 0xff,
                              0x49, 0x44, 0x33, 0x20, 0xff, 0x49, 0x44, 0x33, 0x20, 0x00, 0x1f, 0x00, 0x01, 0x15, 0xe1, 0x02,
                              0xf0, 0x0f, 0x26, 0x0d, 0xff, 0xff, 0x49, 0x44, 0x33, 0x20, 0xff, 0x49, 0x44, 0x33, 0x20, 0x00,
                              0x0f, 0x1b, 0xe1, 0x00, 0xf0, 0x00, 0x0f, 0xe1, 0x01, 0xf0, 0x00]); // 0xd2, 0x7f, 0x16, 0x89
    var r1  = Hash.CRC(PMT, Hash.CRC32_MPEG2);

    if (HexDump) {
        HexDump( new Uint8Array([r1 >>> 24, r1 >> 16, r1 >> 8, r1]), { title: "PMT", rule: {} } );
    }

    if (r1 === 0xd27f1689) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

// --- Benchmark ---
function testBenchMark(test, pass, miss) {
    var KB = 1024;
    var MB = 1024 * 1024;

    function bench(data) {
        var PERFORMANCE = global["performance"] || Date;

        var begin   = PERFORMANCE.now();
        Hash.MD5(data);             var md5     = PERFORMANCE.now();
        Hash.SHA1(data);            var sha1    = PERFORMANCE.now();
        Hash.Adler32(data);         var adler32 = PERFORMANCE.now();
        Hash.XXHash(data);          var xxhash  = PERFORMANCE.now();
        Hash.Murmur(data);          var murmur  = PERFORMANCE.now();
        Hash.CRC(data, Hash.CRC32); var crc32   = PERFORMANCE.now();

        console.log("DataSize:  " + data.length);
        console.log("  MD5:     " + (md5 - begin));
        console.log("  SHA1:    " + (sha1 - md5));
        console.log("  Adler32: " + (adler32 - sha1));
        console.log("  XXHash:  " + (xxhash - adler32));
        console.log("  Murmur:  " + (murmur - xxhash));
        console.log("  CRC:     " + (crc32 - murmur));
    }
    // TODO: benchmark mode
    //global["BENCHMARK"] = true;
    bench( createBigArray(100 * KB) );
    bench( createBigArray(1   * MB) );

    //global["BENCHMARK"] = false;

    test.done(pass());
}

return test.run();

})(GLOBAL);

