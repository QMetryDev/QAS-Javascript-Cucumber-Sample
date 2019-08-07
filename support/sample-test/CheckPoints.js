"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CheckPoints {
    //constructor
    constructor(message, type, duration, threshold, subCheckPoints) {
        this.message = message;
        this.type = type;
        this.duration = duration;
        this.threshold = threshold;
        this.subCheckPoints = subCheckPoints;
    }
    //function
    disp() {
        console.log('Message is  :   ' + this.message);
    }
}
exports.CheckPoints = CheckPoints;
