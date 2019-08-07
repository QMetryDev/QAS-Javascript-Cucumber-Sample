"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Feature {
    //constructor
    constructor(keyword, name, line, id, tags, uri, elements) {
        this.keyword = keyword;
        this.name = name;
        this.line = line;
        this.id = id;
        this.tags = tags;
        this.uri = uri;
        this.elements = this.elements;
    }
    //function
    disp() {
        console.log('Name is  :   ' + this.name);
    }
}
exports.Feature = Feature;
