"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_1 = require("protractor");
const ConfigurationManager_1 = require("../source/base/ConfigurationManager");
this.properties = ConfigurationManager_1.ConfigurationManager.getBundle();
const reporter_1 = require("../support/reporter");
// import {setDefaultTimeout} from 'cucumber';
const jsonReports = process.cwd() + "/test-results/";
const yargs = require("yargs").argv;
const argv = yargs;
let isDIrectConnectSupported = true;
let seleniumAddress = 'http://127.0.0.1:4444/wd/hub';
const platformProperty = this.properties.get("platform");
let browserProperty = this.properties.get("driver.name");
console.log('browserProperty.toLowerCase() : ' + browserProperty.toLowerCase());
let browserName = browserProperty.replace(new RegExp("Driver"), "");
let driverCaps = {};
let caps = this.properties.get(browserName.toLowerCase() + ".additional.capabilities");
if (browserProperty.toLowerCase().indexOf("remote") >= 0) {
	isDIrectConnectSupported = false;
	seleniumAddress = this.properties.get("remote.server");
	browserName = caps ? JSON.parse(caps)['browserName'] : "chrome";
}
try {
	if (caps !== null && caps !== undefined) {
		driverCaps = JSON.parse(caps);
		driverCaps["browserName"] = browserName;
	}
}
catch (error) {
	console.log(caps +
		" defined at " +
		browserName.toLowerCase() +
		".additional.capabilities" +
		" is not a valid json");
}
console.log('driverCaps : ' + JSON.stringify(driverCaps));
exports.config = {
	directConnect: isDIrectConnectSupported,
	// seleniumAddress: "http://127.0.0.1:4444/wd/hub",
	seleniumAddress: seleniumAddress,
	capabilities: driverCaps,
	SELENIUM_PROMISE_MANAGER: false,
	baseUrl: "https://www.google.com",
	framework: "custom",
	allScriptsTimeout: 60000,
	frameworkPath: require.resolve("protractor-cucumber-framework"),
	specs: getFeatureFiles(),
	onPrepare: () => {
		protractor_1.browser.ignoreSynchronization = true;
		protractor_1.browser.waitForAngularEnabled(false);
		// setDefaultTimeout(60 *10);
		protractor_1.browser.manage().window().maximize();
		protractor_1.browser
			.manage()
			.timeouts()
			.implicitlyWait(30 * 1000);
		// browser.allScriptsTimeout = 60 * 1000;
		// browser.manage().timeouts().pageLoadTimeout(10000);  // 10 seconds
		reporter_1.Reporter.createDirectory(jsonReports);
		global.variableName = "hikumar";
	},
	cucumberOpts: {
		compiler: "ts:ts-node/register",
		format: "json:./test-results/" +
			reporter_1.Reporter.getTimeStamp() +
			"/json/cucumber_report.json",
		require: [
			"../stepdefinitions/" + platformProperty + "/*.js",
			"../stepdefinitions/*.js",
			"../support/*.js"
		],
		strict: true
	},
	onComplete: () => {
		reporter_1.Reporter.createHTMLReport();
		reporter_1.Reporter.createJSONReport();
	}
};
function getFeatureFiles() {
	if (argv.feature) {
		return argv.feature
			.split(",")
			.map(feature => `${process.cwd()}` + `${feature}`);
	}
	return [
		`${process.cwd()}/scenarios/` + platformProperty + `/**/*.feature`
	];
}
