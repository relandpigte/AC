Feature: Tutor calendar

  @UI @TestRails(14821) @Parallel
  Scenario: C14821	- Verify tutor viewing own calendar
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated97XXX | Test    | automated97XXX | Test@12345 | automated97XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated97XXX" and password "Test@12345"
    Then user successfully login
    When user proceed to the calendar
    Then user is on the tutor calendar

  @??
  Scenario: C14726	- Verify blocking out dates and times - draft

  @UI @TestRails(14800) @Parallel
  Scenario: C14800	- Verify dropdown showing past sessions and upcoming sessions
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated98XXX | Test    | automated98XXX | Test@12345 | automated98XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated98XXX" and password "Test@12345"
    Then user successfully login
    When user proceed to the calendar
    Then user is on the student calendar
    When user click session dropdown on student calendar
    Then "Past Sessions" and "Upcoming Sessions" are displayed

  Scenario: C14801	- Verify that user should see a scroll-able list of past sessions

  Scenario: C14802	- Verify that user should see a scroll-able list of upcoming sessions

  Scenario: C14803	- Verify that the user can view the session details in the list

  Scenario: C14823	- Verify tutor can accepts the suggested a new time

  Scenario: C14824	- Verify tutor can declines the suggested a new time

  Scenario: C14825	- Verify tutor can able to suggest a new time

  Scenario: C14839	- Verify tutor can able to suggest a new time for a session previously accepted

  Scenario: C14832	- Verify that the tutor can accept the booking request

  Scenario: C14835	- Verify that the tutor should receive an email after accepting the book request

  Scenario: C14833	- Verify that the tutor can cancel a session for a session previously accepted

  Scenario: C14836	- Verify that the tutor should receive an email confirming the session cancellation

  Scenario: C14844	- Verify that the user can view a session in the upcoming / previous sessions list

  Scenario: C14845	- Verify past sessions are displayed

  Scenario: C14846	- Verify upcoming sessions are displayed

  Scenario: C14848	- Verify the current time indicator on the calendar

  Scenario: C14987	- Verify that tutor can able to select times -draft
