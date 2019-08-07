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
const cucumber_1 = require("cucumber");
const protractor_1 = require("protractor");
const ConfigurationManager_1 = require("../source/base/ConfigurationManager");
const LocatorUtils_1 = require("../source/base/LocatorUtils");
let properties = ConfigurationManager_1.ConfigurationManager.getBundle();
const chai = require("chai").use(require("chai-as-promised"));
const expect = chai.expect;
let locatorUtil = new LocatorUtils_1.LocatorUtils();
cucumber_1.setDefaultTimeout(60 * 1000);
cucumber_1.defineStep(/get "(.*?)"$/, (url) => __awaiter(this, void 0, void 0, function* () {
    yield protractor_1.browser.get(url);
}));
cucumber_1.defineStep(/click on "(.*?)"$/, (locator) => __awaiter(this, void 0, void 0, function* () {
    yield protractor_1.element(locatorUtil.getLocator(locator).locator)
        .click()
        .then(() => { })
        .catch(err => {
        throw err;
    });
}));
cucumber_1.defineStep(/sendkeys "(.*?)" into "(.*?)"$/, (text, locator) => __awaiter(this, void 0, void 0, function* () {
    if (text.startsWith("${")) {
        text = properties.get(text.substring(2, text.length - 1));
    }
    yield protractor_1.element(locatorUtil.getLocator(locator).locator)
        .sendKeys(text)
        .then(() => { })
        .catch(err => {
        throw err;
    });
}));
cucumber_1.defineStep(/^clear "(.*?)"$/, (locator) => __awaiter(this, void 0, void 0, function* () {
    yield protractor_1.element(locatorUtil.getLocator(locator).locator)
        .clear()
        .then(() => { })
        .catch(err => {
        throw err;
    });
}));
cucumber_1.defineStep(/submit "(.*?)"$/, (locator) => __awaiter(this, void 0, void 0, function* () {
    yield protractor_1.element(locatorUtil.getLocator(locator).locator)
        .submit()
        .then(() => { })
        .catch(err => {
        throw err;
    });
}));
cucumber_1.defineStep(/mouse move on "(.*?)"$/, (locator) => __awaiter(this, void 0, void 0, function* () {
    yield protractor_1.browser
        .actions()
        .mouseMove(protractor_1.element(locatorUtil.getLocator(locator).locator))
        .perform()
        .then(() => { })
        .catch(err => {
        throw err;
    });
}));

function processValue(value) {
    if (value.startsWith("${")) {
        value = properties.get(value.substring(2, value.length - 1));
    }
    return value;
}
cucumber_1.defineStep(/^change locale to "(.*?)"$/, (locale) => __awaiter(this, void 0, void 0, function* () {
    ConfigurationManager_1.ConfigurationManager.defaultLocale = locale;
    ConfigurationManager_1.ConfigurationManager.setup();
}));
cucumber_1.defineStep(/^comment "(.*?)"$/, (value) => __awaiter(this, void 0, void 0, function* () {
    console.log("Comment ::: " + processValue(value));
}));
cucumber_1.defineStep(/Verify title is "(.*?)"$/, (expectedTitle) => __awaiter(this, void 0, void 0, function* () {
    yield expect(protractor_1.browser.getTitle()).to.eventually.equal(expectedTitle);
    // await browser
    //   .getTitle()
    //   .then(actualPageTitle => {
    //     chai.assert(expectedTitle === actualPageTitle, actualPageTitle + " should be " + expectedTitle + ", actual is " + actualPageTitle);
    //   })
    //   .catch(err => {
    //     throw err;
    //   });
}));
cucumber_1.defineStep(/verify "(.*?)" is present$/, (locator) => __awaiter(this, void 0, void 0, function* () {
    try {
        chai.assert(yield protractor_1.element(locatorUtil.getLocator(locator).locator).isPresent(), "Element should be not present");
    }
    catch (error) {
        throw error;
    }
}));
function ensureElementIsPresent(elmnt) {
    // waitForElement(element);
    return new Promise((resolve, reject) => {
        elmnt.isPresent().then(function (isPresent) {
            if (isPresent) {
                resolve();
            }
            else {
                reject(new Error("Element should be present"));
            }
        });
    });
}
/**
 * Waits for the element to be present and displayed on the page
 * @param {string} elementSelector
 */
