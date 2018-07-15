"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var tree_kill_1 = __importDefault(require("tree-kill"));
var process_not_started_error_1 = require("./errors/process-not-started-error");
var ProcessWrapper = /** @class */ (function () {
    function ProcessWrapper(command, options) {
        this.command = command;
        this.childProcess = this.createProcess(options);
        this.cleanupOnExit();
    }
    ProcessWrapper.prototype.getProcess = function () {
        return this.childProcess;
    };
    ProcessWrapper.prototype.writeInput = function (value) {
        this.childProcess.stdin.write(value);
        this.childProcess.stdin.end();
    };
    ProcessWrapper.prototype.onOutput = function (callback) {
        if (this.childProcess) {
            this.childProcess.stdout.on('data', function (output) {
                callback(output.toString('utf8'));
            });
        }
        else {
            throw new process_not_started_error_1.ProcessNotStartedError();
        }
    };
    ProcessWrapper.prototype.onError = function (callback) {
        if (this.childProcess) {
            this.childProcess.stderr.on('data', callback);
        }
        else {
            throw new process_not_started_error_1.ProcessNotStartedError();
        }
    };
    ProcessWrapper.prototype.onClose = function (callback) {
        if (this.childProcess) {
            this.childProcess.on('close', callback);
        }
        else {
            throw new process_not_started_error_1.ProcessNotStartedError();
        }
    };
    ProcessWrapper.prototype.createProcess = function (options) {
        if (options) {
            console.log('options');
            return child_process_1.spawn(this.command, [''], this.parseOptions(options));
        }
        return child_process_1.spawn(this.command);
    };
    ProcessWrapper.prototype.parseOptions = function (options) {
        this.configureTimeout(options.executionLimit);
        var useShell = options.useShell ? options.useShell : true;
        return {
            argv0: options.argv0,
            cwd: options.directory,
            detached: options.detached,
            env: options.env,
            gid: options.gid,
            shell: useShell,
            stdio: options.stdio,
            uid: options.uid,
            windowsHide: options.windowsHide,
            windowsVerbatimArguments: options.windowsVerbatimArguments
        };
    };
    ProcessWrapper.prototype.configureTimeout = function (timeoutValue) {
        var _this = this;
        if (timeoutValue && timeoutValue > 0) {
            this.timeout = setTimeout(function () {
                tree_kill_1.default(_this.childProcess.pid, 'SIGKILL');
            }, timeoutValue);
        }
    };
    ProcessWrapper.prototype.cleanupOnExit = function () {
        var _this = this;
        if (this.childProcess) {
            this.childProcess.on('exit', function () {
                clearTimeout(_this.timeout);
            });
        }
    };
    return ProcessWrapper;
}());
exports.ProcessWrapper = ProcessWrapper;
