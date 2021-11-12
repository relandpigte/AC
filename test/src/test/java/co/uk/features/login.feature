Feature: Login Functionality

  @UI  @TestRails(14475)
  Scenario: C14475 - Verify the login of a student with valid credentials
    Given User is in academically login page
    When user login with valid credentials
    Then user successfully login

  @UI  @TestRails(14476)
  Scenario: C14476 - Verify the login of a student with invalid credentials
    Given User is in academically login page
    When user enter username "admin@weqwe.com" and password "pass123"
    Then user is not successfully login

  @UI  @TestRails(14543)
  Scenario: C14543 - Verify login a tutor using invalid credentials
    Given User is in academically login page
    When user login as "tutor"
    Then user successfully login

  @UI  @TestRails(14544)
  Scenario: C14544 - Verify login a tutor using valid credentials
    Given User is in academically login page
    When user enter username "tutor@academically.33mail.com" and password "Test123456"
    Then user is not successfully login

  @UI  @TestRails(14629)
  Scenario: C14629 - Verify login a admin using invalid credentials
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login

  @UI  @TestRails(14630)
  Scenario: C14630 - Verify login a admin using valid credentials
    Given User is in academically login page
    When user enter username "Admin" and password "Test123456"
    Then user is not successfully login
