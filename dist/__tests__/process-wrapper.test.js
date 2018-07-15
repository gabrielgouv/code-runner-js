"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
var process_wrapper_1 = require("../src/process-wrapper");
test('create process', function () {
    var textToPrint = 'process created';
    var command = "printf \"" + textToPrint + "\"";
    var process = new process_wrapper_1.ProcessWrapper(command, {
        useShell: true
    });
    process.onOutput(function (output) {
        expect(output).toBe(textToPrint);
    });
    process.onClose(function (value) {
        expect(value).toBe(0);
    });
});
