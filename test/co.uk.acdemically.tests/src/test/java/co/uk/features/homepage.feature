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

@UI @StudentUser @TestRails(14341)
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

@UI @StudentUser @TestRails(14342)
Scenario: C14342- Verify account settings is displayed
	
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
	When user navigate to profile settings using profile widget
	Then user is in profile settings
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

@??
Scenario: Verify removing a profile photo

Scenario: C14345- Verify uploading a cover photo
	
	Given User is in academically login page
	When user register a student
	And user enter account details
		|Firstname  |Lastname  |Email 			  |Date of Birth  |
		|Joseph  		|Quinn     |automatedXXX  |04/02/1981     |
	Then sent email modal is displayed 
	And user activate account 
	Then user is in complete registration form
	And email address "automatedXXX" matched
	When user enter password "Test@12345" and confirm passoword "Test@12345"
	And user register an account
	Then registered the account successfully
	When user enter username "automatedXXX" and password "Test@12345"
	Then user successfully login
	When user navigate to profile settings using profile widget
	Then user is in profile settings
	When user add a cover photo
	And user select a photo from the gallery
	And user crop the cover photo
	Then upload a cover photo is successful

Scenario: C14346- Verify removing a cover photo

	Given User is in academically login page
	When user register a student
	And user enter account details
		|Firstname  |Lastname  |Email 			  |Date of Birth  |
		|Joseph  		|Quinn     |automatedXXX  |04/02/1981     |
	Then sent email modal is displayed 
	And user activate account 
	Then user is in complete registration form
	And email address "automatedXXX" matched
	When user enter password "Test@12345" and confirm passoword "Test@12345"
	And user register an account
	Then registered the account successfully
	When user enter username "automatedXXX" and password "Test@12345"
	Then user successfully login
	When user navigate to profile settings using profile widget
	Then user is in profile settings
	When user add a cover photo
	And user select a photo from the gallery
	And user crop the cover photo
	Then upload a cover photo is successful
	When user remove a cover photo
	Then confirmation is displayed
	When the user confirms to remove a cover photo
	Then removing a cover photo is successful

	
Scenario: C14347 - Verify adding about user information
	
	Given User is in academically login page
	When user register a student
	And user enter account details
		|Firstname  |Lastname  |Email 			  |Date of Birth  |
		|Joseph  		|Quinn     |automatedXXX  |04/02/1981     |
	Then sent email modal is displayed 
	And user activate account 
	Then user is in complete registration form
	And email address "automatedXXX" matched
	When user enter password "Test@12345" and confirm passoword "Test@12345"
	And user register an account
	Then registered the account successfully
	When user enter username "automatedXXX" and password "Test@12345"
	Then user successfully login
	When user navigate to profile settings using profile widget
	Then user is in profile settings
	When user add a cover photo
	And user select a photo from the gallery
	And user crop the cover photo
	Then upload a cover photo is successful
	When user add about information
	Then adding about user information is successful
@?? 
Scenario: Verify adding website Url on user profile page

Scenario: C14349- Verify adding user education information by levels
	
	Given User is in academically login page
	When user register a student
	And user enter account details
		|Firstname  |Lastname  |Email 			  |Date of Birth  |
		|Rosalind   |Barker    |automatedXXX  |04/02/1971     |
	Then sent email modal is displayed 
	And user activate account 
	Then user is in complete registration form
	And email address "automatedXXX" matched
	When user enter password "Test@12345" and confirm passoword "Test@12345"
	And user register an account
	Then registered the account successfully
	When user enter username "automatedXXX" and password "Test@12345"
	Then user successfully login
	When user navigate to profile settings using profile widget
	Then user is in profile settings
	When user proceed to education tab
	And user add education
	And user enter education information
	#Select country
	#Enter university
	#Enter city
	#Select start year
	#Select end year
	And user add education level
#Click level tab at the right corner
#Click add level

