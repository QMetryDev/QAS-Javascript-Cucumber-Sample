"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CucumberReport {
    //constructor
    constructor(features) {
        this.features = features;
    }
    //function
    disp() {
        console.log('Name is  :   ' + this.features);
    }
}
exports.CucumberReport = CucumberReport;
