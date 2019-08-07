"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EnvInfo {
    //constructor
    constructor(browserDesiredCapabilities, browserActualCapabilities, isfwBuildInfo, runParameters, executionEnvInfo) {
        this.browserDesiredCapabilities = browserDesiredCapabilities;
        this.browserActualCapabilities = browserActualCapabilities;
        this.isfwBuildInfo = isfwBuildInfo;
        this.runParameters = runParameters;
        this.executionEnvInfo = executionEnvInfo;
    }
    //function
    disp() {
        console.log('BrowserDesiredCapabilities is  :   ' + this.browserDesiredCapabilities);
    }
}
exports.EnvInfo = EnvInfo;
