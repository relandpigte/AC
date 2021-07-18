Feature: Create new project

  @UI @TestRails(14773)
  Scenario: C14773 - Verify service wizard page is displayed
    Given User is in academically login page
    When user login as "student"
    Then user successfully login
    When user create a new project
    Then user is in service wizard page

  @UI @TestRails(14774)
  Scenario: C14774 - Verify that user can able to select a service
    Given User is in academically login page
    When user login as "student"
    Then user successfully login
    When user create a new project
    Then user is in service wizard page
    When user click request support
    And user select "Academic Support" service
    And user click continue to step2
    Then user is in step 2

  @UI @TestRails(14775)
  Scenario: C14775 - Verify user can able to select a level for the service
    Given User is in academically login page
    When user login as "student"
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

  @UI @TestRails(14776)
  Scenario: C14776 - Verify the level options are displayed
    Given User is in academically login page
    When user login as "student"
    Then user successfully login
    When user create a new project
    Then user is in service wizard page
    When user click request support
    And user select "Academic Support" service
    And user click continue to step2
    Then user is in step 2
    And the "High School" level is displyed
    And the "Pre Degree" level is displyed
    And the "Undergraduate" level is displyed
    And the "Graduate" level is displyed
    And the "Post Graduate" level is displyed
    And the "Doctorate" level is displyed

  @UI @TestRails(14788)
  Scenario: C14788 - Verify the service category options are displayed
    Given User is in academically login page
    When user login as "student"
    Then user successfully login
    When user create a new project
    Then user is in service wizard page
    When user click request support
    Then the service "University Admissions" is displayed
    And the service "Academic English Coaching" is displayed
    And the service "Academic Support" is displayed
    And the service "Career Consultancy" is displayed
    And the service "English Language Test for Professionals Coaching" is displayed
    And the service "Guardianship" is displayed
    And the service "Language Tutoring" is displayed
    And the service "School Admissions" is displayed
    And the service "Study Skills" is displayed
    And the service "Visa Application Consultancy" is displayed

  @UI @TestRails(14778)
  Scenario: C14778 - Verify page 3 of the wizard be able to navigate and select a single service
    Given User is in academically login page
    When user login as "student"
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
    
     @UI @TestRails(C14790)
    Scenario: C14790 - Verify single field called Project Name is displayed
   Given User is in academically login page
    When user login as "student"
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
    And project name textbox is displayed
    
     @UI @TestRails(C14791) @Email
    Scenario: C14791 - Verify that the student has successfully created a new project 
     Given User is in academically login page
    When user register a student
    And user enter account details
      | Firstname      | Lastname | Email          | Date of Birth |
      | Automated82XXX | Test     | automated82XXX | 04/02/1971    |
    Then sent email modal is displayed
    And user activate account
    Then user is in complete registration form
    And email address "automated82XXX" matched
    When user enter password "Test@12345" and confirm passoword "Test@12345"
    And user register an account
    Then registered the account successfully
    When user enter username "automated82XXX" and password "Test@12345"
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
    When user enter project name "Test Project XXX"
   	Then user is in dashboard page
   	When user navigate to my projects tab
   	And user proceed to project "Test Project XXX"
   	Then user is in proposal screen
   	
   	@??
   	Scenario: C14792 - Verify that student see all the offers from tutors relating to my Project
   	
   	Given User is in academically login page
    When user register a student
    And user enter account details
      | Firstname      | Lastname | Email          | Date of Birth |
      | Automated82XXX | Test     | automated82XXX | 04/02/1971    |
    Then sent email modal is displayed
    And user activate account
    Then user is in complete registration form
    And email address "automated82XXX" matched
    When user enter password "Test@12345" and confirm passoword "Test@12345"
    And user register an account
    Then registered the account successfully
    When user enter username "automated82XXX" and password "Test@12345"
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
    When user enter project name "Test Project XXX"
   	Then user is in dashboard page
   	When user navigate to my projects tab
   	And user proceed to project "Test Project XXX"
   	Then user is in proposal screen
   	When user logout in academically
    Then user is in academically login page
    #
    When user login as "tutor"
    Then user successfully login
   	When user see all projects
   	Then user in in find work screen
   	And project name "Test Project XXX" is displayed
   	When user view a full details of the project "Test Project XXX"
   	Then project details modal is displayed
    