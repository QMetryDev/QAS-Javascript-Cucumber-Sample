"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExecutionEnvInfo {
    //constructor
    constructor(javaArch, javaVendor, javaVersion, osArch, host, osName, userName, osVersion) {
        this.javaArch = javaArch;
        this.javaVendor = javaVendor;
        this.javaVersion = javaVersion;
        this.osArch = osArch;
        this.host = host;
        this.osName = osName;
        this.userName = userName;
        this.osVersion = osVersion;
    }
    //function
    disp() {
        console.log('resources is  :   ' + this.javaArch);
    }
}
exports.ExecutionEnvInfo = ExecutionEnvInfo;
