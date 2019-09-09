@author: rinkesh.jain
Feature: CucumberTestsuite

@CucumberScenario
Scenario Outline: Web Test case

  Given get "https://www.gmail.com"
  When clear "email.identifierid"
  And sendkeys "demoqas2019@gmail.com" into "email.identifierid"
  And click on "div.div111"
  Then verify "email.identifierid" value is "demoqas2019@gmail.com"
  When click on "span.span1111"
  And clear "password.qas2019"
  And sendkeys "<Password>" into "password.qas2019"
  Then verify "password.qas2019" value is "<Password>"


Examples:
    |Data-1|Data-2|Password|
    |||test|
    |||qastest|
    |||QAS@2019|