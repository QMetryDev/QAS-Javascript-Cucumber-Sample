"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* Integration through qmetry.properties file */
const fs = require("fs-extra");
const path = require("path");
const request = require("request");
const utils_1 = require("./utils");
const configurationManager_1 = require("./ConfigurationManager");
exports.extraFieldMap = {};
exports.integrationProperties = configurationManager_1.ConfigurationManager.getBundle();
function uploadResults(filePath, callback) {
    var option_new;
    var start = new Date().getTime();
    if (!utils_1.ON_PREMISE &&
        utils_1.INTEGRATION_TYPE.toString().toLowerCase() === "qtm4j") {
        // FOR QTM4J CLOUD
        option_new = {
            method: "POST",
            url: utils_1.URL,
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                apiKey: API_KEY,
                format: 'cucumber/json',
            },
            json: true
        };
        option_new["body"]["testAssetHierarchy"] = utils_1.TEST_ASSET_HIERARCHY;//"TestCase-TestStep";
        option_new["body"]["testCaseUpdateLevel"] = utils_1.TEST_CASE_UPDATE_LEVEL;//1;
        // delete extraFieldMap['testRunName'];
        option_new = getExtraFieldMap(option_new);
        console.log("Uploading results With:::" +
            utils_1.INTEGRATION_TYPE +
            "::Cloud" +
            JSON.stringify(option_new));
        try {
            // url will not get for qtm4j cloud
            request(option_new, function requestTO(error, response, body) {
                if (response.body.isSuccess) {
                    doCloudCall(filePath, response, callback);
                }
                else {
                    callback({
                        success: false,
                        errMessage: response ? response.body.errorMessage : 'Something Went Wrong, Please Check Configuration(URL, Credentials etc...)'
                    });
                }
            });
        }
        catch (e) {
            callback({ success: false, errMessage: e });
        }
    } else if (!utils_1.ON_PREMISE &&
        utils_1.INTEGRATION_TYPE.toString().toLowerCase() === "qtm4j4x") {
        // FOR QTM4J CLOUD
        option_new = {
            method: "POST",
            url: utils_1.URL,
            headers: {
                "Content-Type": "application/json",
                apiKey: utils_1.API_KEY
            },
            body: {
                format: 'CUCUMBER'
            },
            json: true
        };
        // delete extraFieldMap['testRunName'];
        option_new = getExtraFieldMap(option_new);
        console.log("Uploading results With:::" +
            utils_1.INTEGRATION_TYPE +
            "::Cloud" +
            JSON.stringify(option_new));
        try {
            // url will not get for qtm4j cloud
            request(option_new, function requestTO(error, response, body) {
                if (response && response.body && response.body.trackingId) {
                    doCloudCall(filePath, response, callback);
                }
                else {
                    callback({
                        success: false,
                        errMessage: response ? response.body.errorMessage : 'Something Went Wrong, Please Check Configuration(URL, Credentials etc...)'
                    });
                }
            });
        }
        catch (e) {
            callback({ success: false, errMessage: e });
        }
    } else if (utils_1.ON_PREMISE &&
        utils_1.INTEGRATION_TYPE.toString().toLowerCase() === "qtm4j4x") {
        // FOR QTM4J SERVER
        let authorization_value = encodeBase64(utils_1.USERNAME, utils_1.PASSWORD);
        option_new = {
            method: "POST",
            url: utils_1.URL,
            headers: {
                "Content-Type": "application/json",
                apiKey: utils_1.API_KEY,
                Authorization: "Basic " + authorization_value
            },
            body: {
                format: 'CUCUMBER'
            },
            json: true
        };
        // delete extraFieldMap['testRunName'];
        option_new = getExtraFieldMap(option_new);
        console.log("Uploading results With:::" +
            utils_1.INTEGRATION_TYPE +
            "::SERVER" +
            JSON.stringify(option_new));
        try {
            // url will not get for qtm4j cloud
            request(option_new, function requestTO(error, response, body) {
                if (response && response.body && response.body.trackingId) {
                    doServerCall(filePath, response, utils_1.API_KEY, authorization_value, callback);
                }
                else {
                    callback({
                        success: false,
                        errMessage: response ? response.body.errorMessage : 'Something Went Wrong, Please Check Configuration(URL, Credentials etc...)'
                    });
                }
            });
        }
        catch (e) {
            callback({ success: false, errMessage: e });
        }
    } else {
        //FOR QTM4J server and QTM(CLound/Server)
        console.log("Uploading file name ::" + filePath);
        if (utils_1.INTEGRATION_TYPE.toString().toLowerCase() === "qtm") {
            let newFilePath = filePath.replace('.zip', '/json/cucumber_report.json');
            option_new = {
                method: "POST",
                url: utils_1.URL,
                headers: {
                    apikey: utils_1.API_KEY,
                    scope: "default",
                    accept: "application/json"
                },
                formData: {
                    file: {
                        value: fs.createReadStream(newFilePath),
                        options: {
                            filename: path.basename(newFilePath),
                            contentType: null
                        }
                    },
                    entityType: 'CUCUMBER'
                }
            };
        }
        else {
            //for QTM4J Server
            let authorization_value = encodeBase64(utils_1.USERNAME, utils_1.PASSWORD);
            option_new = {
                method: "POST",
                url: utils_1.URL,
                headers: {
                    Authorization: "Basic " + authorization_value
                },
                formData: {
                    file: {
                        value: fs.createReadStream(filePath),
                        options: { filename: path.basename(filePath) }
                    },
                    apiKey: utils_1.API_KEY,
                    format: 'qas/json'
                }
            };
        }
        //options are created, now need to make a call
        option_new["formData"]["testAssetHierarchy"] = utils_1.TEST_ASSET_HIERARCHY//"TestCase-TestStep";
        option_new["formData"]["testCaseUpdateLevel"] = utils_1.TEST_CASE_UPDATE_LEVEL//1;
        option_new = getExtraFieldMap(option_new);
        try {
            request(option_new, function requestTO(error, response, body) {
                var end = new Date().getTime();
                var time = end - start;
                if (!response || response.statusCode !== 200) {
                    callback({
                        success: false,
                        errMessage: "Something Went Wrong, Please Check Configuration(URL, Credentials etc...)",
                        executionTime: time
                    });
                }
                let parseBody = JSON.parse(body);
                deleteZip(filePath);
                console.log("Upload Result Response:::" +
                    utils_1.INTEGRATION_TYPE +
                    "::Server" +
                    JSON.stringify(parseBody));
            });
        }
        catch (e) {
            console.log("error:" + e);
            callback({ success: false, errMessage: e });
        }
    }
}
exports.uploadResults = uploadResults;
function encodeBase64(username, pwd) {
    return Buffer.from(username + ":" + pwd).toString("base64");
}
function getExtraFieldMap(option_new) {
    if (utils_1.INTEGRATION_TYPE.toString().toLowerCase() === "qtm4j4x") {
        nonRequiredRequest4xParam();
    } else {
        nonRequiredRequestParam();
    }
    if (!utils_1.ON_PREMISE &&
        utils_1.INTEGRATION_TYPE.toString().toLowerCase() === "qtm4j" ||
        utils_1.INTEGRATION_TYPE.toString().toLowerCase() === "qtm4j4x") {
        Object.keys(exports.extraFieldMap).forEach(function (key) {
            var val = exports.extraFieldMap[key];
            if (val !== "" && val !== undefined && val !== null && val != 0) {
                option_new["body"][key] = val;
            }
        });
    }
    else {
        Object.keys(exports.extraFieldMap).forEach(function (key) {
            var val = exports.extraFieldMap[key];
            if (val !== "" && val !== undefined && val !== null && val != 0) {
                option_new["formData"][key] = val;
            }
        });
    }
    return option_new;
}
function doCloudCall(filePath, response, callback) {
    console.log("IN CLOUD > ::: for " + response.body.url);
    let newFilePath = filePath.replace('.zip', '/json/cucumber_report.json');
    const start = new Date().getTime();
    let option_new = {
        method: "PUT",
        url: response.body.url,
        headers: {
            "Content-Type": "multipart/form-data"
        },
        json: false,
        enconding: null,
        body: fs.readFileSync(newFilePath)
    };
    try {
        request(option_new, function requestTO(error, response, body) {
            console.log("response :: %%%%%%%%%%%%%%%" + JSON.stringify(response));
            if (error) {
                console.log("ERROR :: %%%%%%%%%%%%%%%" + JSON.stringify(error));
                callback({ success: false, errMessage: error }); // TODO:
            }
            var end = new Date().getTime();
            var time = end - start;
            deleteZip(filePath);
            callback({
                success: true,
                statusCode: response.statusCode,
                executionTime: time
            });
        });
    }
    catch (e) {
        callback({ success: false, errMessage: e });
    }
}

