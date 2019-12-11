"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("cucumber");
const reporter = require("cucumber-html-reporter");
const fs = require("fs");
const fsExtra = require("fs-extra");
const mkdirp = require("mkdirp");
const path = require("path");
const global_1 = require("./global");
const JsonMetaInfo_1 = require("./metainfo/JsonMetaInfo");
const MetaInfo_1 = require("./metainfo/MetaInfo");
const ScenarioMetadata_1 = require("./metainfo/ScenarioMetadata");
const ScenarioMetaInfo_1 = require("./metainfo/ScenarioMetaInfo");
const BrowserActualCapabilities_1 = require("./overview/BrowserActualCapabilities");
const BrowserDesiredCapabilities_1 = require("./overview/BrowserDesiredCapabilities");
const EnvInfo_1 = require("./overview/EnvInfo");
const ExecutionEnvInfo_1 = require("./overview/ExecutionEnvInfo");
const IsfwBuildInfo_1 = require("./overview/IsfwBuildInfo");
const Overview_1 = require("./overview/Overview");
const RunParameters_1 = require("./overview/RunParameters");
const CheckPoints_1 = require("./sample-test/CheckPoints");
const SampleTest_1 = require("./sample-test/SampleTest");
const SeleniumLog_1 = require("./sample-test/SeleniumLog");
const ConfigurationManager_1 = require("../source/base/ConfigurationManager");
this.properties = ConfigurationManager_1.ConfigurationManager.getBundle();
const platformProperty = this.properties.get("platform");
const executionTimeStamp = getDate();
const startTime = new Date().getTime();
const jsonReports = path.join(process.cwd(), "/test-results/" + executionTimeStamp + "/json");
const htmlReports = path.join(process.cwd(), "/test-results/" + executionTimeStamp + "/html");
const targetJson = jsonReports + "/cucumber_report.json";
const metaInfoJson = path.join(process.cwd(), "/test-results/meta-info.json");
const jsonMetaInfoJson = path.join(process.cwd(), "/test-results/" + executionTimeStamp + "/json/meta-info.json");
const cucumberReportJsonPath = path.join(process.cwd(), "/test-results/" + executionTimeStamp + "/json/cucumber_report.json");
const rootMetaPath = "test-results/meta-info.json";
function formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + "_" + minutes + "_" + ampm;
    return strTime;
}
function getDate() {
    const date = new Date();
    const year = date.getFullYear();
    const monthShortNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];
    const formatedMonth = monthShortNames[date.getMonth()];
    const day = date.getDate().toString();
    const formatedDay = day.length === 1 ? "0" + day : day;
    const timeFormat = formatAMPM(date);
    return formatedDay + "_" + formatedMonth + "_" + year + "_" + timeFormat;
}
let cucumberReporterOptions = {
    jsonFile: targetJson,
    output: htmlReports + "/cucumber_reporter.html",
    reportSuiteAsScenarios: true,
    theme: "bootstrap"
};
let cucumberJsonReporterOptions = {
    jsonFile: targetJson,
    output: htmlReports + "/cucumber_reporter.html",
    reportSuiteAsScenarios: true,
    theme: "bootstrap"
};
class Reporter {
    constructor() { }
    static createDirectory(dir) {
        this.createRootMetaInfo(executionTimeStamp);
        if (!fs.existsSync(dir)) {
            mkdirp.sync(dir);
        }
        if (!fs.existsSync(jsonReports)) {
            mkdirp.sync(jsonReports);
        }
        if (!fs.existsSync(targetJson)) {
            fs.writeFileSync(targetJson, "");
        }
        if (!fs.existsSync(htmlReports)) {
            mkdirp.sync(htmlReports);
        }
    }
    static createHTMLReport() {
        try {
            reporter.generate(cucumberReporterOptions); // invoke cucumber-html-reporter
        }
        catch (err) {
            if (err) {
                throw new Error("Failed to save cucumber test results to json file.");
            }
        }
    }
    static createRootMetaInfo(executionTimeStamp) {
        //let cucumberJson = JSON.parse(fs.readFileSync(cukeJson, 'UTF-8'));
        let rootMeta = { reports: [] };
        if (fs.existsSync(rootMetaPath)) {
            rootMeta = JSON.parse(fs.readFileSync(rootMetaPath, "UTF-8"));
        }
        let currentMeta = new MetaInfo_1.MetaInfo("QAF Demo", "test-results/" + executionTimeStamp + "/json", new Date().getTime());
        rootMeta["reports"].unshift(currentMeta);
        fsExtra.ensureFileSync(metaInfoJson);
        fs.writeFileSync(metaInfoJson, JSON.stringify(rootMeta, null, 4));
    }
    static createScenario(sampleTestJson, scenario) {
        let overviewArray = [];
        let args = ["[/]"];
        let subLogs = [];
        let seleniumLogArray = [];
        let subCheckPointsArray = [];
        let subCheckPointsArraySub = [];
        let checkPointsArray = [];
        let keyPreFix = scenario.name + " " + scenario.line;
        let scenarioStartTime = global_1.Global.hashMap.get(keyPreFix + " starttime");
        let scenarioEndtTime = global_1.Global.hashMap.get(keyPreFix + " endtime");
        let duration = scenarioEndtTime - scenarioStartTime;
        for (let stepCount in scenario.steps) {
            let step = scenario.steps[stepCount];
            if (step.result.status === "passed") {
                step.result.status = "TestStepPass";
            }
            else if (step.result.status === "failed") {
                step.result.status = "TestStepFail";
            }
            else {
                step.result.status = "TestStepSkip";
            }
            if (step.keyword !== "Before" && step.keyword !== "After") {
                let checkPoints = new CheckPoints_1.CheckPoints(step.keyword + " " + step.name, step.result.status, step.result.duration, 0, subCheckPointsArray);
                checkPointsArray.push(checkPoints);
            }
        }
        let status = "pass";
        let errorTrace = "";
        for (let stepCount in scenario.steps) {
            if (scenario.steps[stepCount].result.status === "TestStepSkip") {
                status = "skip";
            }
            if (scenario.steps[stepCount].result.status === "TestStepFail") {
                status = "fail";
                errorTrace = scenario.steps[stepCount].result.error_message;
                break;
            }
        }
        let seleniumLog = new SeleniumLog_1.SeleniumLog("get", args, status, subLogs, duration);
        //let subCheckPoints = new SubCheckPoints('Timed out after 0 seconds: Unable to create driver instance in 1st attempt with retry timeout of 0 seconds. You can check/set value of 'driver.init.retry.timeout' appropriately to set retry timeout on driver initialization failure.\nDriver file not exist.', 'Fail', 0, 0, subCheckPointsArraySub);
        seleniumLogArray.push(seleniumLog);
        //subCheckPointsArray.push(subCheckPoints);
        let sampleTest = new SampleTest_1.SampleTest(seleniumLogArray, checkPointsArray, errorTrace);
        fs.writeFileSync(sampleTestJson + "/" + scenario.name + ".json", JSON.stringify(sampleTest, null, 4));
    }
    static createMetaInfoInScenario(scenarioMetaInfoJson, scenario, startTimeArray, endTimeArray) {
        let scenarioMeta = { methods: [] };
        let stringArray = [];
        if (scenario.tags !== undefined) {
            scenario.tags.forEach(function (tag) {
                stringArray.push(tag.name);
            });
        }
        let senarioMetaData = new ScenarioMetadata_1.ScenarioMetaData(scenario.name, stringArray, scenario.line, scenario.name, "scenarios/web/suite1.bdd", "scenarios.web.suite1.bdd.SampleTest()[pri:1002, instance:com.qmetry.qaf.automation.step.client.Scenario@3ea]");
        let status = "pass";
        for (let stepsCount in scenario.steps) {
            if (scenario.steps[stepsCount].result.status === cucumber_1.Status.SKIPPED) {
                status = "skip";
            }
            if (scenario.steps[stepsCount].result.status === cucumber_1.Status.FAILED) {
                status = "fail";
                break;
            }
        }
        let keyPreFix = scenario.name + " " + scenario.line;
        let scenarioStartTime = global_1.Global.hashMap.get(keyPreFix + " starttime");
        let scenarioEndtTime = global_1.Global.hashMap.get(keyPreFix + " endtime");
        let duration = scenarioEndtTime - scenarioStartTime;
        startTimeArray.push(scenarioStartTime);
        endTimeArray.push(scenarioEndtTime);
        let scenarioMetaInfo = new ScenarioMetaInfo_1.ScenarioMetaInfo(1, "test", [], senarioMetaData, [], scenarioStartTime, duration, status, 0.0);
        scenarioMeta.methods.push(scenarioMetaInfo);
        fs.writeFileSync(scenarioMetaInfoJson + "/meta-info.json", JSON.stringify(scenarioMeta, null, 4));
    }
    static updateMetaInfoInScenario(scenarioMetaInfoJson, scenario, startTimeArray, endTimeArray) {
        let stringArray = [];
        stringArray.push(scenario.tags[0].name);
        let senarioMetaData = new ScenarioMetadata_1.ScenarioMetaData(scenario.name, stringArray, scenario.line, scenario.name, "scenarios/web/suite1.bdd", "scenarios.web.suite1.bdd.SampleTest()[pri:1002, instance:com.qmetry.qaf.automation.step.client.Scenario@3ea]");
        let status = "pass";
        for (let stepsCount in scenario.steps) {
            if (scenario.steps[stepsCount].result.status === cucumber_1.Status.SKIPPED) {
                status = "skip";
            }
            if (scenario.steps[stepsCount].result.status === cucumber_1.Status.FAILED) {
                status = "fail";
                break;
            }
        }
        let keyPreFix = scenario.name + " " + scenario.line;
        let scenarioStartTime = global_1.Global.hashMap.get(keyPreFix + " starttime");
        let scenarioEndtTime = global_1.Global.hashMap.get(keyPreFix + " endtime");
        let duration = scenarioEndtTime - scenarioStartTime;
        startTimeArray.push(scenarioStartTime);
        endTimeArray.push(scenarioEndtTime);
        let scenarioMetaInfo = new ScenarioMetaInfo_1.ScenarioMetaInfo(1, "test", [], senarioMetaData, [], scenarioStartTime, duration, status, 0.0);
        // scenarioMeta.methods.push(scenarioMetaInfo);
        let updateMetaInfo = fs.readFileSync(scenarioMetaInfoJson + "/meta-info.json", "UTF-8");
        updateMetaInfo = JSON.parse(updateMetaInfo);
        updateMetaInfo["methods"].push(scenarioMetaInfo);
        fs.writeFileSync(scenarioMetaInfoJson + "/meta-info.json", JSON.stringify(updateMetaInfo, null, 4));
    }
    static createMetaInfoInJson() {
        let cucumberReportJson;
        if (fs.existsSync(cucumberReportJsonPath)) {
            cucumberReportJson = JSON.parse(fs.readFileSync(cucumberReportJsonPath, "UTF-8"));
        }
        let featureDirNames = [];
        let startTimeMinFromFeature = [];
        let endTimeTimeMaxFromFeature = [];
        for (let featureCount in cucumberReportJson) {
            // featureDirNames.push(cucumberReportJson[featureCount].name);
            let featureDirName = cucumberReportJson[featureCount].name +
                "_" +
                path.basename(cucumberReportJson[featureCount].uri.split(".feature")[0]);
            featureDirNames.push(featureDirName);
            let featureDirs = jsonReports + "/" + featureDirName;
            if (!fs.existsSync(featureDirs)) {
                fs.mkdirSync(featureDirs);
            }
            let startTimeArray = [];
            let endTimeArray = [];
            let isUpdate = false;
            let scenarioDirNames = [];
            scenarioDirNames.push("" + cucumberReportJson[featureCount].name);
            let elementsName;
            for (let scenarioCount in cucumberReportJson[featureCount].elements) {
                let name = cucumberReportJson[featureCount].elements[scenarioCount].name +
                    "_" +
                    cucumberReportJson[featureCount].elements[scenarioCount].line;
                let scenarioDir = featureDirs + path.sep + cucumberReportJson[featureCount].name;
                if (!fs.existsSync(scenarioDir)) {
                    fs.mkdirSync(scenarioDir);
                }
                else {
                    isUpdate = true;
                }
                let scenario = cucumberReportJson[featureCount].elements[scenarioCount];
                if (isUpdate) {
                    //UPDATE METAINFO
                    this.updateMetaInfoInScenario(scenarioDir, scenario, startTimeArray, endTimeArray);
                }
                else {
                    this.createMetaInfoInScenario(scenarioDir, scenario, startTimeArray, endTimeArray);
                }
                this.createScenario(scenarioDir, cucumberReportJson[featureCount].elements[scenarioCount]);
                elementsName =
                    cucumberReportJson[featureCount].elements[scenarioCount].name;
                let minStart = Math.min.apply(Math, startTimeArray);
                let maxEnd = Math.max.apply(Math, endTimeArray);
                startTimeMinFromFeature.push(minStart);
                endTimeTimeMaxFromFeature.push(maxEnd);
                if (isUpdate) {
                    this.updateOverview(featureDirName, scenarioDirNames, elementsName, minStart, maxEnd);
                }
                else {
                    this.createOverview(featureDirName, scenarioDirNames, elementsName, minStart, maxEnd);
                }
            }
            // let uniqueFeaturedirName = [...new Set(featureDirNames)];
        }
        let status = "pass";
        if (global_1.Global.skip > 0) {
            status = "skip";
        }
        if (global_1.Global.fail > 0) {
            status = "fail";
        }
        let minStart = Math.min.apply(Math, startTimeMinFromFeature);
        let maxEnd = Math.max.apply(Math, endTimeTimeMaxFromFeature);
        let jsonMetaInfo = new JsonMetaInfo_1.JsonMetaInfo("Cucumber Report", status, featureDirNames, global_1.Global.total, global_1.Global.pass, global_1.Global.fail, global_1.Global.skip, minStart, maxEnd);
        //jsonMeta.push(jsonMetaInfo);
        fs.writeFileSync(jsonMetaInfoJson, JSON.stringify(jsonMetaInfo, null, 4));
    }
    static createJSONReport() {
        Reporter.createMetaInfoInJson();
    }
    static getTimeStamp() {
        return executionTimeStamp;
    }
    static createOverview(featuresDir, scenarioDirsArray, elementsName, minStart, maxEnd) {
        let browserDesiredCapabilities = new BrowserDesiredCapabilities_1.BrowserDesiredCapabilities("", true, true, "", "", true);
        let browserActualCapabilities = new BrowserActualCapabilities_1.BrowserActualCapabilities();
        let isfwBuildInfo = new IsfwBuildInfo_1.IsfwBuildInfo("", "", "", "");
        let runParameters = new RunParameters_1.RunParameters("resources/" + platformProperty, "", "", "");
        let executionEnvInfo = new ExecutionEnvInfo_1.ExecutionEnvInfo("", "", "", "", "", "", "", "");
        let envInfo = new EnvInfo_1.EnvInfo(browserDesiredCapabilities, browserActualCapabilities, isfwBuildInfo, runParameters, executionEnvInfo);
        let passKey = elementsName + " " + cucumber_1.Status.PASSED;
        let failKey = elementsName + " " + cucumber_1.Status.FAILED;
        let skipKey = elementsName + " " + cucumber_1.Status.SKIPPED;
        let totalKey = elementsName + " total";
        let totalValue = global_1.Global.hashMap.get(totalKey) === undefined
            ? 0
            : global_1.Global.hashMap.get(totalKey);
        let passValue = global_1.Global.hashMap.get(passKey) === undefined
            ? 0
            : global_1.Global.hashMap.get(passKey);
        let failValue = global_1.Global.hashMap.get(failKey) === undefined
            ? 0
            : global_1.Global.hashMap.get(failKey);
        let skipValue = global_1.Global.hashMap.get(skipKey) === undefined
            ? 0
            : global_1.Global.hashMap.get(skipKey);
        let overview = new Overview_1.Overview(totalValue, passValue, failValue, skipValue, scenarioDirsArray, envInfo, minStart, maxEnd);
        let jsonString = Overview_1.Overview.formatFieldNames(JSON.stringify(overview, null, 4));
        let dir = jsonReports + "/" + featuresDir + "/overview.json";
        fs.writeFileSync(dir, jsonString);
    }
    static updateOverview(featuresDir, scenarioDirsArray, elementsName, minStart, maxEnd) {
        let passKey = elementsName + " " + cucumber_1.Status.PASSED;
        let failKey = elementsName + " " + cucumber_1.Status.FAILED;
        let skipKey = elementsName + " " + cucumber_1.Status.SKIPPED;
        let totalKey = elementsName + " total";
        let totalValue = global_1.Global.hashMap.get(totalKey) === undefined
            ? 0
            : global_1.Global.hashMap.get(totalKey);
        let passValue = global_1.Global.hashMap.get(passKey) === undefined
            ? 0
            : global_1.Global.hashMap.get(passKey);
        let failValue = global_1.Global.hashMap.get(failKey) === undefined
            ? 0
            : global_1.Global.hashMap.get(failKey);
        let skipValue = global_1.Global.hashMap.get(skipKey) === undefined
            ? 0
            : global_1.Global.hashMap.get(skipKey);
        let dir = jsonReports + "/" + featuresDir + "/overview.json";
        let content = fs.readFileSync(dir, "utf8");
        content = JSON.parse(content);
        // scenarioDirsArray.forEach(function(scenario) {
        //   content["classes"].push(scenario);
        // });
        content["total"] = content["total"] + totalValue;
        content["pass"] = content["pass"] + passValue;
        content["fail"] = content["fail"] + failValue;
        content["skip"] = content["skip"] + skipValue;
        content["startTime"] = minStart;
        content["endTime"] = maxEnd;
        fs.writeFileSync(dir, JSON.stringify(content, null, 4));
    }
}
exports.Reporter = Reporter;
