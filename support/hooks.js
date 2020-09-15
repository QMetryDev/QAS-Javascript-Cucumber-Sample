"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { BeforeAll, After, AfterAll, Status } = require("cucumber");
const cucumber_1 = require("cucumber");
const protractor_1 = require("protractor");
const ConfigurationManager_1 = require("../source/base/ConfigurationManager");
const global_1 = require("./global");
var HashMap = require("hashmap");
cucumber_1.Before(function (scenario) {
    return __awaiter(this, void 0, void 0, function* () {
        let keyPreFix = scenario.pickle.name + " " + scenario.sourceLocation.line;
        global_1.Global.hashMap.set(keyPreFix + " starttime", new Date().getTime());
    });
});
BeforeAll({ timeout: 100 * 1000 }, () => __awaiter(this, void 0, void 0, function* () {
    global_1.Global.startTime = new Date().getTime();
    global_1.Global.hashMap = new HashMap();
    var properties = ConfigurationManager_1.ConfigurationManager.getBundle();
    yield protractor_1.browser.get(properties.get("env.baseurl"));
}));
After(function (scenario) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("After exec " + JSON.stringify(scenario));
        let keyPreFix = scenario.pickle.name + " " + scenario.sourceLocation.line;
        global_1.Global.hashMap.set(keyPreFix + " endtime", new Date().getTime());
        let key = "";
        if (scenario.result.status === Status.FAILED) {
            global_1.Global.fail++;
        }
        if (scenario.result.status === Status.PASSED) {
            global_1.Global.pass++;
        }
        if (scenario.result.status === Status.skipped) {
            global_1.Global.skip++;
        }
        key = scenario.pickle.name + " " + scenario.result.status;
        console.log("Seetting key " + key);
        global_1.Global.hashMap.set(key, global_1.Global.hashMap.get(key) === undefined
            ? 1
            : parseInt(global_1.Global.hashMap.get(key)) + 1);
        let keyTotal = scenario.pickle.name + " total";
        global_1.Global.hashMap.set(keyTotal, global_1.Global.hashMap.get(keyTotal) === undefined
            ? 1
            : parseInt(global_1.Global.hashMap.get(keyTotal)) + 1);
        global_1.Global.total++;
        console.log(JSON.stringify(scenario));
        if (scenario.result.status === Status.FAILED) {
            // screenShot is a base-64 encoded PNG
            const screenShot = yield protractor_1.browser.takeScreenshot();
            this.attach(screenShot, "image/png");
        }
    });
});
AfterAll({ timeout: 100 * 1000 }, () => __awaiter(this, void 0, void 0, function* () {
    global_1.Global.endTime = new Date().getTime();
    yield protractor_1.browser.quit();
}));
