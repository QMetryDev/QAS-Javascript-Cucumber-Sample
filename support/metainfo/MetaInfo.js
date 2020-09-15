"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MetaInfo {
    //constructor
    constructor(name, dir, startTime) {
        this.name = name;
        this.dir = dir;
        this.startTime = startTime;
    }
    //function
    disp() {
        console.log('Name is  :   ' + this.name);
    }
}
exports.MetaInfo = MetaInfo;
