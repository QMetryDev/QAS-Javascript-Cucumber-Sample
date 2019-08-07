"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigurationManager_1 = require("./ConfigurationManager");
const fs = require('fs');
const zip = require('zip-folder');
let integrationProperties = ConfigurationManager_1.ConfigurationManager.getIntegrationBundle();
exports.QMETRY_ENABLED = integrationProperties.get('automation.qmetry.enabled') !== null ? integrationProperties.get('automation.qmetry.enabled') : '';
exports.INTEGRATION_TYPE = integrationProperties.get('automation.qmetry.type') !== null ? integrationProperties.get('automation.qmetry.type') : '';
exports.ON_PREMISE = integrationProperties.get('automation.qmetry.onpremise') !== null ? integrationProperties.get('automation.qmetry.onpremise') : '';
exports.URL = integrationProperties.get('automation.qmetry.url') !== null ? integrationProperties.get('automation.qmetry.url') : '';
exports.API_KEY = integrationProperties.get('automation.qmetry.apikey') !== null ? integrationProperties.get('automation.qmetry.apikey') : '';
exports.USERNAME = integrationProperties.get('automation.qmetry.username') !== null ? integrationProperties.get('automation.qmetry.username') : '';
exports.PASSWORD = integrationProperties.get('automation.qmetry.password') !== null ? integrationProperties.get('automation.qmetry.password') : '';
exports.ALIAS_NAME = integrationProperties.get('automation.qmetry.aliasName') !== null ? integrationProperties.get('automation.qmetry.aliasName') : '';
exports.ALIAS = integrationProperties.get('automation.qmetry.Alias') !== null ? integrationProperties.get('automation.qmetry.Alias') : '';
exports.TEST_RUN_NAME = integrationProperties.get('automation.qmetry.testrunname') !== null ? integrationProperties.get('automation.qmetry.testrunname') : '';
exports.LABELS = integrationProperties.get('automation.qmetry.labels') !== null ? integrationProperties.get('automation.qmetry.labels') : '';
exports.COMPONENTS = integrationProperties.get('automation.qmetry.components') !== null ? integrationProperties.get('automation.qmetry.components') : '';
exports.VERSION = integrationProperties.get('automation.qmetry.version') !== null ? integrationProperties.get('automation.qmetry.version') : '';
exports.SPRINT = integrationProperties.get('automation.qmetry.sprint') !== null ? integrationProperties.get('automation.qmetry.sprint') : '';
exports.PLATFORM = integrationProperties.get('automation.qmetry.platform') !== null ? integrationProperties.get('automation.qmetry.platform') : '';
exports.COMMENT = integrationProperties.get('automation.qmetry.comment') !== null ? integrationProperties.get('automation.qmetry.comment') : '';
exports.TEST_RUN_KEY = integrationProperties.get('automation.qmetry.testrunkey') !== null ? integrationProperties.get('automation.qmetry.testrunkey') : '';
exports.TEST_ASSET_HIERARCHY = integrationProperties.get('automation.qmetry.testassethierarchy') !== null && (integrationProperties.get('automation.qmetry.testassethierarchy')) !==0 ? integrationProperties.get('automation.qmetry.testassethierarchy') : 'TestCase-TestStep';
exports.JIRA_FIELS = integrationProperties.get('automation.qmetry.jirafields') !== null ? integrationProperties.get('automation.qmetry.jirafields') : '';
exports.DEBUG = integrationProperties.get('automation.qmetry.debug') !== null ? integrationProperties.get('automation.qmetry.debug') : '';
exports.ATTACH_FILE = integrationProperties.get('automation.qmetry.attachfile') !== null ? integrationProperties.get('automation.qmetry.attachfile') : '';
exports.TEST_CASE_UPDATE_LEVEL = integrationProperties.get('automation.qmetry.testcaseupdatelevel') !== null ? integrationProperties.get('automation.qmetry.testcaseupdatelevel') : '';
exports.CYCLE_IDS = integrationProperties.get('automation.qmetry.cycleid') !== null ? integrationProperties.get('automation.qmetry.cycleid') : '';
exports.PLATFORM_ID = integrationProperties.get('automation.qmetry.platformid') !== null ? integrationProperties.get('automation.qmetry.platformid') : '';
exports.TEST_SUITE_ID = integrationProperties.get('automation.qmetry.testsuiteid') !== null ? integrationProperties.get('automation.qmetry.testsuiteid') : '';
exports.PROJECT_ID = integrationProperties.get('automation.qmetry.projectid') !== null ? integrationProperties.get('automation.qmetry.projectid') : '';
exports.REALEASE_ID = integrationProperties.get('automation.qmetry.releaseid') !== null ? integrationProperties.get('automation.qmetry.releaseid') : '';
exports.BUILD_ID = integrationProperties.get('automation.qmetry.buildid') !== null ? integrationProperties.get('automation.qmetry.buildid') : '';
exports.FORMAT = integrationProperties.get('automation.qmetry.format') !== null ? integrationProperties.get('automation.qmetry.format') : '';
exports.ENTITY_TYPE = integrationProperties.get('automation.qmetry.entityType') !== null ? integrationProperties.get('automation.qmetry.entityType') : 'CUCUMBER';
exports.TEST_SUITE_NAME = integrationProperties.get('automation.qmetry.testsuitename') !== null ? integrationProperties.get('automation.qmetry.testsuitename') : '';
exports.testResultsPath = './test-results/';
exports.latestCreatedZip = '';
function ZipMaker(callback) {
    fs.readdir(exports.testResultsPath, function (err, files) {
        if (err) {
            console.log('error while zip directory:' + err);
            throw err;
        }
        var latestDir = exports.testResultsPath + getNewestFile(files, exports.testResultsPath);
        console.log('latestDir::' + latestDir);
        exports.latestCreatedZip = latestDir + '.zip';
        zip(latestDir + '/json/', exports.latestCreatedZip, function (err) {
            if (err) {
                console.log('oh!!!.... zip error', err);
            }
            else {
                console.log('zip created successfully...🙂');
                callback({ success: true, filePath: exports.latestCreatedZip });
            }
        });
    });
    function getNewestFile(files, path) {
        var out = [];
        files.forEach(function (file) {
            var stats = fs.statSync(path + '/' + file);
            if (stats.isDirectory()) {
                out.push({ file: file, mtime: stats.mtime.getTime() });
            }
        });
        out.sort(function (a, b) {
            return b.mtime - a.mtime;
        });
        return out.length > 0 ? out[0].file : '';
    }
}
exports.ZipMaker = ZipMaker;
