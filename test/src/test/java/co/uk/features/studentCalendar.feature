Feature: Student calendar

  Scenario: C14699 - Verify viewing tutors calendar

  Scenario: C14700	- Verify selecting a session from the tutors calendar

	@UI @Adhoc  @TestRails(14727)
  Scenario: C14727	- Verify student viewing own calendar
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated94XXX | Test    | automated94XXX | Test@12345 | automated94XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated94XXX" and password "Test@12345"
    Then user successfully login
		When user proceed to the calendar
		Then user is on the student calendar
		
	@UI @Adhoc  @TestRails(14795)	
  Scenario: C14795	- Verify upcoming sessions is default
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated95XXX | Test    | automated95XXX | Test@12345 | automated95XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated95XXX" and password "Test@12345"
    Then user successfully login
		When user proceed to the calendar
		Then user is on the student calendar
		And the default is "Upcoming Sessions" on student calendar
	@UI @Adhoc  @TestRails(14796)	
  Scenario: C14796	- Verify dropdown showing past sessions and upcoming sessions
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated96XXX | Test    | automated96XXX | Test@12345 | automated96XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated96XXX" and password "Test@12345"
    Then user successfully login
		When user proceed to the calendar
		Then user is on the student calendar
		When user click session dropdown on student calendar
		Then "Past Sessions" and "Upcoming Sessions" are displayed

  Scenario: C14797	- Verify that user should see a scroll-able list of past sessions
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated99XXX | Test    | automated99XXX | Test@12345 | automated99XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    
    When user enter username "automated99XXX" and password "Test@12345"
    Then user successfully login

    When user create a new project
    Then user is in service wizard page
    When user click request support
    And user select "Academic Support" service
    And user click continue to step2
    Then user is in step 2
    When user select "Graduate" level for the service
    And user click continue to step 3
    Then user in in step 3
    When user select "Academic Tutoring"
    And user click continue to step 4
    Then user is in step 4
    When user enter project name "Test Project 99XXX"
    Then user is in dashboard page
    
    
		When user proceed to the calendar
		Then user is on the student calendar
		When user click session dropdown on student calendar
		Then "Past Sessions" and "Upcoming Sessions" are displayed
		
		
  Scenario: C14798	- Verify that user should see a scroll-able list of upcoming sessions

  Scenario: C14799	- Verify that the user can view the session details in the list

  Scenario: C14818	- Verify student can able to set title for the booking

  Scenario: C14819	- Verify that the student cannot book a session with a duration of less than 1 hour

  Scenario: C14820	- Verify student can set start time and end time using 24 hour time format

  Scenario: C14826	- Verify student can accepts the suggested new time

  Scenario: C14827	- Verify student can declines the suggested new time

  Scenario: C14828	- Verify student can able to suggest new time

  Scenario: C14840	- Verify that the student can still suggest a new time if the instructor also suggests a new time

  Scenario: C14841	- Verify upcoming sessions are displayed

  Scenario: C14842	- Verify past sessions are displayed

  Scenario: C14843	- Verify that the user can view a session in the upcoming / previous sessions list

  Scenario: C14847	- Verify the current time indicator on the calendar

  Scenario: C15000	- Verify that the student can book additional items in the calendar
  
