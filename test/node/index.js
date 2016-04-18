// Hash test

require("../../lib/WebModule.js");

WebModule.VERIFY  = true;
WebModule.VERBOSE = true;
WebModule.PUBLISH = true;

require("../../node_modules/uupaa.hexdump.js/lib/HexDump.js");
require("../../node_modules/uupaa.bit.js/lib/Bit.js");
require("../../node_modules/uupaa.bit.js/lib/BitView.js");
require("../wmtools.js");
require("../../lib/Hash.js");
require("../../release/Hash.n.min.js");
require("../testcase.js");

