@author: rinkesh.jain
Feature: CucumberTestsuite

@CucumberScenario
Scenario Outline: Mobile Web Test case

  Given get "https://www.gmail.com"
  When clear "test"
  And sendkeys "demoqas2019@gmail.com" into "test"
  And click on "test1"
  Then verify "test" value is "demoqas2019@gmail.com"
  When click on "span.span1111_2"
  And clear "test2"
  And sendkeys "<Password>" into "test2"
  And click on "test3"
  Then verify "test2" value is "<Password>"
  When click on "span.span1111_1_1"


Examples:
    |Password|
    |test|
    |qastest|
    |QAS@2019|