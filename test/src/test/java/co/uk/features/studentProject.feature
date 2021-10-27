Feature: Student project

  @UI @TestRails(14812)
  Scenario: C14812	Verify student can able to view project details
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated83XXX | Test    | automated83XXX | Test@12345 | automated83XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
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

  @UI @TestRails(14813)
  Scenario: C14813	Verify that student can able to view tutor offer
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated86XXX | Test    | automated86XXX | Test@12345 | automated86XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated86XXX" and password "Test@12345"
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
    When user enter project name "Test Project 86XXX"
    Then user is in dashboard page
    When user navigate to my projects tab
    And user proceed to project "Test Project 86XXX"
    Then user is in proposal screen
    When user logout in academically
    Then user is in academically login page
    When user login as "tutor"
    Then user successfully login
    When user see all projects
    Then user in in find work screen
    And project name "Test Project 86XXX" is displayed
    When user view a full details of the project "Test Project 86XXX"
    Then project details modal is displayed
    When tutor make an offer
      | Price per hour | Discounted number of hours | Discounted price per hour | Free interview |
      |             15 |                          1 |                        18 | Yes            |
    And user close the offer modal
    And user proceed to the dashboard page
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated86XXX" and password "Test@12345"
    Then user successfully login
    When user navigate to my projects tab
    And user proceed to project "Test Project 86XXX"
    Then user is in proposal screen
    When the user views the full details of "Tutor" offer
    Then the user has successfully viewed the tutor offer

  @??
  Scenario: C14814	Verify student can book a session on payment page
    Given User is in academically login page
    #    When user login as "admin"
    #    Then user successfully login
    #    When user proceed to manage user
    #    Then user is in manage user page
    #    When user add a new user
    #    And user enter a user details
    #      | Name           | Surname | Username       | Password   | Email          | Active | Public |
    #      | Automated87XXX | Test    | automated87XXX | Test@12345 | automated87XXX | Yes    | Yes    |
    #    And user select a "Student" role
    #    And user saving user details
    #    Then sucessful message is displayed
    #    When user logout in academically
    #    Then user is in academically login page
    #    When user enter username "automated87XXX" and password "Test@12345"
    #    Then user successfully login
    #    When user create a new project
    #    Then user is in service wizard page
    #    When user click request support
    #    And user select "Academic Support" service
    #    And user click continue to step2
    #    Then user is in step 2
    #    When user select "Graduate" level for the service
    #    And user click continue to step 3
    #    Then user in in step 3
    #    When user select "Academic Tutoring"
    #    And user click continue to step 4
    #    Then user is in step 4
    #    When user enter project name "Test Project 87XXX"
    #    Then user is in dashboard page
    #    When user navigate to my projects tab
    #    And user proceed to project "Test Project 87XXX"
    #    Then user is in proposal screen
    #    When user logout in academically
    #    Then user is in academically login page
    #    When user login as "tutor"
    #    Then user successfully login
    #    When user see all projects
    #    Then user in in find work screen
    #    And project name "Test Project 87XXX" is displayed
    #    When user view a full details of the project "Test Project 87XXX"
    #    Then project details modal is displayed
    #    When tutor make an offer
    #      | Price per hour | Discounted number of hours | Discounted price per hour | Free interview |
    #      |             15 |                          1 |                        18 | Yes            |
    #    And user close the offer modal
    #    And user proceed to the dashboard page
    #    When user logout in academically
    #    Then user is in academically login page
    #    When user enter username "automated87XXX" and password "Test@12345"
    When user enter username "student1" and password "Test@12345"
    Then user successfully login
    When user navigate to my projects tab
    #    And user proceed to project "Test Project 87XXX"
    And user proceed to project "Testing"
    Then user is in proposal screen
    When the user views the full details of "Tutor" offer
    Then the user has successfully viewed the tutor offer
    When user proceed to book session tab
    And user add book session on payment page
    Then Add booking modal is displayed on payment page
    When user enter booking details on payment page
      | Project id | Title        | Start date               | End date                 | Start hour | Start minute | Start interval | Start meridiem | End hour | End minute | Session hour | End meridiem | Recurrence |
      | null       | Testing87XXX | Tommorow except weekends | Tommorow except weekends |         02 | null         | null           | PM             |       04 | null       |            0 | PM           | One Time   |

  #    And the user pays for the session
  #    Then sucessful message is displayed
  #    When user proceed to the calendar
  #    Then the user is on the student calendar
  #    And the "Testing87XXX" session is displayed on the student calendar
  #    When user logout in academically
  #    Then user is in academically login page
  #    When user login as "tutor"
  #    Then user successfully login
  #    When user proceed to the calendar
  #    Then the user is on the tutor calendar
  #    And the "Testing87XXX" session is displayed on the tutor calendar
  
  @Adhoc
  Scenario: C14988 Verify that student can delete a project
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated92XXX | Test    | automated92XXX | Test@12345 | automated92XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated92XXX" and password "Test@12345"
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
    When user enter project details
    
    
    
    
    When user enter project name "Test Project 92XXX"
    Then user is in dashboard page
    When user navigate to my projects tab
    And user proceed to project "Test Project 92XXX"
    Then user is in proposal screen
    When user deletes this project
    Then user is in dashboard page
    When user navigate to my projects tab
    Then project name "Test Project 92XXX" is not displayed
    
    
