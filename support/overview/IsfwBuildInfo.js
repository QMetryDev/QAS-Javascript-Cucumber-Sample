"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IsfwBuildInfo {
    //constructor
    constructor(qafType, qafRevision, qafVersion, qafBuildTime) {
        this.qafType = qafType;
        this.qafRevision = qafRevision;
        this.qafVersion = qafVersion;
        this.qafBuildTime = qafBuildTime;
    }
    //function
    disp() {
        console.log('Index is  :   ' + this.qafType);
    }
}
exports.IsfwBuildInfo = IsfwBuildInfo;
