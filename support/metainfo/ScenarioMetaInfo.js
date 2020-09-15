"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ScenarioMetaInfo {
    //constructor
    constructor(index, type, args, metaData, dependsOn, startTime, duration, result, passPer) {
        this.args = [];
        this.dependsOn = [];
        this.index = index;
        this.type = type;
        this.args = args;
        this.metaData = metaData;
        this.dependsOn = dependsOn;
        this.startTime = startTime;
        this.duration = duration;
        this.result = result;
        this.passPer = passPer;
    }
    //function
    disp() {
    }
}
exports.ScenarioMetaInfo = ScenarioMetaInfo;
