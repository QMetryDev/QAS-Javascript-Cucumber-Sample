@author: nidhi.shah
Feature: mobileweb

@CucumberScenario
Scenario Outline: VerifyLogin

  # Navigate to app URL
  Given get "https://qas.qmetry.com/bank/"

  # Login
  When clear "text.txtusername"
  And sendkeys "<username>" into "text.txtusername"
  And clear "password.txtpassword"
  And sendkeys "<password>" into "password.txtpassword"
  And click on "button.btnlogin"

  # verify successful transaction
  Then verify "div.div" is present
  
  # logout
  And wait until "button.button" to be visible
  
  
Examples:
    |username|password|
    |Bob|Bob|