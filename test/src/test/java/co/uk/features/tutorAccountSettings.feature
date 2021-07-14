Feature: Tutor account settings

  @UI @TestRails(C14579)
  Scenario: C14579 - Verify editing general information
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated72XXX | Test    | automated72XXX | Test@12345 | automated72XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated72XXX" and password "Test@12345"
    Then user successfully login
    When user proceed to account settings
    Then the user is in the account settings general tab
    When user enter general information
      | First name | Last name | Date of birth | Dial code    | Phone number | Email | Timezone                                                     | Country        | Address 1     | Address 2       | City   | Zip code | Province |
      | Brunce     | Wayne     | 07/05/1986    | TestdialCode | Testnumber   | null  | (UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna | United Kingdom | Londonwriteup | 21 Hanover Road | London | NW10 3DR | Brent    |
    And user saving general information
    And user proceed to the dashboard page
    Then user is in dashboard page
    When user proceed to account settings
    Then the all details in general information are correct
      | First name | Last name | Date of birth | Dial code    | Phone number | Email | Timezone                                                     | Country        | Address 1     | Address 2       | City   | Zip code | Province |
      | Brunce     | Wayne     | 07/05/1986    | TestdialCode | Testnumber   | null  | (UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna | United Kingdom | Londonwriteup | 21 Hanover Road | London | NW10 3DR | Brent    |

  @UI @TestRails(C14580)
  Scenario: C14580 - Verify changing password using invalid current password
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated73XXX | Test    | automated73XXX | Test@12345 | automated73XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated73XXX" and password "Test@12345"
    Then user successfully login
    When user proceed to account settings
    Then the user is in the account settings general tab
    When user proceed to security tab
    Then user is in security tab
    When user enter invalid current password "Test@11111"
    And user enter a new password "Test@22222"
    And user update the password
    Then existing password did not match the one on record message is displayed

  @UI @TestRails(C14581)
  Scenario: C14581 - Verify changing password
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated74XXX | Test    | automated74XXX | Test@12345 | automated74XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated74XXX" and password "Test@12345"
    Then user successfully login
    When user proceed to account settings
    Then the user is in the account settings general tab
    When user proceed to security tab
    Then user is in security tab
    When user enter current password "Test@12345"
    And user enter a new password "Test@22222"
    And user update the password
    And user logout in academically
    Then user is in academically login page
    When user enter username "automated74XXX" and password "Test@22222"
    Then user successfully login
