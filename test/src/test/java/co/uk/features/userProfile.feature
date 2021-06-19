Feature: User profile settings

  @UI @TestRails(14499) @??
  Scenario: C14499 - Verify uploading a profile photo
    Given User is in academically login page
    When user register a student
    And user enter account details
      | Firstname | Lastname | Email        | Date of Birth |
      | Benjamin  | Franklin | automatedXXX | 04/02/1981    |
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

  @UI @TestRails(14500)
  Scenario: C14500 - Verify removing a profile photo
    Given User is in academically login page
    When user register a student
    And user enter account details
      | Firstname | Lastname | Email        | Date of Birth |
      | Benjamin  | Franklin | automatedXXX | 04/02/1981    |
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
    And new profile photo is displayed
    When user remove a profile photo
    Then successfully displayed profile picture message was removed
    And profile photo is removed

  @UI @TestRails(14501)
  Scenario: C14501 - Verify select a cover photo
    Given User is in academically login page
    When user register a student
    And user enter account details
      | Firstname | Lastname | Email        | Date of Birth |
      | Joseph    | Quinn    | automatedXXX | 04/02/1981    |
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
      | Firstname | Lastname | Email        | Date of Birth |
      | Joseph    | Quinn    | automatedXXX | 04/02/1981    |
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
      | Firstname | Lastname | Email        | Date of Birth |
      | Rosalind  | Barker   | automatedXXX | 04/02/1971    |
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
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level
      | Course title                           | Academic Level | Grade |
      | Level 7 (Masters degree or equivalent) | Masters        |     4 |
    And user saving education information
    Then sucessful message is displayed

  @UI @TestRails(C14506)
  Scenario: C14506 - Verify adding user education information by evidence
    Given User is in academically login page
    When user register a student
    And user enter account details
      | Firstname | Lastname | Email        | Date of Birth |
      | Rosalind  | Barker   | automatedXXX | 04/02/1971    |
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
    And user add evidence file
    Then "Sample1" evidence is added
    When user enter "Certificate" category evidence
    And user saving the education information
    Then sucessful message is displayed

  @UI @TestRails(14507)
  Scenario: C14507 Verify removing user education information
    Given User is in academically login page
    When user register a student
    And user enter account details
      | Firstname | Lastname | Email        | Date of Birth |
      | Rosalind  | Barker   | automatedXXX | 04/02/1971    |
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
    And user add evidence file
    Then "Sample1" evidence is added
    When user enter "Certificate" category evidence
    And user saving the education information
    Then sucessful message is displayed
    When user delete education information
    Then confirmation is displayed
    When the user confirms to remove a education information
    Then message show successfully deleted

  @UI @TestRails(14508)
  Scenario: C14508 - Verify adding other courses information
    Given User is in academically login page
    When user register a student
    And user enter account details
      | Firstname | Lastname | Email        | Date of Birth |
      | Rosalind  | Barker   | automatedXXX | 04/02/1971    |
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
      | Certificate     | Organization     | Grade attained | Start year | End year | Country        | City   | Summary |
      | Risk Management | ABC Organization | A              |       2005 |     2007 | United Kingdom | London | Testing |
    And user upload evidence of qualification attained
    And user saving qualification information
    Then sucessful message is displayed

  @UI @TestRails(14509)
  Scenario: C14509 - Verify removing other course information
    Given User is in academically login page
    When user register a student
    And user enter account details
      | Firstname | Lastname | Email        | Date of Birth |
      | Rosalind  | Barker   | automatedXXX | 04/02/1971    |
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
      | Certificate     | Organization     | Grade attained | Start year | End year | Country        | City   | Summary |
      | Risk Management | ABC Organization | A              |       2005 |     2007 | United Kingdom | London | Testing |
    And user saving qualification information
    Then sucessful message is displayed
    When user delete "Risk Management" course information
    Then confirmation is displayed
    When the user confirms to remove a course
    Then removing "Risk Management" course is successful

  @UI @TestRails(14510)
  Scenario: C14510	Verify adding research interest
    Given User is in academically login page
    When user register a student
    And user enter account details
      | Firstname | Lastname | Email        | Date of Birth |
      | Rosalind  | Barker   | automatedXXX | 04/02/1971    |
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
    Then "Add Research" interest modal is displayed
    When user enter research interest information
      | Title                                       | Knowledge Base            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
      | Computer Science and Information Technology | Computational Engineering | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving research interest information
    Then sucessful message is displayed
    And adding research interest "Computer Science and Information Technology" is successful

  @UI @TestRails(14511)
  Scenario: C14511	Verify removing research interest
    Given User is in academically login page
    When user register a student
    And user enter account details
      | Firstname | Lastname | Email        | Date of Birth |
      | Rosalind  | Barker   | automatedXXX | 04/02/1971    |
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
    Then "Add Research" interest modal is displayed
    When user enter research interest information
      | Title                                       | Knowledge Base            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
      | Computer Science and Information Technology | Computational Engineering | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving research interest information
    Then sucessful message is displayed
    And adding research interest "Computer Science and Information Technology" is successful
    When user delete research interest "Computer Science and Information Technology"
    Then confirmation is displayed
    When the user confirms to remove a research interest
    Then removing "Computer Science and Information Technology" research interest is successful

  @UI @TestRails(14512)
  Scenario: C14512	Verify adding research methodology
    Given User is in academically login page
    When user register a student
    And user enter account details
      | Firstname | Lastname | Email        | Date of Birth |
      | Rosalind  | Barker   | automatedXXX | 04/02/1971    |
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
    Then "Add Research" Methodology modal is displayed
    When user enter research methodology information
      | Title        | Research method          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
      | Quantitative | Methodological Pluralism | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving research methodology information
    Then sucessful message is displayed
    And adding methodology "Quantitative" is successful

  @UI @TestRails(14513)
  Scenario: C14513	Verify removing research methodology
    Given User is in academically login page
    When user register a student
    And user enter account details
      | Firstname | Lastname | Email        | Date of Birth |
      | Rosalind  | Barker   | automatedXXX | 04/02/1971    |
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
    Then "Add Research" Methodology modal is displayed
    When user enter research methodology information
      | Title        | Research method          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
      | Quantitative | Methodological Pluralism | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving research methodology information
    Then sucessful message is displayed
    And adding methodology "Quantitative" is successful
    When user delete "Quantitative" research methodology
    Then confirmation is displayed
    When the user confirms to remove a research methodology
    Then removing "Quantitative" research methodology is successful

  @UI @TestRails(14514)
  Scenario: C14514	Verify adding publication
    Given User is in academically login page
    When user register a student
    And user enter account details
      | Firstname | Lastname | Email        | Date of Birth |
      | Rosalind  | Barker   | automatedXXX | 04/02/1971    |
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
    And user add publication
    Then "Add" publication modal is displayed
    When user enter publication information
      | Title             | Publication Type | Publisher       | Date       | Tag  | Abstarct                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | Silence the storm | Book             | Rosalind Barker | 06/02/2013 | tag1 | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving publication information
    Then adding publication "Silence the storm" is successful

  Scenario: C14515	Verify removing publication

  #	When user enter username "automated110736" and password "Test@12345"
  Scenario: C14516	Verify editing publication

  Scenario: C14517	Verify editing research methodology

  Scenario: C14518	Verify editing research interest
