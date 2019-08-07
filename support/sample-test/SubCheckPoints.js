"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SubCheckPoints {
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
exports.SubCheckPoints = SubCheckPoints;
