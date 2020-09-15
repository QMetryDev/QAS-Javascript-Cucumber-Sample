"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Scenario {
    //constructor
    constructor(keyword, name, line, id, tags, uri, type, steps) {
        this.keyword = keyword;
        this.name = name;
        this.line = line;
        this.id = id;
        this.tags = tags;
        this.uri = uri;
        this.type = type;
        this.steps = steps;
    }
    //function
    disp() {
        console.log('Name is  :   ' + this.name);
    }
}
exports.Scenario = Scenario;
