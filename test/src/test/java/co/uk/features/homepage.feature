Feature: Title of your feature

  @UI @TestRails(14484)
  Scenario: C14484 - Verify menu items on the dashboard as student
    Given User is in academically login page
    When user login as "student"
    Then user successfully login
    And overview, my project and usage tab are displayed

  @UI @TestRails(14485)
  Scenario: C14485 - Verify create new project on the dashboard is displayed
    Given User is in academically login page
    When user login as "student"
    Then user successfully login
    And create new project is displayed on the dashboard

  @UI @TestRails(14486)
  Scenario: C14486 - Verify recent project and activity are displayed as student
    Given User is in academically login page
    When user login as "student"
    Then user successfully login
    And overview, my project and usage tab are displayed
    When user navigate to overview tab
    Then user should see recent project and recent activity

  @UI @TestRails(14487)
  Scenario: C14487 - Verify view all projects on the dashboard
    Given User is in academically login page
    When user login as "student"
    Then user successfully login
    And overview, my project and usage tab are displayed
    When user navigate to my projects tab
    Then user should see all projects

  @UI @TestRails(14488)
  Scenario: C14488 - Verify usage information is displayed
    Given User is in academically login page
    When user login as "student"
    Then user successfully login
    And overview, my project and usage tab are displayed
    When user navigate to usage tab
    Then user is in usage information
    And user should see actual total hours
    And user should see all total projects
    And user should see overview graph

  @NOT
  Scenario: C14489 - Verify user profile widget is displayed
    Given User is in academically login page
    When user register a student
    And user enter account details
      | Firstname | Lastname | Email        | Date of Birth |
      | Benjamin  | Franklin | automatedXXX | 04/02/1981    |
    Then sent email modal is displayed
    And user activate account
    Then user is in complete registration form
    And email address "automatedXXX" matched
    When user enter password "Test@12345" and confirm passoword "Test@12345"
    And user register an account
    Then registered the account successfully
    When user enter username "automatedXXX" and password "Test@12345"
    Then user successfully login
    And user profile widget is displayed on the dashboard
    And profile widget information is displayed

  #- Verify profile picture is displayed
  #- Verify background image is displayed
  #- Verify student name is displayed
  #- Verify university name is displayed
  #- Verify user type is displayed
  @UI @TestRails(14490)
  Scenario: C14490 - Verify user verification widget is displayed
    Given User is in academically login page
    When user login as "student"
    Then user successfully login
    And verification widget is displayed on the dashboard
    And see a list of verification

  @UI @TestRails(14492)
  Scenario: C14492 - Verify key four key metrics is displayed
    Given User is in academically login page
    When user login as "student"
    Then user successfully login
    And four key metrics is displayed on the dashboard

  @UI @TestRails(14491)
  Scenario: C14491- Verify account settings is displayed
    Given User is in academically login page
    When user login as "student"
    Then user successfully login
    When user navigate to profile menu
    Then account settings is displayed