function waitForElement(element) {
    protractor_1.browser.wait(protractor_1.ExpectedConditions.presenceOf(element));
}
cucumber_1.defineStep(/verify "(.*?)" is not present$/, (locator) => __awaiter(this, void 0, void 0, function* () {
    yield protractor_1.element(locatorUtil.getLocator(locator).locator)
        .isPresent()
        .then(function (isPresent) {
        if (isPresent) {
            chai.assert(false, "Element is present");
        }
        else {
            chai.assert(true, "Element should not be present");
        }
    })
        .catch(err => {
        throw err;
    });
}));
cucumber_1.defineStep(/verify "(.*?)" is visible$/, (locator) => __awaiter(this, void 0, void 0, function* () {
    yield protractor_1.element(locatorUtil.getLocator(locator).locator)
        .isPresent()
        .then(isPresent => {
        if (isPresent) {
            protractor_1.element(locatorUtil.getLocator(locator).locator)
                .isDisplayed()
                .then(function (isVisible) {
                if (isVisible) {
                    chai.assert(true, "Element is visible");
                }
                else {
                    chai.assert(false, "Element should not be visible");
                }
            })
                .catch(err => {
                throw err;
            });
        }
    })
        .catch((err) => {
        chai.assert(false, "Element is not present");
        throw err;
    });
}));
cucumber_1.defineStep(/verify "(.*?)" is not visible$/, (locator, callback) => {
    let elmnt = protractor_1.element(locatorUtil.getLocator(locator).locator);
    ensureElementIsPresent(elmnt).then(() => {
        try {
            protractor_1.element(locatorUtil.getLocator(locator).locator)
                .isDisplayed()
                .then(isVisible => {
                if (isVisible) {
                    chai.assert(false, "Element is visible");
                    callback(new Error("Element is visible"));
                }
                else {
                    chai.assert(true, "Element should not be visible");
                    callback();
                }
            })
                .catch(err => {
                callback(err);
            });
        }
        catch (error) {
            callback(error);
        }
    }).catch((err) => {
        callback(err);
    });
});
cucumber_1.defineStep(/verify "(.*?)" value is "(.*?)"$/, (locator, value) => __awaiter(this, void 0, void 0, function* () {
    if (value.startsWith("${")) {
        value = properties.get(value.substring(2, value.length - 1));
    }
    yield protractor_1.element(locatorUtil.getLocator(locator).locator)
        .getAttribute("value")
        .then(valueOfElement => {
        chai.assert(valueOfElement === value, "value of element should be " + value + ",actual is " + valueOfElement);
    });
}));
cucumber_1.defineStep(/verify "(.*?)" value is not "(.*?)"$/, (locator, value) => __awaiter(this, void 0, void 0, function* () {
    if (value.startsWith("${")) {
        value = properties.get(value.substring(2, value.length - 1));
    }
    yield protractor_1.element(locatorUtil.getLocator(locator).locator)
        .getAttribute("value")
        .then(valueOfElement => {
        chai.assert(valueOfElement !== value, "value of element should not be " + value + ",actual is " + valueOfElement);
    });
}));
cucumber_1.defineStep(/verify "(.*?)" text is "(.*?)"$/, (locator, expectedText, callback) => {
    let elmnt = protractor_1.element(locatorUtil.getLocator(locator).locator);
    ensureElementIsPresent(elmnt).then(() => {
        if (expectedText.startsWith("${")) {
            expectedText = properties.get(expectedText.substring(2, expectedText.length - 1));
        }
        elmnt
            .getText()
            .then(actualText => {
            try {
                chai.assert(actualText === expectedText, actualText + " should be " + expectedText + ", actual is " + actualText);
                callback();
            }
            catch (error) {
                callback(error);
            }
        });
    }).catch((err) => {
        callback(err);
    });
});
cucumber_1.defineStep(/verify "(.*?)" text is not "(.*?)"$/, (locator, expectedText, callback) => {
    let elmnt = protractor_1.element(locatorUtil.getLocator(locator).locator);
    ensureElementIsPresent(elmnt).then(() => {
        if (expectedText.startsWith("${")) {
            expectedText = properties.get(expectedText.substring(2, expectedText.length - 1));
        }
        elmnt
            .getText()
            .then(actualText => {
            try {
                chai.assert(actualText !== expectedText, actualText + " should not be " + expectedText + ", actual is " + actualText);
                callback();
            }
            catch (error) {
                callback(error);
            }
        });
    }).catch((err) => {
        callback(err);
    });
});
cucumber_1.defineStep(/verify link with text "(.*?)" is present$/, (link, callback) => {
    let elmnt = protractor_1.element(protractor_1.by.linkText(link));
    expect(elmnt.isPresent()).to.eventually.equal(true).and.notify(callback);
    // ensureElementIsPresent(elmnt).then(() => {
    // }).catch((err) => {
    //   callback(err);
    // })
});
cucumber_1.defineStep(/verify link with partial text "(.*?)" is present$/, (link, callback) => {
    let elmnt = protractor_1.element(protractor_1.by.partialLinkText(link));
    expect(elmnt.isPresent()).to.eventually.equal(true).and.notify(callback);
    // ensureElementIsPresent(elmnt).then(() => {
    // }).catch((err) => {
    //   callback(err);
    // })
});
cucumber_1.defineStep(/switch to frame "(.*?)"$/, (nameOrIndex) => __awaiter(this, void 0, void 0, function* () {
    try {
        let ele = protractor_1.element(locatorUtil.getLocator(nameOrIndex).locator).getWebElement();
        yield protractor_1.browser.switchTo().frame(ele);
    }
    catch (error) {
        yield protractor_1.browser.switchTo().frame(nameOrIndex);
    }
}));
cucumber_1.defineStep(/switch to default content$/, () => __awaiter(this, void 0, void 0, function* () {
    yield protractor_1.browser.switchTo().defaultContent();
}));
cucumber_1.defineStep(/wait until "(.*?)" to be present$/, (loc) => __awaiter(this, void 0, void 0, function* () {
    let ele = protractor_1.element(locatorUtil.getLocator(loc).locator);
    yield protractor_1.browser.wait(protractor_1.ExpectedConditions.presenceOf(ele), 5000, "Element taking too long to appear in the DOM");
}));
cucumber_1.defineStep(/wait until "(.*?)" to be visible$/, (loc) => __awaiter(this, void 0, void 0, function* () {
    let ele = protractor_1.element(locatorUtil.getLocator(loc).locator);
    yield protractor_1.browser.driver.wait(protractor_1.ExpectedConditions.visibilityOf(ele), 5000, "Element taking too long to appear in the DOM");
}));
