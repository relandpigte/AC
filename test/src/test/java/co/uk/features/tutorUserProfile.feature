Feature: Tutor user profile settings

  @UI @TestRails(14556)  @Parallel
  Scenario: C14556 - Verify uploading a profile photo
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated20XXX | Test    | automated20XXX | Test@12345 | automated20XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated20XXX" and password "Test@12345"
    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
    When user upload a profile photo
    Then crop profile photo modal is displayed
    When user crop the image
    Then upload a profile photo is successful

  @UI @TestRails(14557) @Parallel
  Scenario: C14557 - Verify removing a profile photo
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated21XXX | Test    | automated21XXX | Test@12345 | automated21XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated21XXX" and password "Test@12345"
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

  @UI @TestRails(14740)   @Parallel
  Scenario: C14740 - Verify select a cover photo
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated22XXX | Test    | automated21XXX | Test@12345 | automated22XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated22XXX" and password "Test@12345"
    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
    When user add a cover photo
    And user select a photo from the gallery
    And user crop the cover photo
    Then upload a cover photo is successful

  @UI @TestRails(14558) @Parallel
  Scenario: C14558 - Verify adding about user information
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated23XXX | Test    | automated23XXX | Test@12345 | automated23XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated23XXX" and password "Test@12345"
    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
    When user add a cover photo
    And user select a photo from the gallery
    And user crop the cover photo
    Then upload a cover photo is successful
    When user add about information
    Then adding about user information is successful

  @UI @TestRails(14560) @Parallel
  Scenario: C14560 - Verify adding user education information
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated24XXX | Test    | automated24XXX | Test@12345 | automated24XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated24XXX" and password "Test@12345"
    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
    When user proceed to education tab
    And user add education
    And user enter education information
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level
      | Course title             | Academic Level | Qualification | Grade |
      | Economics & Econometrics | Graduate       | BA            |     4 |
    And user saving education information
    Then sucessful message is displayed

  @UI @TestRails(14561) @Parallel
  Scenario: C14561 - 	Verify adding user education information with evidence
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated25XXX | Test    | automated25XXX | Test@12345 | automated25XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated25XXX" and password "Test@12345"
    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
    When user proceed to education tab
    And user add education
    And user enter education information
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level
      | Course title             | Academic Level | Qualification | Grade |
      | Economics & Econometrics | Graduate       | BA            |     4 |
    And user add evidence file
    Then "Sample1" evidence is added
    When user enter "Certificate" category evidence
    And user saving the education information
    Then sucessful message is displayed

  @UI @TestRails(14562) @Parallel
  Scenario: C14562 Verify removing user education information
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated26XXX | Test    | automated26XXX | Test@12345 | automated26XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated26XXX" and password "Test@12345"
    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
    When user proceed to education tab
    And user add education
    And user enter education information
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level
      | Course title             | Academic Level | Qualification | Grade |
      | Economics & Econometrics | Graduate       | BA            |     4 |
    And user add evidence file
    Then "Sample1" evidence is added
    When user enter "Certificate" category evidence
    And user saving the education information
    Then sucessful message is displayed
    When user delete education information
    Then confirmation is displayed
    When the user confirms to remove a education information
    Then message show successfully deleted

  @UI @TestRails(14563) @Parallel
  Scenario: C14563 - Verify adding other courses information
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated27XXX | Test    | automated27XXX | Test@12345 | automated27XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated27XXX" and password "Test@12345"
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

  @UI @TestRails(14564) @Parallel
  Scenario: C14564 - Verify removing other course information
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated28XXX | Test    | automated28XXX | Test@12345 | automated28XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated28XXX" and password "Test@12345"
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

  @UI @TestRails(14569)  @Parallel
  Scenario: C14569	Verify adding research interest
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated29XXX | Test    | automated29XXX | Test@12345 | automated29XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated29XXX" and password "Test@12345"
    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
    When user proceed to research tab
    And user add research interest
    Then "Add Research" interest modal is displayed
    When user enter research interest information
      | Title                                       | Research fields           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
      | Computer Science and Information Technology | Computational Engineering | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving research interest information
    Then sucessful message is displayed
    And adding research interest "Computer Science and Information Technology" is successful

  @UI @TestRails(14572) @Parallel
  Scenario: C14572	Verify removing research interest
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated30XXX | Test    | automated30XXX | Test@12345 | automated30XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated30XXX" and password "Test@12345"
    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
    When user proceed to research tab
    And user add research interest
    Then "Add Research" interest modal is displayed
    When user enter research interest information
      | Title                                       | Research fields           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
      | Computer Science and Information Technology | Computational Engineering | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving research interest information
    Then sucessful message is displayed
    And adding research interest "Computer Science and Information Technology" is successful
    When user delete research interest "Computer Science and Information Technology"
    Then confirmation is displayed
    When the user confirms to remove a research interest
    Then removing "Computer Science and Information Technology" research interest is successful

  @UI @TestRails(14565)    @Parallel
  Scenario: C14565	Verify adding research methodology
    Given User is in academically login page
     When user login as "admin"
     Then user successfully login
     When user proceed to manage user
     Then user is in manage user page
     When user add a new user
     And user enter a user details
       | Name           | Surname | Username       | Password   | Email          | Active | Public |
       | Automated31XXX | Test    | automated31XXX | Test@12345 | automated31XXX | Yes    | Yes    |
     And user select a "Tutor" role
     And user saving user details
     Then sucessful message is displayed
     When user logout in academically
     Then user is in academically login page
     When user enter username "automated31XXX" and password "Test@12345"
     

    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
    When user proceed to research tab
    And user add research methodology
    Then "Add Methodology" modal is displayed
    When user enter research methodology information
      | Title        | Research method          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
      | Quantitative | Methodological Pluralism | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving research methodology information
    Then sucessful message is displayed
    And adding methodology "Quantitative" is successful

  @UI @TestRails(14568) @Parallel
  Scenario: C14568	Verify removing research methodology
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated32XXX | Test    | automated32XXX | Test@12345 | automated32XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated32XXX" and password "Test@12345"
    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
    When user proceed to research tab
    And user add research methodology
    Then "Add Methodology" modal is displayed
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

  @UI @TestRails(14573) @Parallel  
  Scenario: C14573	Verify adding publication
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated33XXX | Test    | automated33XXX | Test@12345 | automated33XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated33XXX" and password "Test@12345"
    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
    When user proceed to research tab
    And user add publication
    Then "Add" publication modal is displayed
    When user enter publication information
      | Title             | Publication Type | Publisher           | Date       | Keyword | Abstarct                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | Silence the storm | Book             | Automated33XXX Test | 06/02/2013 | Storm   | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving publication information
    Then adding publication "Silence the storm" is successful

  @UI @TestRails(14576) @Parallel
  Scenario: C14576	Verify removing publication
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated34XXX | Test    | automated34XXX | Test@12345 | automated34XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated34XXX" and password "Test@12345"
    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
    When user proceed to research tab
    And user add publication
    Then "Add" publication modal is displayed
    When user enter publication information
      | Title             | Publication Type | Publisher           | Date       | Keyword | Abstarct                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | Silence the storm | Book             | Automated34XXX Test | 06/02/2013 | Storm   | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving publication information
    Then adding publication "Silence the storm" is successful
    When user delete publication "Silence the storm"
    Then confirmation is displayed
    When the user confirms to remove a publication
    Then removing "Silence the storm" publication is successful

  @UI @TestRails(C14575) @Parallel
  Scenario: C14575	Verify editing publication
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated35XXX | Test    | automated35XXX | Test@12345 | automated35XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated35XXX" and password "Test@12345"
    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
    When user proceed to research tab
    And user add publication
    Then "Add" publication modal is displayed
    When user enter publication information
      | Title             | Publication Type | Publisher       | Date       | Keyword | Abstarct                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | Silence the storm | Book             | Rosalind Barker | 06/02/2013 | Storm   | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving publication information
    Then adding publication "Silence the storm" is successful
    When user edit publication "Silence the storm"
    Then "Edit" publication modal is displayed
    When user enter publication information
      | Title         | Publication Type | Publisher           | Date       | Keyword | Abstarct |
      | Strange tides | Chapter          | Automated35XXX Test | 03/01/2013 | null    | Test1    |
    And user saving publication information
    And user edit publication "Strange tides"
    Then "Edit" publication modal is displayed
    And verify publication informations are correct
      | Title         | Publication Type | Publisher           | Date       | Keyword | Abstarct |
      | Strange tides | Chapter          | Automated35XXX Test | 03/01/2013 | null    | Test1    |

  @UI @TestRails(C14567) @Parallel
  Scenario: C14567	Verify editing research methodology
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated36XXX | Test    | automated36XXX | Test@12345 | automated36XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated36XXX" and password "Test@12345"
    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
    When user proceed to research tab
    And user add research methodology
    Then "Add" modal is displayed
    When user enter research methodology information
      | Title        | Research method          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
      | Quantitative | Methodological Pluralism | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving research methodology information
    Then sucessful message is displayed
    And adding methodology "Quantitative" is successful
    When user edit "Quantitative" research methodology
    Then "Edit" modal is displayed
    When user enter research methodology information
      | Title       | Research method                  | Description |
      | Qualitative | Data Quality and Data Management | Test        |
    And user saving research methodology information
    Then sucessful message is displayed
    When user edit "Qualitative" research methodology
    Then "Edit" modal is displayed
    And verify research methodology informations are correct
      | Title       | Research method                  | Description |
      | Qualitative | Data Quality and Data Management | Test        |
      |             | Methodological Pluralism         |             |

  @UI @TestRails(C14571) @Parallel
  Scenario: C14571	Verify editing research interest
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated37XXX | Test    | automated37XXX | Test@12345 | automated37XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated37XXX" and password "Test@12345"
    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
    When user proceed to research tab
    And user add research interest
    Then "Add Research" interest modal is displayed
    When user enter research interest information
      | Title                                       | Research fields           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
      | Computer Science and Information Technology | Computational Engineering | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving research interest information
    Then sucessful message is displayed
    And adding research interest "Computer Science and Information Technology" is successful
    When user edit research interest "Computer Science and Information Technology"
    When user enter research interest information
      | Title                | Research fields | Description |
      | Computer programming | null            | Test1       |
    And user saving research interest information
    Then sucessful message is displayed
    When user edit research interest "Computer programming"
    Then verify research interest informations are correct
      | Title                | Research fields           | Description |
      | Computer programming | Computational Engineering | Test1       |

  @UI @TestRails(14566)  @Parallel
  Scenario: C14566 - Verify adding research methodology without research method
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated38XXX | Test    | automated38XXX | Test@12345 | automated38XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated38XXX" and password "Test@12345"
    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
    When user proceed to research tab
    And user add research methodology
    Then "Add" modal is displayed
    When user enter research methodology information
      | Title        | Research method | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
      | Quantitative | null            | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving research methodology information
    Then sucessful message is displayed
    And adding methodology "Quantitative" is successful

  @UI @TestRails(14570)   @Parallel
  Scenario: C14570 - Verify adding research interest without knowledge base
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated39XXX | Test    | automated39XXX | Test@12345 | automated39XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated39XXX" and password "Test@12345"
    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
    When user proceed to research tab
    And user add research interest
    Then "Add Research" interest modal is displayed
    When user enter research interest information
      | Title                                       | Research fields | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
      | Computer Science and Information Technology | null            | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving research interest information
    Then sucessful message is displayed
    And adding research interest "Computer Science and Information Technology" is successful

  @UI @TestRails(14574)  @Parallel
  Scenario: C14574 - Verify adding publication without tag
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated40XXX | Test    | automated40XXX | Test@12345 | automated40XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated40XXX" and password "Test@12345"
     
    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
    When user proceed to research tab
    And user add publication
    Then "Add" publication modal is displayed
    When user enter publication information
      | Title             | Publication Type | Publisher           | Date       | Tag |Keyword | Abstarct                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | Silence the storm | Book             | Automated40XXX Test | 06/02/2013 | null|null | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving publication information
    Then adding publication "Silence the storm" is successful

  @??
  Scenario: C14577 - Verify adding services

  @UI @TestRails(14782) @Parallel
  Scenario: C14782 - Verify adding spoken languages
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated66XXX | Test    | automated66XXX | Test@12345 | automated66XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated66XXX" and password "Test@12345"
    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
    When user add language spoken
    And select "Fluent" english proficiency
    And user add other language
      | Language | Proficiency |
      | Czech    | Basic       |
    And user saving spoken language information
    Then "Fluent" "English" language is added
    And "Basic" "Czech" language is added

  @UI @TestRails(14783) @Parallel
  Scenario: C14783 - Verify removing spoken languages
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated67XXX | Test    | automated67XXX | Test@12345 | automated67XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated67XXX" and password "Test@12345"
    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
    When user add language spoken
    And select "Fluent" english proficiency
    And user add other language
      | Language | Proficiency |
      | Czech    | Basic       |
    And user saving spoken language information
    Then "Fluent" "English" language is added
    And "Basic" "Czech" language is added
    When user add language spoken
    And user removes "Czech" language
    And user saving spoken language information
    Then removing "Basic" "Czech" language is successful

  @UI @TestRails(14784) @Parallel
  Scenario: C14784 - Verify editing spoken languages
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated68XXX | Test    | automated68XXX | Test@12345 | automated68XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated68XXX" and password "Test@12345"
    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
    When user add language spoken
    And select "Fluent" english proficiency
    And user add other language
      | Language | Proficiency |
      | Czech    | Basic       |
    And user saving spoken language information
    Then "Fluent" "English" language is added
    And "Basic" "Czech" language is added
    When user edit language spoken
    And select "Basic" english proficiency
    And user add other language
      | Language | Proficiency |
      | Dutch    | Fluent      |
    And user edit "Czech" language
    And user edit other language
      | Language | Proficiency    |
      | Greek    | Conversational |
    And user saving spoken language information
    Then "Basic" "English" language is added
    And "Conversational" "Greek" language is added
    And "Fluent" "Dutch" language is added

  @??
  Scenario: C14779 - Verify tutor can able to upload/play a video on introduction tab
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name            | Surname | Username        | Password   | Email           | Active | Public |
      | Automated120XXX | Test    | automated120XXX | Test@12345 | automated120XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated120XXX" and password "Test@12345"
    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
 #   When user uploads the introductory video
 #   And  user will save the introductory video
 #   Then user has successfully added the introductory video to the profile
    
  @??
  Scenario: C14780 - Verify that the student can play a video in the tutor profile

  @??
  Scenario: C14781 - Verify tutor can able to remove video on introduction tab

  @UI @TestRails(14787)
  Scenario: C14787	Verify the available tab in the profile settings as tutor
    Given User is in academically login page
    When user login as "tutor"
    Then user successfully login
    When user navigate to profile settings using profile widget
    Then user is in profile settings
    And "Introduction" tab is displayed on profile settings
    And "Education" tab is displayed on profile settings
    And "Research" tab is displayed on profile settings
    And "Industry" tab is displayed on profile settings
    And "Service" tab is displayed on profile settings
