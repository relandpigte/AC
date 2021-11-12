Feature: Tutor project
	
	@UI  @TestRails(C14830)
  Scenario: C14830	Verify tutor can not send multiple offers for the same project
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated84XXX | Test    | automated84XXX | Test@12345 | automated84XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated84XXX" and password "Test@12345"
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
    When user enter project name "Test Project 84XXX"
   	Then user is in dashboard page
   	When user navigate to my projects tab
   	And user proceed to project "Test Project 84XXX"
   	Then user is in proposal screen
   	When user logout in academically
    Then user is in academically login page
    When user login as "tutor"
    Then user successfully login
   	When user see all projects
   	Then user in in find work screen
   	And project name "Test Project 84XXX" is displayed
   	When user view a full details of the project "Test Project 84XXX"
   	Then project details modal is displayed
   	When tutor make an offer
   	 | Price per hour  | Discounted number of hours  | Discounted price per hour | Free interview| 
     | 15              | 1                           | 18                        | Yes           |
    And user close the offer modal
    And user proceed to the dashboard page
    Then user is in dashboard page
    When user see all projects
   	Then user in in find work screen
   	And project name "Test Project 84XXX" is displayed
   	When user view a full details of the project "Test Project 84XXX"
   	Then project details modal is displayed
   	And proposal already sent button is displayed