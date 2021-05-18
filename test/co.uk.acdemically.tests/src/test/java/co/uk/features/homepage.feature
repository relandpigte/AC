Feature: Title of your feature

@UI @OK
Scenario: 1. C14334 - Verify menu items on the dashboard as student

	Given User is in academically login page
	When user login with valid credentials
	Then user successfully login
	And overview, my project and usage tab are displayed


@UI @OK
Scenario: 2. C14335 - Verify create new project on the dashboard is displayed
	Given User is in academically login page
	When user login with valid credentials
	Then user successfully login
	And create new project is displayed on the dashboard


@UI @OK
Scenario: 3. C14336 - Verify recent project and activity are displayed as student

	Given User is in academically login page
	When user login with valid credentials
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

@UI
Scenario: Verify usage information is displayed

	Given User is in academically login page
	When user login with valid credentials
	Then user successfully login
#- Verify the dashboard is displayed
  And overview, my project and usage tab are displayed
	When user navigate to usage tab
#- Click my usage tab
	Then usage information is displayed
	Then user should see actual total hours
#- Verify actual total hours is displayed
	And user should see all total projects
#- Verify total projects count is displayed
And user should see overview graph
#- Verify overview graph is displayed


@UI
Scenario: Verify user profile widget is displayed
	
	Given User is in academically login page
	When user login with valid credentials
	Then user successfully login
#- Verify the dashboard is displayed
	And user profile widget is displayed on the dashboard
#- Verify profile widget is displayed
	And profile widget information is displayed
#- Verify profile picture is displayed
#- Verify background image is displayed
#- Verify student name is displayed
#- Verify university name is displayed
#- Verify user type is displayed

@UI
Scenario: Verify user verification widget is displayed

	Given User is in academically login page
	When user login with valid credentials
	Then user successfully login
#- Verify the dashboard is displayed
#-And verification widget is displayed on the dashboard
#- Verify verification widget is displayed
	And see a list of verification
#- Email verification
#- TBC (look for common options)

@UI
Scenario: Verify key four key metrics is displayed

	Given User is in academically login page
	When user login with valid credentials
	Then user successfully login
#- Verify the dashboard is displayed
	When user navigate to profile settings
#- Click user profile image widget
	Then user is in profile settings
#- Verify user profile settings is displayed
	And four key metrics is displayed
#- Verify Total hours is displayed
#- Verify academic level (highest attained qualification) is displayed
#- Verify user type is displayed
#- Verify user average rating (0 - 5 to 1 decimal place) is displayed

@UI
Scenario: Verify account settings is displayed
	
	Given User is in academically login page
	When user login with valid credentials
	Then user successfully login
#- Verify the dashboard is displayed
	When user navigate to profile
#- Click user profile on the side navigation or top navigation
	Then account settings is displayed
#- Verify account settings section is displayed

@UI
Scenario: Verify uploading a profile photo
	
	Given User is in academically login page
	When user login with valid credentials
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
