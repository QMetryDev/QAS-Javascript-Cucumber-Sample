"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_1 = require("protractor");
const LocatorUtils_1 = require("../base/LocatorUtils");
let locatorUtil = new LocatorUtils_1.LocatorUtils();
class LoginPage {
    constructor() {
        this.username = protractor_1.element(locatorUtil.getLocator("username.input"));
        this.password = protractor_1.element(locatorUtil.getLocator("password.input"));
        this.loginbutton = protractor_1.element(locatorUtil.getLocator("login.form"));
    }
}
exports.LoginPage = LoginPage;
