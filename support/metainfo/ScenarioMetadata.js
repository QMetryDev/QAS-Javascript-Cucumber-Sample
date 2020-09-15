"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ScenarioMetaData {
    //constructor
    constructor(description, groups, lineNo, name, referece, sign) {
        this.description = description;
        this.groups = groups;
        this.lineNo = lineNo;
        this.name = name;
        this.referece = referece;
        this.resultFileName = name;
        this.sign = sign;
    }
    //function
    disp() {
        console.log('Name is  :   ' + this.name);
    }
}
exports.ScenarioMetaData = ScenarioMetaData;
