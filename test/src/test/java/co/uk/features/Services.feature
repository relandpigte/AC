Feature: Services

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
