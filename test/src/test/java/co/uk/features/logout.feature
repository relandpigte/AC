Feature: Logout

  @UI  @TestRails(14607)
  Scenario: C14607	Verify student logout
    Given User is in academically login page
    When user login as "student"
    Then user successfully login
    When user logout in academically
    Then user is in academically login page

  @UI  @TestRails(14578)
  Scenario: C14578	Verify tutor logout
    Given User is in academically login page
    When user login as "tutor"
    Then user successfully login
    When user logout in academically
    Then user is in academically login page

  @UI  @TestRails(14606)
  Scenario: C14606	Verify admin logout
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user logout in academically
    Then user is in academically login page

  @UI  @TestRails(14789)
  Scenario: C14789 - Verify super admin logout
    Given User is in academically login page
    When user login as "superadmin"
    Then user successfully login
    When user logout in academically
    Then user is in academically login page
