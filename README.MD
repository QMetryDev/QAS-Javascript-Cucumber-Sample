
# Javascript Cucumber
### To Get Started

#### Pre-requisites
1.NodeJS installed globally in the system.
https://nodejs.org/en/download/

2.Chrome or Firefox browsers installed.

```
npm install
npm install -g protractor
npm install -g tsc
```
* All the dependencies from package.json and ambient typings would be installed in node_modules folder.

#### Run Scripts

* First step is to fire up the selenium server which could be done in many ways,  **webdriver-manager** proves very handy for this.The below command should download the **chrome & gecko driver** binaries locally for you!

```
npm run webdriver-update
```

* If your machine's chrome browser version is not latest one then kindly execute given command

```
npm run updatechrome
```

* Now just run the test command which launches the Chrome Browser and runs the scripts.
```
npm run test
```
![result](https://raw.githubusercontent.com/igniteram/protractor-cucumber-typescript/master/images/protractor-cucumber-typescript-result.gif)

#### Writing steps
```
describe("Test Suite", function () {
    protractor_1.browser.waitForAngularEnabled(false);
    protractor_1.browser.get(protractor_1.browser.baseUrl);
    it("test case name", function () {
        actions.get("http://www.amazon.in");
        actions.click("xpath=//a[@id='nav-link-yourAccount']/span[2]");
        actions.sendKeys("id=ap_email", "amazontest@gmail.com");
        actions.click("xpath=//input[@id='continue']");
        actions.sendKeys("id=ap_password", "12345");
        actions.click("xpath=//input[@id='continue']");
    });
});
```
#### Writing Step Definitions
```
For step defination  follow '..\base\commonsteps.js'

```
#### HTML Reports
Report is generated in the `test-results` folder when you run `npm run test`.


#### Upload Reports
To upload reports to QTM or QTM4J run below command
`npm run uploadresults`
