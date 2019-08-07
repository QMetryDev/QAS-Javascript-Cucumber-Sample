"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RunParameters {
    //constructor
    constructor(resources, scenarioFileLoc, baseurl, envResources) {
        this.resources = resources;
        this.scenarioFileLoc = scenarioFileLoc;
        this.baseurl = baseurl;
        this.envResources = envResources;
    }
    //function
    disp() {
        console.log('resources is  :   ' + this.resources);
    }
}
exports.RunParameters = RunParameters;
