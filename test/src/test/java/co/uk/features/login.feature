Feature: Login Functionality

  @UI @TestRails(14475)
  Scenario: C14475 - Verify the login of a student with valid credentials
    Given User is in academically login page
    When user login with valid credentials
    Then user successfully login

  @UI @TestRails(14476)
  Scenario: C14476 - Verify the login of a student with invalid credentials
    Given User is in academically login page
    When user enter username "admin@weqwe.com" and password "pass123"
    Then user is not successfully login
