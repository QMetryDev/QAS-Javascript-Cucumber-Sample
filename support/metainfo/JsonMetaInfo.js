"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JsonMetaInfo {
    //constructor
    constructor(name, status, tests, total, pass, fail, skip, startTime, endTime) {
        this.tests = [];
        this.name = name;
        this.status = status;
        this.tests = tests;
        this.total = total;
        this.pass = pass;
        this.fail = fail;
        this.skip = skip;
        this.startTime = startTime;
        this.endTime = endTime;
    }
    //function
    disp() {
    }
}
exports.JsonMetaInfo = JsonMetaInfo;