function doServerCall(filePath, response, apiKey, authorization_value, callback) {
    console.log('IN SERVER > ::: for ' + response.body.url);
    let newFilePath = filePath.replace('.zip', '/json/cucumber_report.json');
    const start = new Date().getTime();
    let option_new = {
        method: 'POST',
        url: response.body.url,
        headers: {
            'Content-Type': 'multipart/form-data',
            'apiKey': apiKey,
            'Authorization': 'Basic ' + authorization_value
        },
        json: false,
        enconding: null,
        formData: {
            file: {
                value: fs.createReadStream(newFilePath),
                options: {
                    filename: path.basename(newFilePath),
                    contentType: null
                }
            }
        }
    };
    try {
        request(option_new, function requestTO(error, response, body) {
            console.log("response :: %%%%%%%%%%%%%%%" + JSON.stringify(response));
            if (error) {
                console.log("ERROR :: %%%%%%%%%%%%%%%" + JSON.stringify(error));
                callback({ success: false, errMessage: error }); // TODO:
            }
            var end = new Date().getTime();
            var time = end - start;
            deleteZip(filePath);
            callback({
                success: true,
                statusCode: response.statusCode,
                executionTime: time
            });
        });
    }
    catch (e) {
        callback({ success: false, errMessage: e });
    }
}


