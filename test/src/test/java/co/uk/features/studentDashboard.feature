Feature: Dashboard

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
    
  @??
	Scenario: C14619 - Verify phone number
	Scenario: C14620 - Verify the phone verification code with an invalid code 
	@UI @TestRails(C14489)
	Scenario: C14489 - Verify user profile widget is displayed
	  Given User is in academically login page
    When user login as "student"
    Then user successfully login
    And user profile widget is displayed on the dashboard
    And "Student" type is displayed
   @WW
	Scenario: C14849 - Verify that the student can see the next 3 upcoming sessions
	   Given User is in academically login page
    When user register a student
    And user enter account details
      | Firstname      | Lastname | Email          | Date of Birth |
      | Automated85XXX | Test     | automated85XXX | 04/02/1971    |
    Then sent email modal is displayed
    And user activate account
    Then user is in complete registration form
    And email address "automated85XXX" matched
    When user enter password "Test@12345" and confirm passoword "Test@12345"
    And user register an account
    Then registered the account successfully
    When user enter username "automated85XXX" and password "Test@12345"
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
    When user enter project name "Test Project 85XXX"
    Then user is in dashboard page
    When user navigate to my projects tab
    And user proceed to project "Test Project 85XXX"
    Then user is in proposal screen
    When user logout in academically
    Then user is in academically login page
    When user login as "tutor"
    Then user successfully login
    When user see all projects
    Then user in in find work screen
    And project name "Test Project 85XXX" is displayed
    When user view a full details of the project "Test Project 85XXX"
    Then project details modal is displayed
    When tutor make an offer
      | Price per hour | Discounted number of hours | Discounted price per hour | Free interview |
      |             15 |                          1 |                        18 | Yes            |
    And user close the offer modal
    And user proceed to the dashboard page
    When user logout in academically
    Then user is in academically login page
     When user enter username "automated85XXX" and password "Test@12345"
    Then user successfully login
     When user navigate to my projects tab
    And user proceed to project "Test Project 85XXX"
    Then user is in proposal screen
    #
    When the user views the full details of "Tutor" offer
    Then the user has successfully viewed the tutor offer
    
	 			
	Scenario: C14851 - Verify that the student sees the last 3 projects on the dashboard 
