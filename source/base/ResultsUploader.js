"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* Integration through qmetry.properties file */
const fs = require("fs-extra");
const path = require("path");
const request = require("request");
const utils_1 = require("./utils");
const ConfigurationManager_1 = require("./ConfigurationManager");
exports.extraFieldMap = {};
exports.integrationProperties = ConfigurationManager_1.ConfigurationManager.getIntegrationBundle();
function uploadResults(filePath, callback) {
    console.log("<<<<<<<<<<<<<<<<<<<<< Uploading Results >>>>>>>>>>>>>>>>");
    var option_new;
    var start = new Date().getTime();
    if (!utils_1.ON_PREMISE && utils_1.INTEGRATION_TYPE.toString().toLowerCase() === "qtm4j") {
        // FOR QTM4J CLOUD
        option_new = {
            method: "POST",
            url: utils_1.URL,
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                apiKey: utils_1.API_KEY,
                format: 'qas/json',
                isZip:true
            },
            json: true
        };
        option_new["body"]["testAssetHierarchy"] = utils_1.TEST_ASSET_HIERARCHY;
        option_new["body"]["testCaseUpdateLevel"] = utils_1.TEST_CASE_UPDATE_LEVEL;
        // delete extraFieldMap['testRunName'];
        option_new = getExtraFieldMap(option_new);
        console.log("Requesting With:::" +
            utils_1.INTEGRATION_TYPE +
            "::Cloud" +
            JSON.stringify(option_new));
        try {
            // url will not get for qtm4j cloud
            request(option_new, function requestTO(error, response, body) {
                console.log("Upload Result Response::QTM4J::Cloud:::" + JSON.stringify(response));
                if (response.body.isSuccess) {
                    doCloudCall(filePath, response, callback);
                }
                else {
                    callback({ success: false, errMessage: response.body.errorMessage });
                }
            });
        }
        catch (e) {
            callback({ success: false, errMessage: e });
        }
    }
    else {
        //FOR QTM4J server and QTM(CLound/Server)
        console.log("Uploading file name ::" + filePath);
        if (utils_1.INTEGRATION_TYPE.toString().toLowerCase() === "qtm") {
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
                        value: fs.createReadStream(filePath),
                        options: {
                            filename: path.basename(filePath),
                            contentType: null
                        }
                    },
                    entityType: 'QAF'
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
                    format: 'qas/json',
                }
            };
        }
        //options are created, now need to make a call
        option_new["formData"]["testAssetHierarchy"] = "TestCase-TestStep";
        option_new["formData"]["testCaseUpdateLevel"] = 1;
        option_new = getExtraFieldMap(option_new);
        console.log("Requesting With:::" +
            utils_1.INTEGRATION_TYPE +
            "::Server" +
            JSON.stringify(option_new));
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
function encodeBase64(username, pwd) {
    return Buffer.from(username + ":" + pwd).toString("base64");
}
exports.encodeBase64 = encodeBase64;
function getExtraFieldMap(option_new) {
    nonRequiredRequestParam();
    if (!utils_1.ON_PREMISE && utils_1.INTEGRATION_TYPE.toString().toLowerCase() === "qtm4j") {
        Object.keys(exports.extraFieldMap).forEach(function (key) {
            var val = exports.extraFieldMap[key];
            if (val !== "" && val !== undefined && val !== null && val !== 0) {
                option_new["body"][key] = val;
            }
        });
    }
    else {
        Object.keys(exports.extraFieldMap).forEach(function (key) {
            var val = exports.extraFieldMap[key];
            if (val !== "" && val !== undefined && val !== null && val !== 0) {
                option_new["formData"][key] = val;
            }
        });
    }
    return option_new;
}
function doCloudCall(filePath, response, callback) {
    console.log("IN CLOUD > ::: for " + response.body.url);
    var start = new Date().getTime();
    var option_new = {
        method: "PUT",
        url: response.body.url,
        headers: {
            "Content-Type": "multipart/form-data"
        },
        json: false,
        enconding: null,
        body: fs.readFileSync(filePath)
    };
    try {
        console.log(" OPTION <<<<<<<<<<<<<<" + JSON.stringify(option_new));
        request(option_new, function requestTO(error, response, body) {
            console.log("response :: %%%%%%%%%%%%%%%" + JSON.stringify(response));
            if (error) {
                console.log("ERROR :: %%%%%%%%%%%%%%%" + JSON.stringify(error));
                console.log("IN ERROR ::");
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
    if(!utils_1.ON_PREMISE && utils_1.INTEGRATION_TYPE.toString().toLowerCase() === "qtm4j")
    { exports.extraFieldMap["JIRAFields"] = JSON.parse(utils_1.JIRA_FIELS.toString());
    }else{exports.extraFieldMap["JIRAFields"] = utils_1.JIRA_FIELS;}
    exports.extraFieldMap["cycleID"] = utils_1.CYCLE_IDS;
    exports.extraFieldMap["platformID"] = utils_1.PLATFORM_ID;
    exports.extraFieldMap["testsuiteId"] = utils_1.TEST_SUITE_ID;
    exports.extraFieldMap["projectID"] = utils_1.PROJECT_ID;
    exports.extraFieldMap["releaseID"] = utils_1.REALEASE_ID;
    exports.extraFieldMap["buildID"] = utils_1.BUILD_ID;
    exports.extraFieldMap["testsuiteName"] = utils_1.TEST_SUITE_NAME;
}
function deleteZip(filePath) {
    let isDebug = exports.integrationProperties.get("automation.qmetry.debug");
    if (!isDebug && fs.exists(filePath)) {
        console.log("deleting Zip success....😲" + filePath);
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
