Feature: Services
@UI @TestRails(C14773)
Scenario:	C14773 - Verify service wizard page is displayed
		Given User is in academically login page
    When user login as "student"
    Then user successfully login
    When user create a new project
    Then user is in service wizard page		
    
Scenario:	C14774 - Verifythat user can able to select a service
	Given User is in academically login page
    When user login as "student"
    Then user successfully login
    When user create a new project
    Then user is in service wizard page	
    When user click request support
And user select "Academic Support" service
And user click continue to step 2
Then successful selecting a service
    			
Scenario:	C14775 - Verify user can able to select a level for the service			
Scenario: C14776 - Verify the level options are displayed			
Scenario: C14778 - Verify page 3 of the wizard be able to navigate and select a single service