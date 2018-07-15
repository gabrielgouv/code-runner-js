"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
var process_wrapper_1 = require("../src/process-wrapper");
var filePath = './__tests__/files/java';
// compile java file before tests
beforeAll(function (done) {
    var command = "javac Test.java";
    var compiler = new process_wrapper_1.ProcessWrapper(command, {
        directory: filePath,
        useShell: true
    });
    compiler.onClose(function (value) {
        expect(value).toBe(0);
        done();
    });
});
test('run java file', function () {
    var command = "java Test";
    var input = 'Hello Java';
    var program = new process_wrapper_1.ProcessWrapper(command, {
        directory: filePath,
        useShell: true
    });
    program.writeInput(input);
    program.onOutput(function (data) {
        expect(data).toBe(input);
    });
    program.onClose(function (value) {
        expect(value).toBe(0);
    });
});
afterAll(function () {
    // TODO: remove .class file
});
