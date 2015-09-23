// Hash test

require("../lib/WebModule.js");

// publish to global
WebModule.publish = true;


require("./wmtools.js");
require("../lib/Hash.js");
require("../release/Hash.n.min.js");
require("./testcase.js");