Scenario: Verify adding user education information by evidence

	Given User is in academically login page
	When user register a student
	And user enter account details
		|Firstname  |Lastname  |Email 			  |Date of Birth  |
		|Rosalind   |Barker    |automatedXXX  |04/02/1971     |
	Then sent email modal is displayed 
	And user activate account 
	Then user is in complete registration form
	And email address "automatedXXX" matched
	When user enter password "Test@12345" and confirm passoword "Test@12345"
	And user register an account
	Then registered the account successfully
	When user enter username "automatedXXX" and password "Test@12345"
	Then user successfully login
	When user navigate to profile settings using profile widget
	Then user is in profile settings
	When user proceed to education tab
	And user add evidence file (image or document)
#Click evidence tab at the right corner
#Drop file or click to upload (Image or document)
	Then evidence is added
#Verify evidence is added and displayed
	When user categorize the evidence
#Enter category of the evidence
	And user saving the education information
#Click save
	Then adding education information is successful
#Verify education information is added
#Verify successful message is displayed
When user saving the education information
Then adding education information is successful

Scenario: Verify removing user education information

	Given User is in academically login page
	When user register a student
	And user enter account details
		|Firstname  |Lastname  |Email 			  |Date of Birth  |
		|Rosalind   |Barker    |automatedXXX  |04/02/1971     |
	Then sent email modal is displayed 
	And user activate account 
	Then user is in complete registration form
	And email address "automatedXXX" matched
	When user enter password "Test@12345" and confirm passoword "Test@12345"
	And user register an account
	Then registered the account successfully
	When user enter username "automatedXXX" and password "Test@12345"
	Then user successfully login
	When user navigate to profile settings using profile widget
	Then user is in profile settings
	When user proceed to education tab
	And user add evidence file (image or document)
#Click evidence tab at the right corner
#Drop file or click to upload (Image or document)
	Then evidence is added
#Verify evidence is added and displayed
	When user categorize the evidence
#Enter category of the evidence
	And user saving the education information
#Click save
	Then adding education information is successful
#Verify education information is added
#Verify successful message is displayed
	When user saving the education information
	Then adding education information is successful
	When user delete education information
	Then confirmation is displayed
	When the user confirms to remove a education information
	Then removing education information is successful
	
	
Scenario: Verify adding other courses information

	Given User is in academically login page
	When user register a student
	And user enter account details
		|Firstname  |Lastname  |Email 			  |Date of Birth  |
		|Rosalind   |Barker    |automatedXXX  |04/02/1971     |
	Then sent email modal is displayed 
	And user activate account 
	Then user is in complete registration form
	And email address "automatedXXX" matched
	When user enter password "Test@12345" and confirm passoword "Test@12345"
	And user register an account
	Then registered the account successfully
	When user enter username "automatedXXX" and password "Test@12345"
	Then user successfully login
	When user navigate to profile settings using profile widget
	Then user is in profile settings
	When user proceed to education tab
	And user add course
	Then qualification modal is displayed
	When user enter qualification information
#Enter professional certificate or award
#Enter conferring organization
#Enter summary
#Select start year
#Enter grade attained
And user upload evidence of qualification attained
And user saving qualification information
Then adding course information is successful


Scenario: Verify removing other course information

	Given User is in academically login page
	When user register a student
	And user enter account details
		|Firstname  |Lastname  |Email 			  |Date of Birth  |
		|Rosalind   |Barker    |automatedXXX  |04/02/1971     |
	Then sent email modal is displayed 
	And user activate account 
	Then user is in complete registration form
	And email address "automatedXXX" matched
	When user enter password "Test@12345" and confirm passoword "Test@12345"
	And user register an account
	Then registered the account successfully
	When user enter username "automatedXXX" and password "Test@12345"
	Then user successfully login
	When user navigate to profile settings using profile widget
	Then user is in profile settings
	When user proceed to education tab
	And user add course
	Then qualification modal is displayed
	When user enter qualification information
#Enter professional certificate or award
#Enter conferring organization
#Enter summary
#Select start year
#Enter grade attained
	And user upload evidence of qualification attained
	And user saving qualification information
	Then adding course information is successful
	When user delete course information
#Click trash icon
	Then confirmation is displayed
#Verify confirmation is displayed
	When the user confirms to remove a course
#Click yes
	Then removing course information is successful
#Verify successful message is displayed at the bottom right corner

Scenario: 
