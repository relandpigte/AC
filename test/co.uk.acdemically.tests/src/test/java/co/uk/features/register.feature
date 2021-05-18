Feature: Register

@UI
Scenario: 1. Verify successful register a student

	Given User is in academically login page
	When user register a student
	And user enter account details
		|Firstname  |Lastname  |Email 			  |Date of Birth  |
		|Benjamin		|Franklin  |automatedXXX  |04/02/1981     |
	Then sent email modal is displayed 
	And user activate account 
	Then user is in complete registration form
	And email address "automatedXXX" matched
	When user enter password "Test@12345" and confirm passoword "Test@12345"
	And user register an account
	Then registered the account successfully
	When user enter username "automatedXXX" and password "Test@12345"
	Then user successfully login

