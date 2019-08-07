"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BrowserDesiredCapabilities {
    //constructor
    constructor(browserName, takesScreenshot, javascriptEnabled, version, platform, cssSelectorsEnabled) {
        this.browserName = browserName;
        this.takesScreenshot = takesScreenshot;
        this.javascriptEnabled = javascriptEnabled;
        this.version = version;
        this.platform = platform;
        this.cssSelectorsEnabled = cssSelectorsEnabled;
    }
    //function
    disp() {
        console.log('Index is  :   ' + this.browserName);
    }
}
exports.BrowserDesiredCapabilities = BrowserDesiredCapabilities;
