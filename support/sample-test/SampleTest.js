"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SampleTest {
    //constructor
    constructor(seleniumLog, checkPoints, errorTrace) {
        this.seleniumLog = seleniumLog;
        this.checkPoints = checkPoints;
        this.errorTrace = errorTrace;
    }
    //function
    disp() {
        console.log('ErrorTrace is  :   ' + this.errorTrace);
    }
}
exports.SampleTest = SampleTest;
