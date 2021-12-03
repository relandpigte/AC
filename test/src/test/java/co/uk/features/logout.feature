Feature: Logout

  @UI  @TestRails(14607) @Parallel
  Scenario: C14607	Verify student logout
    Given User is in academically login page
    When user login as "student"
    Then user successfully login
    When user logout in academically
    Then user is in academically login page

  @UI  @TestRails(14578) @Parallel
  Scenario: C14578	Verify tutor logout
    Given User is in academically login page
    When user login as "tutor"
    Then user successfully login
    When user logout in academically
    Then user is in academically login page

  @UI  @TestRails(14606) @Parallel
  Scenario: C14606	Verify admin logout
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user logout in academically
    Then user is in academically login page

  @UI  @TestRails(14789) @Parallel
  Scenario: C14789 - Verify super admin logout
    Given User is in academically login page
    When user login as "superadmin"
    Then user successfully login
    When user logout in academically
    Then user is in academically login page
