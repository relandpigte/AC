Feature: Student project

  @UI @TestRails(C14812)
  Scenario: C14812	Verify student can able to view project details
    Given User is in academically login page
    When user register a student
    And user enter account details
      | Firstname      | Lastname | Email          | Date of Birth |
      | Automated83XXX | Test     | automated83XXX | 04/05/1981    |
    Then sent email modal is displayed
    And user activate account
    Then user is in complete registration form
    And email address "automated83XXX" matched
    When user enter password "Test@12345" and confirm passoword "Test@12345"
    And user register an account
    Then registered the account successfully
    When user enter username "automated83XXX" and password "Test@12345"
    Then user successfully login
    When user create a new project
    Then user is in service wizard page
    When user click request support
    And user select "Academic Support" service
    And user click continue to step2
    Then user is in step 2
    When user select "Post Graduate" level for the service
    And user click continue to step 3
    Then user in in step 3
    When user select "Academic Tutoring"
    And user click continue to step 4
    Then user is in step 4
    When user enter project name "Test Project XXX"
    Then user is in dashboard page
    When user navigate to my projects tab
    And user proceed to project "Test Project XXX"
    Then user is in proposal screen

    Scenario: C14813	Verify that student can able to view tutor offer	
    		
	Scenario: C14814	Verify student can book a session on payment page
   