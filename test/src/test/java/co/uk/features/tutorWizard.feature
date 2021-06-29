Feature: Tutor Wizard

  @UI @TestRails(C14520)
  Scenario: C14520 - Verify opening the tutor wizard from dashboard
    Given User is in academically login page
    When user login as "student"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page

  @UI @TestRails(C14521)
  Scenario: C14521 - Verify opening the tutor wizard from dashboard
    Given User is in academically login page
    When user login as "student"
    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
    When user wants to become a tutor on the profile page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    
	 @EMAIL 
   Scenario: C14522 - Verify adding about user information from the tutor wizard
    
    Given User is in academically login page
    When user register a student
    And user enter account details
      | Firstname       | Lastname | Email          | Date of Birth |
      | Automated41XXX  | Test     | automated41XXX | 04/02/1981    |
    Then sent email modal is displayed
    And user activate account
    Then user is in complete registration form
    And email address "automated41XXX" matched
    When user enter password "Test@12345" and confirm passoword "Test@12345"
    And user register an account
    Then registered the account successfully
    When user enter username "automated41XXX" and password "Test@12345"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    
    When user adds about information
    	|Firstname      |Lastname| Overview|
    	|Automated41XXX |Test    | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."|
   	And user next to education
   	Then sucessful message is displayed
   	
   	Scenario: C14523 -Verify adding user education information by levels from the tutor wizard
   	
   	 When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    
    When user adds about information
    	|Firstname      |Lastname| Overview|
    	|Automated41XXX |Test    | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."|
   	And user next to education
   	Then sucessful message is displayed
   	
   	When user enter education information
   	And user add education level
   	Then add level modal is displayed
   	When user enter education level information
   	Then education level is added
   	When user saving the education information
   	Then sucessful message is displayed
		