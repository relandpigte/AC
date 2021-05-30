Feature: Login Functionality

@UI
Scenario: Verify login using valid credentials

	Given User is in academically login page
	When user login with valid credentials
	Then user successfully login

@UI 
Scenario: Verify login using invalid credentials
	
	Given User is in academically login page
	When user enter username "admin@weqwe.com" and password "pass123" 
	Then user is not successfully login