function nonRequiredRequestParam() {
    exports.extraFieldMap['testAssetHierarchy'] = utils_1.TEST_ASSET_HIERARCHY;
    exports.extraFieldMap['testCaseUpdateLevel'] = utils_1.TEST_CASE_UPDATE_LEVEL;
    exports.extraFieldMap["testRunName"] = utils_1.TEST_RUN_NAME;
    exports.extraFieldMap["platform"] = utils_1.PLATFORM;
    exports.extraFieldMap["labels"] = utils_1.LABELS;
    exports.extraFieldMap["versions"] = utils_1.VERSION;
    exports.extraFieldMap["components"] = utils_1.COMPONENTS;
    exports.extraFieldMap["sprint"] = utils_1.SPRINT;
    exports.extraFieldMap["comment"] = utils_1.COMMENT;
    exports.extraFieldMap["testRunKey"] = utils_1.TEST_RUN_KEY;
    exports.extraFieldMap["attachFile"] = utils_1.ATTACH_FILE.toString();
    exports.extraFieldMap["JIRAFields"] = utils_1.JIRA_FIELS;

    if (!utils_1.ON_PREMISE && utils_1.INTEGRATION_TYPE.toLowerCase() === "qtm4j") {
        exports.extraFieldMap["JIRAFields"] = JSON.parse(utils_1.JIRA_FIELS.toString());
    } else {
        exports.extraFieldMap["JIRAFields"] = utils_1.JIRA_FIELS;
    }
    exports.extraFieldMap["cycleID"] = utils_1.CYCLE_IDS;
    exports.extraFieldMap["platformID"] = utils_1.PLATFORM_ID;
    exports.extraFieldMap["testsuiteId"] = utils_1.TEST_SUITE_ID;
    exports.extraFieldMap["projectID"] = utils_1.PROJECT_ID;
    exports.extraFieldMap["releaseID"] = utils_1.REALEASE_ID;
    exports.extraFieldMap["buildID"] = utils_1.BUILD_ID;
    exports.extraFieldMap["testsuiteName"] = utils_1.TEST_SUITE_NAME;
    exports.extraFieldMap['testcase_fields'] = utils_1.TEST_CASE_FIELDS;
    exports.extraFieldMap['testsuite_fields'] = utils_1.TEST_SUITE_FIELDS;


    exports.extraFieldMap['testcase_fields'] = exports.extraFieldMap['testcase_fields'].replace(/\"\[/g, '[').replace(/\]"/g, ']');
    exports.extraFieldMap['testsuite_fields'] = exports.extraFieldMap['testsuite_fields'].replace(/\"\[/g, '[').replace(/\]"/g, ']');
}

