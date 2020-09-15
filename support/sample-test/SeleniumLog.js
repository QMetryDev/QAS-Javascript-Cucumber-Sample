"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SeleniumLog {
    //constructor
    constructor(commandName, args, result, subLogs, duration) {
        this.args = [];
        this.subLogs = [];
        this.commandName = commandName;
        this.args = args;
        this.result = result;
        this.subLogs = subLogs;
        this.duration = duration;
    }
    //function
    disp() {
        console.log('Command Name is  :   ' + this.commandName);
    }
}
exports.SeleniumLog = SeleniumLog;
