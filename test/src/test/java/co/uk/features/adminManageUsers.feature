Feature: Manage users

  @UI @TestRails(14594)
  Scenario: C14594 - Create an admin
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated75XXX | Test    | automated75XXX | Test@12345 | automated75XXX | Yes    | No     |
    And user select a "Admin" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "Automated75XXX" and password "Test@12345"
    Then user successfully login

  @UI @TestRails(14592)
  Scenario: C14592 - Create a super admin
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated76XXX | Test    | automated76XXX | Test@12345 | automated76XXX | Yes    | No     |
    And user select a "Super Admin" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "Automated76XXX" and password "Test@12345"
    Then user successfully login

  @UI @TestRails(14593)
  Scenario: C14593 - Create a tutor
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated77XXX | Test    | automated77XXX | Test@12345 | automated77XXX | Yes    | No     |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "Automated77XXX" and password "Test@12345"
    Then user successfully login

  @UI @TestRails(14594)
  Scenario: C14594 - Create a student
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated78XXX | Test    | automated78XXX | Test@12345 | automated78XXX | Yes    | No     |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "Automated78XXX" and password "Test@12345"
    Then user successfully login
    
  @UI @TestRails(C14595)
  Scenario: C14595 - Delete a user
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated79XXX | Test    | automated79XXX | Test@12345 | automated79XXX | Yes    | No     |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
  	When user search "automated79XXX" on user management	
    And user delete "automated79XXX" user
    Then delete modal is displayed on user management
    When user click yes to delete on user management 
    Then sucessfuly deleted is displayed
   	When user search "automated79XXX" on user management	
   	Then "automated79XXX" is not displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "Automated79XXX" and password "Test@12345"
    Then user is not successfully login
@Adhoc
  Scenario: C14596 - Edit user details

    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated80XXX | Test    | automated80XXX | Test@12345 | automated80XXX | Yes    | No     |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user search "automated80XXX" on user management
    Then "automated80XXX" is displayed	
    And user edit "automated80XXX" user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated81XXX | Test    | automated81XXX | Test@12345 | automated81XXX | Yes    | No     |
    And user saving user details
    Then sucessful message is displayed
    When user search "automated81XXX" on user management	
    Then "automated81XXX" is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "Automated81XXX" and password "Test@12345"
    Then user is not successfully login