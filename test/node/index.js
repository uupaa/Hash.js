// Hash test

require("../../lib/WebModule.js");

WebModule.verify  = true;
WebModule.verbose = true;
WebModule.publish = true;


require("../wmtools.js");
require("../../lib/Hash.js");
require("../../release/Hash.n.min.js");
require("../testcase.js");

