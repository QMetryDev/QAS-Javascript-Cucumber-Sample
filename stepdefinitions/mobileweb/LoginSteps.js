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
const LoginePage_1 = require("../../source/pages/LoginePage");
const { Given } = require("cucumber");
const chai = require("chai").use(require("chai-as-promised"));
const expect = chai.expect;
Given(/^login with "(.*?)" and "(.*?)"$/, (username, password) => __awaiter(this, void 0, void 0, function* () {
    const loginPage = new LoginePage_1.LoginPage();
    //mobile web specific login method implementation
    yield loginPage.username.sendKeys(username);
    yield loginPage.password.sendKeys(password);
    yield loginPage.loginbutton.submit();
}));