function checkValueIsBankOrNot(val) {
    if (val !== '' && val !== undefined && val !== null && val !== 0) {
        return val;
    }
    else {
        return '';
    }
}

function nonRequiredRequest4xParam() {
    exports.extraFieldMap["testCycleToReuse"] = utils_1.TEST_CYCLE_TO_REUSE;
    exports.extraFieldMap["environment"] = utils_1.ENVIRONMENT;
    exports.extraFieldMap["build"] = utils_1.BUILD;
    exports.extraFieldMap["attachFile"] = utils_1.ATTACH_FILE.toString();
    exports.extraFieldMap["fields"] = {
        'testCycle': {
            'labels': checkValueIsBankOrNot(utils_1.TEST_CYCLE_LABELS) !== '' ? utils_1.TEST_CYCLE_LABELS.split(',') : [],
            'components': checkValueIsBankOrNot(utils_1.TEST_CYCLE_COMPONENTS) ? utils_1.TEST_CYCLE_COMPONENTS.split(',') : [],
            'priority': checkValueIsBankOrNot(utils_1.TEST_CYCLE_PRIORITY),
            'status': checkValueIsBankOrNot(utils_1.TEST_CYCLE_STATUS),
            'sprintId': checkValueIsBankOrNot(utils_1.TEST_CYCLE_SPRINTID),
            'fixVersionId': checkValueIsBankOrNot(utils_1.TEST_CYCLE_FIXVERSIONID),
            'summary': checkValueIsBankOrNot(utils_1.TEST_CYCLE_SUMMARY) !== '' ? utils_1.TEST_CYCLE_SUMMARY : 'Automated Test Cycle',
            'description': checkValueIsBankOrNot(utils_1.TEST_CYCLE_DESCRIPTION),
            'assignee': checkValueIsBankOrNot(utils_1.TEST_CYCLE_ASSIGNEE),
            ... (checkValueIsBankOrNot(utils_1.TEST_CYCLE_CUSTOMFIELDS) !== '' && { 'customFields': JSON.parse(utils_1.TEST_CYCLE_CUSTOMFIELDS.toString()) })
        },
        'testCase': {
            'labels': checkValueIsBankOrNot(utils_1.TEST_CASE_LABELS) !== '' ? utils_1.TEST_CASE_LABELS.split(',') : [],
            'components': checkValueIsBankOrNot(utils_1.TEST_CASE_COMPONENTS) !== '' ? utils_1.TEST_CASE_COMPONENTS.split(',') : [],
            'priority': checkValueIsBankOrNot(utils_1.TEST_CASE_PRIORITY),
            'status': checkValueIsBankOrNot(utils_1.TEST_CASE_STATUS),
            'sprintId': checkValueIsBankOrNot(utils_1.TEST_CASE_SPRINTID),
            'fixVersionId': checkValueIsBankOrNot(utils_1.TEST_CASE_FIXVERSIONID),
            'description': checkValueIsBankOrNot(utils_1.TEST_CASE_DESCRIPTION),
            'assignee': checkValueIsBankOrNot(utils_1.TEST_CASE_ASSIGNEE),
            ... (checkValueIsBankOrNot(utils_1.TEST_CASE_CUSTOMFIELDS) !== '' && { 'customFields': JSON.parse(utils_1.TEST_CASE_CUSTOMFIELDS.toString()) })
        }
    };
}

function deleteZip(filePath) {
    let isDebug = exports.integrationProperties.get("automation.qmetry.debug");
    if (!isDebug && fs.exists(filePath)) {
        console.log("deleting Zip file...");
        fs.unlinkSync(filePath);
    }
}
if (utils_1.QMETRY_ENABLED && utils_1.QMETRY_ENABLED === true) {
    utils_1.ZipMaker(data => {
        if (data.success) {
            uploadResults(data.filePath, data => {
                console.log(JSON.stringify(data));
            });
        }
    });
}
else {
    console.log("Not Uploading Results as flag automation.qmetry.enabled is not set");
}
