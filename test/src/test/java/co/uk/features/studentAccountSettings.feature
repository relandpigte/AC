Feature: Student account settings

  @Adhoc
  Scenario: C14493 - Verify editing general information
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated69XXX | Test    | automated69XXX | Test@12345 | automated69XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated69XXX" and password "Test@12345"
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

  Scenario: C14494 - Verify changing password using invalid current password
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated70XXX | Test    | automated70XXX | Test@12345 | automated70XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated70XXX" and password "Test@12345"
    Then user successfully login
    When user proceed to account settings
    Then the user is in the account settings general tab
    When user proceed to security tab
    Then user is in security tab
    And user enter invalid current password
    #Enter invalid current password
    And user enter a new password
    #Enter new password
    #Enter confirm new password
    #Click update password
    Then existing password' did not match the one on record message is displayed

  Scenario: C14495 - Verify changing password
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated71XXX | Test    | automated71XXX | Test@12345 | automated71XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated71XXX" and password "Test@12345"
    Then user successfully login
    When user proceed to account settings
    Then the user is in the account settings general tab
    When user proceed to security tab
    Then user is in security tab
