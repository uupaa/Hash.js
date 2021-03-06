// Hash test

onmessage = function(event) {
    self.unitTest = event.data; // { message, setting: { secondary, baseDir } }

    if (!self.console) { // polyfill WebWorkerConsole
        self.console = function() {};
        self.console.dir = function() {};
        self.console.log = function() {};
        self.console.warn = function() {};
        self.console.error = function() {};
        self.console.table = function() {};
    }

    importScripts("../../lib/WebModule.js");

    WebModule.VERIFY  = true;
    WebModule.VERBOSE = true;
    WebModule.PUBLISH = true;

    importScripts("../../node_modules/uupaa.hexdump.js/lib/HexDump.js");
    importScripts("../../node_modules/uupaa.bit.js/lib/Bit.js");
    importScripts("../../node_modules/uupaa.bit.js/lib/BitView.js");
    importScripts("../wmtools.js");
    importScripts("../../lib/Hash.js");
    importScripts("../../release/Hash.w.min.js");
    importScripts("../testcase.js");

    self.postMessage(self.unitTest);
};

