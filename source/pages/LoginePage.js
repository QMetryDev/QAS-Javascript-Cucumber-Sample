"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_1 = require("protractor");
const LocatorUtils_1 = require("../base/LocatorUtils");
let locatorUtil = new LocatorUtils_1.LocatorUtils();
class LoginPage {
    constructor() {
        this.username = protractor_1.element(locatorUtil.getLocator("username.input").locator);
        this.password = protractor_1.element(locatorUtil.getLocator("password.input").locator);
        this.loginbutton = protractor_1.element(locatorUtil.getLocator("login.form").locator);
    }
}
exports.LoginPage = LoginPage;
