Feature: User profile settings
 
@NOT
Scenario: C14499 - Verify uploading a profile photo
	
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
	Then crop profile photo modal is displayed
	When user crop the image
	Then upload a profile photo is successful

@NOT
Scenario: C14500 - Verify removing a profile photo
	
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
	Then crop profile photo modal is displayed
	When user crop the image
	Then upload a profile photo is successful
	When user remove a profile photo
	Then successfully displayed profile picture message was removed
	And profile photo is removed
	
@UI @TestRails(14501)
Scenario: C14501 - Verify select a cover photo
	
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

@UI @TestRails(14503)
Scenario: C14503 - Verify adding about user information
	
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

@UI @TestRails(14505)
Scenario: C14505 - Verify adding user education information by levels
	
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
		|Country         |Institution                 |City      |Start year  |End year |
		|United Kingdom  |The University of Cambridge |Cambridge |1995        |2000     |
	And user add education level
		|Course title                           |Academic Level  |Grade  |
		|Level 7 (Masters degree or equivalent) |Masters         |4      |
	And user saving education information
	Then sucessful message is displayed

Scenario: C14506 - Verify adding user education information by evidence

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

Scenario: C14507 Verify removing user education information

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

@UI @TestRails(14508)
Scenario: C14508 - Verify adding other courses information

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
	Then add qualification modal is displayed
	When user enter qualification information
		|Certificate     |Organization     |Grade attained  |Start year  |End year  |Country         |City    |Summary  |
		|Risk Management |ABC Organization |A               |2005        |2007      |United Kingdom  |London  |Testing  |          
##And user upload evidence of qualification attained
  And user saving qualification information
  Then sucessful message is displayed

@UI @TestRails(14509)
Scenario: C14509 - Verify removing other course information

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
	Then add qualification modal is displayed
	When user enter qualification information
		|Certificate     |Organization     |Grade attained  |Start year  |End year  |Country         |City    |Summary  |
		|Risk Management |ABC Organization |A               |2005        |2007      |United Kingdom  |London  |Testing  | 
	And user saving qualification information
	Then sucessful message is displayed
	When user delete "Risk Management" course information
	Then confirmation is displayed
	When the user confirms to remove a course
	Then removing "Risk Management" course is successful

Scenario: C14510	Verify adding research interest
 
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
	When user proceed to research tab
	And user add research interest
##Click add research interest
Then add research interest modal is displayed
##Verify add research interest modal is displayed
When user enter research interest information
##Enter title
##Enter description 
##Enter and select the knowledge base in the suggestion 
And user saving research interest information
#Click save
Then adding research interest information is successful
#Verify successful message is displayed at the bottom right corner
#Verify the selected knowledge base was displayed 


Scenario: C14511	Verify removing research interest 
	
	Given User is in academically login page
	Then user successfully login
	When user navigate to profile settings
	Then user is in profile settings
	When user proceed to research tab
	And user delete research interest
#Click trash icon
Then confirmation is displayed
#Verify confirmation is displayed
When the user confirms to remove a research interest
#Click yes
Then removing research interest is successful
#Verify successful message is displayed at the bottom right corner


Scenario: C14512	Verify adding research methodology	
	
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
	When user proceed to research tab
	And user add research methodology
#Click add research methodology
	Then add research methodology modal is displayed
#Verify add research methodology modal is displayed
	When user enter research methodology information
#Select title
#Enter description
#Select research method
	And user saving research methodology information
#Click save
	Then adding research methodology is successful
#Verify successful message is displayed at the bottom right corner	
	
Scenario: C14513	Verify removing research methodology


	And user delete research methodology
#Click trash icon
	Then confirmation is displayed
#Verify confirmation is displayed
	When the user confirms to remove a research methodology
#Click yes
	Then removing research methodology is successful
#Verify successful message is displayed at the bottom right corner
			
Scenario: C14514	Verify adding publication

	And user add publication
#Click add publication
	Then add publication modal is displayed
#Verify add publication modal is displayed
	When user enter publication information
#Enter title
#Select publication type
#Enter publisher
#Enter publication date
#Enter abstract
#Enter and select the tag suggestion
	And user saving publication information
#Click save
	Then adding publication was successful
#Verify successful message is displayed at the bottom right corner
#Verify selected tag was displayed  			

Scenario: C14515	Verify removing publication

			
Scenario: C14516	Verify editing publication			
Scenario: C14517	Verify editing research methodology			
Scenario: C14518	Verify editing research interest