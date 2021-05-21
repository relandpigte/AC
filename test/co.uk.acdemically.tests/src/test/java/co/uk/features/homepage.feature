Feature: Title of your feature

@UI @StudentUser @TestRails(14334) 
Scenario: C14334 - Verify menu items on the dashboard as student
	
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
	And overview, my project and usage tab are displayed


@UI @StudentUser @TestRails(14335) 
Scenario: C14335 - Verify create new project on the dashboard is displayed
		
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
	And create new project is displayed on the dashboard


@UI @StudentUser @TestRails(14336) 
Scenario: C14336 - Verify recent project and activity are displayed as student

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
  And overview, my project and usage tab are displayed
	When user navigate to overview tab
	Then user should see recent project and recent activity

@UI
Scenario: Verify view all projects on the dashboard

	Given User is in academically login page
	When user login with valid credentials
	Then user successfully login
  And overview, my project and usage tab are displayed
	When user navigate to my projects tab
	Then user should see all projects

@UI @OK
Scenario: C14338 - Verify usage information is displayed

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
  And overview, my project and usage tab are displayed
	When user navigate to usage tab
	Then user is in usage information
	And user should see actual total hours
	And user should see all total projects
	And user should see overview graph

@UI
Scenario: C14339 - Verify user profile widget is displayed
	
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
	And user profile widget is displayed on the dashboard
	And profile widget information is displayed
#- Verify profile picture is displayed
#- Verify background image is displayed
#- Verify student name is displayed
#- Verify university name is displayed
#- Verify user type is displayed

@UI @StudentUser @TestRails(14340)
Scenario: C14340 - Verify user verification widget is displayed

	Given User is in academically login page
	When user register a student
	And user enter account details
		|Firstname  |Lastname  |Email 			  |Date of Birth  |
		|Geoffrey		|Sims      |automatedXXX  |04/02/1981     |
	Then sent email modal is displayed 
	And user activate account 
	Then user is in complete registration form
	And email address "automatedXXX" matched
	When user enter password "Test@12345" and confirm passoword "Test@12345"
	And user register an account
	Then registered the account successfully
	When user enter username "automatedXXX" and password "Test@12345"
	Then user successfully login
	And verification widget is displayed on the dashboard
	And see a list of verification

@UI @StudentUser @TestRails(14341) @Adhoc
Scenario: C14341- Verify key four key metrics is displayed

	Given User is in academically login page
	When user register a student
	And user enter account details
		|Firstname  |Lastname  |Email 			  |Date of Birth  |
		|Joan   		|Grant     |automatedXXX  |04/02/1981     |
	Then sent email modal is displayed 
	And user activate account 
	Then user is in complete registration form
	And email address "automatedXXX" matched
	When user enter password "Test@12345" and confirm passoword "Test@12345"
	And user register an account
	Then registered the account successfully
	When user enter username "automatedXXX" and password "Test@12345"
	Then user successfully login
	And four key metrics is displayed on the dashboard

@UI
Scenario: Verify account settings is displayed
	
	Given User is in academically login page
	When user register a student
	And user enter account details
		|Firstname  |Lastname  |Email 			  |Date of Birth  |
		|Geoffrey		|Sims      |automatedXXX  |04/02/1981     |
	Then sent email modal is displayed 
	And user activate account 
	Then user is in complete registration form
	And email address "automatedXXX" matched
	When user enter password "Test@12345" and confirm passoword "Test@12345"
	And user register an account
	Then registered the account successfully
	When user enter username "automatedXXX" and password "Test@12345"
	Then user successfully login
	When user navigate to profile menu
	Then account settings is displayed

@UI
Scenario: Verify uploading a profile photo
	
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
	When user navigate to profile settings
#- Click user profile image widget
	Then user is in profile settings
#- Verify user profile settings is displayed
	When user upload a profile photo
#- Click camera icon
#- Click Upload photo
	And user select a photo
#- Select photo on your local storage
	Then crop image modal is displayed
#- Verify crop image modal is displayed
	When user crop the image
#- Crop the image
#- Click Crop button
	Then upload a profile photo is successful
#- Verify new profile photo is displayed
	And successful message is displayed at the right corner
#- Verify message is displayed

Scenario: Verify removing a profile photo
Scenario: Verify uploading a cover photo
Scenario: Verify removing a cover photo
Scenario: Verify adding about user information
Scenario: Verify adding website Url on user profile page
Scenario: Verify adding user education information by levels
Scenario: Verify adding user education information by evidence
Scenario: Verify removing user education information
Scenario: Verify adding other courses information
Scenario: Verify removing other course information
Scenario: 
