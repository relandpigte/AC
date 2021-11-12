Feature: Tutor Wizard

  @UI  @TestRails(14520)
  Scenario: C14520 - Verify opening the tutor wizard from dashboard
    Given User is in academically login page
    When user login as "student"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page

  @UI  @TestRails(14521)
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

  @UI  @TestRails(14522)
  Scenario: C14522 - Verify adding about user information from the tutor wizard
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated41XXX | Test    | automated41XXX | Test@12345 | automated41XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated41XXX" and password "Test@12345"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    When user adds about information
      | Firstname      | Lastname | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | Automated41XXX | Test     | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user next to education
    Then sucessful message is displayed

  @UI  @TestRails(14523)
  Scenario: C14523 -Verify adding user education information by levels from the tutor wizard
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated42XXX | Test    | automated42XXX | Test@12345 | automated42XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "Automated42XXX" and password "Test@12345"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    When user adds about information
      | Firstname | Lastname | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | null      | null     | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user next to education
    Then sucessful message is displayed
    When user add education information on tutor wizard
    And user enter education information on tutor wizard
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level on tutor wizard
      | Course title                           | Academic Level | Grade |
      | Level 7 (Masters degree or equivalent) | Masters        |     4 |
    And user saving the education information on tutor wizard
    Then sucessful message is displayed

  @UI  @TestRails(14524)
  Scenario: C14524 - Verify adding user education information by evidence from the tutor wizard
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated42XXX | Test    | automated42XXX | Test@12345 | automated42XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated42XXX" and password "Test@12345"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    When user adds about information
      | Firstname | Lastname | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | null      | null     | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user next to education
    Then sucessful message is displayed
    When user add education information on tutor wizard
    And user enter education information on tutor wizard
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level on tutor wizard
      | Course title                           | Academic Level | Grade |
      | Level 7 (Masters degree or equivalent) | Masters        |     4 |
    And user add evidence file on tutor wizard
    Then "Sample1" evidence is added on tutor wizard
    When user enter "Certificate" category evidence on tutor wizard
    And user saving the education information on tutor wizard
    Then sucessful message is displayed

  @UI  @TestRails(14525)
  Scenario: C14525 - Verify adding research interest from the tutor wizard
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated43XXX | Test    | automated43XXX | Test@12345 | automated43XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated43XXX" and password "Test@12345"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    When user adds about information
      | Firstname | Lastname | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | null      | null     | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user next to education
    Then sucessful message is displayed
    When user add education information on tutor wizard
    And user enter education information on tutor wizard
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level on tutor wizard
      | Course title                           | Academic Level | Grade |
      | Level 7 (Masters degree or equivalent) | Masters        |     4 |
    And user add evidence file on tutor wizard
    Then "Sample1" evidence is added on tutor wizard
    When user enter "Certificate" category evidence on tutor wizard
    And user saving the education information on tutor wizard
    Then sucessful message is displayed
    When user next to research
    And user add research interest on tutor wizard
    Then "Add Research" interest modal is displayed on tutor wizard
    When user enter research interest information on tutor wizard
      | Title                                       | Knowledge Base            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
      | Computer Science and Information Technology | Computational Engineering | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving research interest information
    Then sucessful message is displayed
    And adding research interest "Computer Science and Information Technology" is successful on tutor wizard

  @UI  @TestRails(14526)
  Scenario: C14526- Verify adding research methodology from the tutor wizard
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated44XXX | Test    | automated43XXX | Test@12345 | automated44XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated44XXX" and password "Test@12345"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    When user adds about information
      | Firstname | Lastname | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | null      | null     | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user next to education
    Then sucessful message is displayed
    When user add education information on tutor wizard
    And user enter education information on tutor wizard
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level on tutor wizard
      | Course title                           | Academic Level | Grade |
      | Level 7 (Masters degree or equivalent) | Masters        |     4 |
    And user add evidence file on tutor wizard
    Then "Sample1" evidence is added on tutor wizard
    When user enter "Certificate" category evidence on tutor wizard
    And user saving the education information on tutor wizard
    Then sucessful message is displayed
    When user next to research
    And user add research methodology on tutor wizard
    Then "Add Research" Methodology modal is displayed on tutor wizard
    When user enter research methodology information on tutor wizard
      | Title        | Research method          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
      | Quantitative | Methodological Pluralism | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving research methodology information on tutor wizard
    Then sucessful message is displayed
    And adding methodology "Quantitative" is successful on tutor wizard

  @UI  @TestRails(14527)
  Scenario: C14527 - Verify adding publication from the tutor wizard
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated45XXX | Test    | automated45XXX | Test@12345 | automated45XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated45XXX" and password "Test@12345"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    When user adds about information
      | Firstname | Lastname | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | null      | null     | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user next to education
    Then sucessful message is displayed
    When user add education information on tutor wizard
    And user enter education information on tutor wizard
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level on tutor wizard
      | Course title                           | Academic Level | Grade |
      | Level 7 (Masters degree or equivalent) | Masters        |     4 |
    And user add evidence file on tutor wizard
    Then "Sample1" evidence is added on tutor wizard
    When user enter "Certificate" category evidence on tutor wizard
    And user saving the education information on tutor wizard
    Then sucessful message is displayed
    When user next to research
    And user add publication on tutor wizard
    Then "Add" publication modal is displayed on tutor wizard
    When user enter publication information on tutor wizard
      | Title             | Publication Type | Publisher           | Date       | Tag  | Abstarct                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | Silence the storm | Book             | Automated45XXX Test | 06/02/2013 | tag1 | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving publication information on tutor wizard
    Then adding publication "Silence the storm" is successful on tutor wizard

  @UI  @TestRails(14528)
  Scenario: C14528 - Verify adding spoken languages from the tutor wizard
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated46XXX | Test    | automated46XXX | Test@12345 | automated46XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated46XXX" and password "Test@12345"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    When user adds about information
      | Firstname | Lastname | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | null      | null     | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user next to education
    Then sucessful message is displayed
    When user add education information on tutor wizard
    And user enter education information on tutor wizard
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level on tutor wizard
      | Course title                           | Academic Level | Grade |
      | Level 7 (Masters degree or equivalent) | Masters        |     4 |
    And user add evidence file on tutor wizard
    Then "Sample1" evidence is added on tutor wizard
    When user enter "Certificate" category evidence on tutor wizard
    And user saving the education information on tutor wizard
    Then sucessful message is displayed
    When user next to research
    And user skip to enter research information
    And user add language spoken on tutor wizard
    And select "Fluent" english proficiency on tutor wizard
    And user add other language on tutor wizard
      | Language | Proficiency |
      | Czech    | Basic       |
    And user saving spoken language information on tutor wizard
    Then sucessful message is displayed
    And "Fluent" "English" language is added on tutor wizard
    And "Basic" "Czech" language is added on tutor wizard

  @UI  @TestRails(14529)
  Scenario: C14529 - Verify adding support services from the tutor wizard
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated47XXX | Test    | automated47XXX | Test@12345 | automated47XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated47XXX" and password "Test@12345"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    When user adds about information
      | Firstname | Lastname | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | null      | null     | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user next to education
    Then sucessful message is displayed
    When user add education information on tutor wizard
    And user enter education information on tutor wizard
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level on tutor wizard
      | Course title                           | Academic Level | Grade |
      | Level 7 (Masters degree or equivalent) | Masters        |     4 |
    And user add evidence file on tutor wizard
    Then "Sample1" evidence is added on tutor wizard
    When user enter "Certificate" category evidence on tutor wizard
    And user saving the education information on tutor wizard
    Then sucessful message is displayed
    When user next to research
    And user skip to enter research information
    And user add language spoken on tutor wizard
    And select "Fluent" english proficiency on tutor wizard
    And user add other language on tutor wizard
      | Language | Proficiency |
      | Czech    | Basic       |
    And user saving spoken language information on tutor wizard
    Then "Fluent" "English" language is added on tutor wizard
    And "Basic" "Czech" language is added on tutor wizard
    When user next to services offered
    And user adds support service on tutor wizard
    And user enters services information on tutor wizard
      | Category         | Service           | Level | Expertise level | Subject        | Subject details | Description      | Study area | Study field |
      | Academic Support | Academic Tutoring | GCSE  | Expert          | Art and design | null            | Test description | null       | null        |
    And user saving support services information on tutor wizard
    Then sucessful message is displayed

  @?? @automated48XXX
  Scenario: C14530 - Verify removing user education information
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated48XXX | Test    | automated48XXX | Test@12345 | automated48XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
   When user enter username "automated48154625" and password "Test@12345"
   Then user successfully login
   When user wants to become a tutor on the dashboard page
   Then confirmation of  become a tutor modal is displayed
   When user confirms to become a tutor
   Then user is in tutor wizard page
    When user adds about information
      | Firstname | Lastname | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | null      | null     | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user next to education
    Then sucessful message is displayed
    When user add education information on tutor wizard
    And user enter education information on tutor wizard
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level on tutor wizard
      | Course title                           | Academic Level | Grade |
      | Level 7 (Masters degree or equivalent) | Masters        |     4 |
    And user add evidence file on tutor wizard
    Then "Sample1" evidence is added on tutor wizard
    When user enter "Certificate" category evidence on tutor wizard
    And user saving the education information on tutor wizard
    Then sucessful message is displayed
    
    When user delete education information on tutor wizard
    Then confirmation is displayed on tutor wizard
    When the user confirms to remove a education information on tutor wizard
    Then removing education information is successful on tutor wizard
    
  @?? @automated49XXX
  Scenario: C14633 - Verify editing user education information

  @?? @automated50XXX
  Scenario: C14532 - Verify removing user education information by evidence

  @UI  @TestRails(14528)
  Scenario: C14533 - Verify removing research interest
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated51XXX | Test    | automated51XXX | Test@12345 | automated51XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated51XXX" and password "Test@12345"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    When user adds about information
      | Firstname | Lastname | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | null      | null     | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user next to education
    Then sucessful message is displayed
    When user add education information on tutor wizard
    And user enter education information on tutor wizard
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level on tutor wizard
      | Course title                           | Academic Level | Grade |
      | Level 7 (Masters degree or equivalent) | Masters        |     4 |
    And user add evidence file on tutor wizard
    Then "Sample1" evidence is added on tutor wizard
    When user enter "Certificate" category evidence on tutor wizard
    And user saving the education information on tutor wizard
    Then sucessful message is displayed
    When user next to research
    And user add research interest on tutor wizard
    Then "Add Research" interest modal is displayed on tutor wizard
    When user enter research interest information on tutor wizard
      | Title                                       | Knowledge Base            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
      | Computer Science and Information Technology | Computational Engineering | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving research interest information
    Then sucessful message is displayed
    And adding research interest "Computer Science and Information Technology" is successful on tutor wizard
    When user delete research interest "Computer Science and Information Technology" on tutor wizard
    Then confirmation is displayed on tutor wizard
    When the user confirms to remove a research interest on tutor wizard
    Then removing "Computer Science and Information Technology" research interest is successful on tutor wizard

  @UI  @TestRails(14534)
  Scenario: C14534 - Verify editing research interest
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated52XXX | Test    | automated52XXX | Test@12345 | automated52XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated52XXX" and password "Test@12345"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    When user adds about information
      | Firstname | Lastname | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | null      | null     | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user next to education
    Then sucessful message is displayed
    When user add education information on tutor wizard
    And user enter education information on tutor wizard
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level on tutor wizard
      | Course title                           | Academic Level | Grade |
      | Level 7 (Masters degree or equivalent) | Masters        |     4 |
    And user add evidence file on tutor wizard
    Then "Sample1" evidence is added on tutor wizard
    When user enter "Certificate" category evidence on tutor wizard
    And user saving the education information on tutor wizard
    Then sucessful message is displayed
    When user next to research
    And user add research interest on tutor wizard
    Then "Add Research" interest modal is displayed on tutor wizard
    When user enter research interest information on tutor wizard
      | Title                                       | Knowledge Base            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
      | Computer Science and Information Technology | Computational Engineering | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving research interest information on tutor wizard
    Then sucessful message is displayed
    And adding research interest "Computer Science and Information Technology" is successful on tutor wizard
    When user edit research interest "Computer Science and Information Technology" on tutor wizard
    And user enter research interest information on tutor wizard
      | Title                | Knowledge Base | Description |
      | Computer programming | null           | Test1       |
    And user saving research interest information on tutor wizard
    Then sucessful message is displayed
    When user edit research interest "Computer programming" on tutor wizard
    Then verify research interest informations are correct on tutor wizard
      | Title                | Knowledge Base            | Description |
      | Computer programming | Computational Engineering | Test1       |

  @UI  @TestRails(14535)
  Scenario: C14535 - Verify removing research methodology
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated53XXX | Test    | automated53XXX | Test@12345 | automated53XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated53XXX" and password "Test@12345"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    When user adds about information
      | Firstname | Lastname | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | null      | null     | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user next to education
    Then sucessful message is displayed
    When user add education information on tutor wizard
    And user enter education information on tutor wizard
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level on tutor wizard
      | Course title                           | Academic Level | Grade |
      | Level 7 (Masters degree or equivalent) | Masters        |     4 |
    And user add evidence file on tutor wizard
    Then "Sample1" evidence is added on tutor wizard
    When user enter "Certificate" category evidence on tutor wizard
    And user saving the education information on tutor wizard
    Then sucessful message is displayed
    When user next to research
    And user add research methodology on tutor wizard
    Then "Add Research" Methodology modal is displayed on tutor wizard
    When user enter research methodology information on tutor wizard
      | Title        | Research method          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
      | Quantitative | Methodological Pluralism | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving research methodology information on tutor wizard
    Then sucessful message is displayed
    And adding methodology "Quantitative" is successful on tutor wizard
    When user delete "Quantitative" research methodology
    Then confirmation is displayed on tutor wizard
    When the user confirms to remove a research methodology on tutor wizard
    Then removing "Quantitative" research methodology is successful on tutor wizard

  @UI  @TestRails(14536)
  Scenario: C14536 - Verify editing research methodology
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated53XXX | Test    | automated53XXX | Test@12345 | automated53XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated53XXX" and password "Test@12345"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    When user adds about information
      | Firstname | Lastname | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | null      | null     | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user next to education
    Then sucessful message is displayed
    When user add education information on tutor wizard
    And user enter education information on tutor wizard
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level on tutor wizard
      | Course title                           | Academic Level | Grade |
      | Level 7 (Masters degree or equivalent) | Masters        |     4 |
    And user add evidence file on tutor wizard
    Then "Sample1" evidence is added on tutor wizard
    When user enter "Certificate" category evidence on tutor wizard
    And user saving the education information on tutor wizard
    Then sucessful message is displayed
    When user next to research
    And user add research methodology on tutor wizard
    Then "Add Research" Methodology modal is displayed on tutor wizard
    When user enter research methodology information on tutor wizard
      | Title        | Research method          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
      | Quantitative | Methodological Pluralism | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving research methodology information on tutor wizard
    Then sucessful message is displayed
    And adding methodology "Quantitative" is successful on tutor wizard
    When user edit "Quantitative" research methodology
    Then "Edit Research" Methodology modal is displayed on tutor wizard
    When user enter research methodology information on tutor wizard
      | Title       | Research method                  | Description |
      | Qualitative | Data Quality and Data Management | Test        |
    And user saving research methodology information on tutor wizard
    Then sucessful message is displayed
    When user edit "Qualitative" research methodology on tutor wizard
    Then "Edit Research" Methodology modal is displayed on tutor wizard
    And verify research methodology informations are correct on tutor wizard
      | Title       | Research method                  | Description |
      | Qualitative | Data Quality and Data Management | Test        |
      |             | Methodological Pluralism         |             |

  @UI  @TestRails(14537)
  Scenario: C14537 - Verify removing publication
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated54XXX | Test    | automated54XXX | Test@12345 | automated54XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated54XXX" and password "Test@12345"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    When user adds about information
      | Firstname | Lastname | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | null      | null     | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user next to education
    Then sucessful message is displayed
    When user add education information on tutor wizard
    And user enter education information on tutor wizard
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level on tutor wizard
      | Course title                           | Academic Level | Grade |
      | Level 7 (Masters degree or equivalent) | Masters        |     4 |
    And user add evidence file on tutor wizard
    Then "Sample1" evidence is added on tutor wizard
    When user enter "Certificate" category evidence on tutor wizard
    And user saving the education information on tutor wizard
    Then sucessful message is displayed
    When user next to research
    And user add publication on tutor wizard
    Then "Add" publication modal is displayed on tutor wizard
    When user enter publication information on tutor wizard
      | Title             | Publication Type | Publisher           | Date       | Tag  | Abstarct                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | Silence the storm | Book             | Automated45XXX Test | 06/02/2013 | tag1 | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving publication information on tutor wizard
    Then adding publication "Silence the storm" is successful on tutor wizard
    When user delete publication "Silence the storm" on tutor wizard
    Then confirmation is displayed on tutor wizard
    When the user confirms to remove a publication on tutor wizard
    Then removing "Silence the storm" publication is successful on tutor wizard

  @UI  @TestRails(14538)
  Scenario: C14538 - Verify editing publication
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated55XXX | Test    | automated55XXX | Test@12345 | automated55XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "Automated55XXX" and password "Test@12345"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    When user adds about information
      | Firstname | Lastname | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | null      | null     | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user next to education
    Then sucessful message is displayed
    When user add education information on tutor wizard
    And user enter education information on tutor wizard
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level on tutor wizard
      | Course title                           | Academic Level | Grade |
      | Level 7 (Masters degree or equivalent) | Masters        |     4 |
    And user add evidence file on tutor wizard
    Then "Sample1" evidence is added on tutor wizard
    When user enter "Certificate" category evidence on tutor wizard
    And user saving the education information on tutor wizard
    Then sucessful message is displayed
    When user next to research
    And user add publication on tutor wizard
    Then "Add" publication modal is displayed on tutor wizard
    When user enter publication information on tutor wizard
      | Title             | Publication Type | Publisher              | Date       | Tag  | Abstarct                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | Silence the storm | Book             | Automated45XXX Testing | 06/02/2013 | tag1 | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user saving publication information on tutor wizard
    Then adding publication "Silence the storm" is successful on tutor wizard
    When user edit publication "Silence the storm" on tutor wizard
    Then "Edit" publication modal is displayed on tutor wizard
    When user enter publication information on tutor wizard
      | Title         | Publication Type | Publisher           | Date       | Tag  | Abstarct |
      | Strange tides | Chapter          | Automated55XXX Test | 03/02/2013 | null | Test1    |
    And user saving publication information on tutor wizard
    And user edit publication "Strange tides" on tutor wizard
    Then "Edit" publication modal is displayed on tutor wizard
    And verify publication informations are correct on tutor wizard
      | Title         | Publication Type | Publisher           | Date       | Tag  | Abstarct |
      | Strange tides | Chapter          | Automated55XXX Test | 03/02/2013 | null | Test1    |

  @UI  @TestRails(14539)
  Scenario: C14539 - Verify editing spoken languages
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated56XXX | Test    | automated56XXX | Test@12345 | automated56XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated56XXX" and password "Test@12345"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    When user adds about information
      | Firstname | Lastname | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | null      | null     | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user next to education
    Then sucessful message is displayed
    When user add education information on tutor wizard
    And user enter education information on tutor wizard
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level on tutor wizard
      | Course title                           | Academic Level | Grade |
      | Level 7 (Masters degree or equivalent) | Masters        |     4 |
    And user add evidence file on tutor wizard
    Then "Sample1" evidence is added on tutor wizard
    When user enter "Certificate" category evidence on tutor wizard
    And user saving the education information on tutor wizard
    Then sucessful message is displayed
    When user next to research
    And user skip to enter research information
    And user add language spoken on tutor wizard
    And select "Fluent" english proficiency on tutor wizard
    And user add other language on tutor wizard
      | Language | Proficiency |
      | Czech    | Basic       |
    And user saving spoken language information on tutor wizard
    Then "Fluent" "English" language is added on tutor wizard
    And "Basic" "Czech" language is added on tutor wizard
    When user edit language spoken on tutor wizard
    And select "Basic" english proficiency on tutor wizard
    And user add other language on tutor wizard
      | Language | Proficiency |
      | Dutch    | Fluent      |
    And user edit "Czech" language on tutor wizard
    And user edit other language on tutor wizard
      | Language | Proficiency    |
      | Greek    | Conversational |
    And user saving spoken language information on tutor wizard
    Then "Basic" "English" language is added on tutor wizard
    And "Conversational" "Greek" language is added on tutor wizard
    And "Fluent" "Dutch" language is added on tutor wizard

  @UI  @TestRails(14540)
  Scenario: C14540 - Verify removing spoken languages
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated57XXX | Test    | automated57XXX | Test@12345 | automated57XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated57XXX" and password "Test@12345"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    When user adds about information
      | Firstname | Lastname | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | null      | null     | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user next to education
    Then sucessful message is displayed
    When user add education information on tutor wizard
    And user enter education information on tutor wizard
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level on tutor wizard
      | Course title                           | Academic Level | Grade |
      | Level 7 (Masters degree or equivalent) | Masters        |     4 |
    And user add evidence file on tutor wizard
    Then "Sample1" evidence is added on tutor wizard
    When user enter "Certificate" category evidence on tutor wizard
    And user saving the education information on tutor wizard
    Then sucessful message is displayed
    When user next to research
    And user skip to enter research information
    And user add language spoken on tutor wizard
    And select "Fluent" english proficiency on tutor wizard
    And user add other language on tutor wizard
      | Language | Proficiency |
      | Czech    | Basic       |
    And user saving spoken language information on tutor wizard
    Then "Fluent" "English" language is added on tutor wizard
    And "Basic" "Czech" language is added on tutor wizard
    When user add language spoken on tutor wizard
    And user removes "Czech" language on tutor wizard
    And user saving spoken language information on tutor wizard
    Then removing "Basic" "Czech" language is successful on tutor wizard

  @UI  @TestRails(14541)
  Scenario: C14541 - Verify uploading a profile photo when using tutor wizard
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated58XXX | Test    | automated58XXX | Test@12345 | automated58XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated58XXX" and password "Test@12345"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    When user adds about information
      | Firstname | Lastname | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | null      | null     | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user next to education
    Then sucessful message is displayed
    When user add education information on tutor wizard
    And user enter education information on tutor wizard
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level on tutor wizard
      | Course title                           | Academic Level | Grade |
      | Level 7 (Masters degree or equivalent) | Masters        |     4 |
    And user add evidence file on tutor wizard
    Then "Sample1" evidence is added on tutor wizard
    When user enter "Certificate" category evidence on tutor wizard
    And user saving the education information on tutor wizard
    Then sucessful message is displayed
    When user next to research
    And user skip to enter research information
    And user add language spoken on tutor wizard
    And select "Fluent" english proficiency on tutor wizard
    And user add other language on tutor wizard
      | Language | Proficiency |
      | Czech    | Basic       |
    And user saving spoken language information on tutor wizard
    Then "Fluent" "English" language is added on tutor wizard
    And "Basic" "Czech" language is added on tutor wizard
    When user next to services offered
    And user adds support service on tutor wizard
    And user enters services information on tutor wizard
      | Category         | Service           | Level | Expertise level | Subject        | Subject details | Description      | Study area | Study field |
      | Academic Support | Academic Tutoring | GCSE  | Expert          | Art and design | null            | Test description | null       | null        |
    And user saving support services information on tutor wizard
    Then sucessful message is displayed
    When user next to profile picture
    And user uploads a profile photo on tutor wizard
    Then crop image modal is displayed on tutor wizard
    When user crop the image on tutor wizard
    Then upload a profile photo is successful on tutor wizard

  @UI  @TestRails(14542)
  Scenario: C14542 - Verify removing a profile photo
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated59XXX | Test    | automated59XXX | Test@12345 | automated59XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated59XXX" and password "Test@12345"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    When user adds about information
      | Firstname | Lastname | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | null      | null     | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user next to education
    Then sucessful message is displayed
    When user add education information on tutor wizard
    And user enter education information on tutor wizard
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level on tutor wizard
      | Course title                           | Academic Level | Grade |
      | Level 7 (Masters degree or equivalent) | Masters        |     4 |
    And user add evidence file on tutor wizard
    Then "Sample1" evidence is added on tutor wizard
    When user enter "Certificate" category evidence on tutor wizard
    And user saving the education information on tutor wizard
    Then sucessful message is displayed
    When user next to research
    And user skip to enter research information
    And user add language spoken on tutor wizard
    And select "Fluent" english proficiency on tutor wizard
    And user add other language on tutor wizard
      | Language | Proficiency |
      | Czech    | Basic       |
    And user saving spoken language information on tutor wizard
    Then "Fluent" "English" language is added on tutor wizard
    And "Basic" "Czech" language is added on tutor wizard
    When user next to services offered
    And user adds support service on tutor wizard
    And user enters services information on tutor wizard
      | Category         | Service           | Level | Expertise level | Subject        | Subject details | Description      | Study area | Study field |
      | Academic Support | Academic Tutoring | GCSE  | Expert          | Art and design | null            | Test description | null       | null        |
    And user saving support services information on tutor wizard
    Then sucessful message is displayed
    When user next to profile picture
    And user uploads a profile photo on tutor wizard
    Then crop image modal is displayed on tutor wizard
    When user crop the image on tutor wizard
    Then upload a profile photo is successful on tutor wizard
    When user removes a profile photo on tutor wizard
    Then confirmation is displayed on tutor wizard
    When the user confirms to remove a profile photo on tutor wizard
    Then removing a profile photo is successful on tutor wizard

  @UI  @TestRails(14692)
  Scenario: C14692 - Verify uploading a photo id when using tutor wizard
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated60XXX | Test    | automated60XXX | Test@12345 | automated60XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated60XXX" and password "Test@12345"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    When user adds about information
      | Firstname | Lastname | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | null      | null     | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user next to education
    Then sucessful message is displayed
    When user add education information on tutor wizard
    And user enter education information on tutor wizard
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level on tutor wizard
      | Course title                           | Academic Level | Grade |
      | Level 7 (Masters degree or equivalent) | Masters        |     4 |
    And user add evidence file on tutor wizard
    Then "Sample1" evidence is added on tutor wizard
    When user enter "Certificate" category evidence on tutor wizard
    And user saving the education information on tutor wizard
    Then sucessful message is displayed
    When user next to research
    And user skip to enter research information
    And user add language spoken on tutor wizard
    And select "Fluent" english proficiency on tutor wizard
    And user add other language on tutor wizard
      | Language | Proficiency |
      | Czech    | Basic       |
    And user saving spoken language information on tutor wizard
    Then "Fluent" "English" language is added on tutor wizard
    And "Basic" "Czech" language is added on tutor wizard
    When user next to services offered
    And user adds support service on tutor wizard
    And user enters services information on tutor wizard
      | Category         | Service           | Level | Expertise level | Subject        | Subject details | Description      | Study area | Study field |
      | Academic Support | Academic Tutoring | GCSE  | Expert          | Art and design | null            | Test description | null       | null        |
    And user saving support services information on tutor wizard
    Then sucessful message is displayed
    When user next to profile picture
    And user uploads a profile photo on tutor wizard
    Then crop image modal is displayed on tutor wizard
    When user crop the image on tutor wizard
    Then upload a profile photo is successful on tutor wizard
    When user next to photo id
    And user uploads a photo id on tutor wizard
    Then crop image modal is displayed on tutor wizard
    When user crop the image on tutor wizard
    Then upload a photo id is successful on tutor wizard

  @UI  @TestRails(14608)
  Scenario: C14608 - Verify adding address information
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated61XXX | Test    | automated61XXX | Test@12345 | automated61XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated61XXX" and password "Test@12345"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    When user adds about information
      | Firstname | Lastname | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | null      | null     | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user next to education
    Then sucessful message is displayed
    When user add education information on tutor wizard
    And user enter education information on tutor wizard
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level on tutor wizard
      | Course title                           | Academic Level | Grade |
      | Level 7 (Masters degree or equivalent) | Masters        |     4 |
    And user add evidence file on tutor wizard
    Then "Sample1" evidence is added on tutor wizard
    When user enter "Certificate" category evidence on tutor wizard
    And user saving the education information on tutor wizard
    Then sucessful message is displayed
    When user next to research
    And user skip to enter research information
    And user add language spoken on tutor wizard
    And select "Fluent" english proficiency on tutor wizard
    And user add other language on tutor wizard
      | Language | Proficiency |
      | Czech    | Basic       |
    And user saving spoken language information on tutor wizard
    Then "Fluent" "English" language is added on tutor wizard
    And "Basic" "Czech" language is added on tutor wizard
    When user next to services offered
    And user adds support service on tutor wizard
    And user enters services information on tutor wizard
      | Category         | Service           | Level | Expertise level | Subject        | Subject details | Description      | Study area | Study field |
      | Academic Support | Academic Tutoring | GCSE  | Expert          | Art and design | null            | Test description | null       | null        |
    And user saving support services information on tutor wizard
    Then sucessful message is displayed
    When user next to profile picture
    And user uploads a profile photo on tutor wizard
    Then crop image modal is displayed on tutor wizard
    When user crop the image on tutor wizard
    Then upload a profile photo is successful on tutor wizard
    When user next to photo id
    And user uploads a photo id on tutor wizard
    Then crop image modal is displayed on tutor wizard
    When user crop the image on tutor wizard
    Then upload a photo id is successful on tutor wizard
    When user next to address
    Then sucessful message is displayed
    When user enter address information on tutor wizard
      | Country        | Address 1     | Address 2       | City   | Zip code | Province |
      | United Kingdom | Londonwriteup | 21 Hanover Road | London | NW10 3DR | Brent    |
    And user next to contact number
    Then sucessful message is displayed
    When user back to address
    Then verify address information is correct on tutor wizard
      | Country        | Address 1     | Address 2       | City   | Zip code | Province |
      | United Kingdom | Londonwriteup | 21 Hanover Road | London | NW10 3DR | Brent    |

   @UI  @TestRails(14609)
  Scenario: C14609 - Verify previous saved address will be loaded
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated62XXX | Test    | automated62XXX | Test@12345 | automated62XXX | Yes    | Yes    |
    And user select a "Student" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated62XXX" and password "Test@12345"
    Then user successfully login
    When user proceed to account settings
    Then the user is in the account settings general tab
    When user enter general information
      | First name | Last name | Date of birth | Dial code    | Phone number | Email | Timezone                                                     | Country        | Address 1     | Address 2       | City   | Zip code | Province |
      | null       | null      | 07/05/1986    | TestdialCode | Testnumber   | null  | (UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna | United Kingdom | Londonwriteup | 21 Hanover Road | London | NW10 3DR | Brent    |
    And user saving general information
    And user proceed to the dashboard page
    Then user is in dashboard page
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    When user adds about information
      | Firstname | Lastname | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | null      | null     | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    And user next to education
    Then sucessful message is displayed
    When user add education information on tutor wizard
    And user enter education information on tutor wizard
      | Country        | Institution                 | City      | Start year | End year |
      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    And user add education level on tutor wizard
      | Course title                           | Academic Level | Grade |
      | Level 7 (Masters degree or equivalent) | Masters        |     4 |
    And user add evidence file on tutor wizard
    Then "Sample1" evidence is added on tutor wizard
    When user enter "Certificate" category evidence on tutor wizard
    And user saving the education information on tutor wizard
    Then sucessful message is displayed
    When user next to research
    And user skip to enter research information
    And user add language spoken on tutor wizard
    And select "Fluent" english proficiency on tutor wizard
    And user add other language on tutor wizard
      | Language | Proficiency |
      | Czech    | Basic       |
    And user saving spoken language information on tutor wizard
    Then "Fluent" "English" language is added on tutor wizard
    And "Basic" "Czech" language is added on tutor wizard
    When user next to services offered
    And user adds support service on tutor wizard
    And user enters services information on tutor wizard
      | Category         | Service           | Level | Expertise level | Subject        | Subject details | Description      | Study area | Study field |
      | Academic Support | Academic Tutoring | GCSE  | Expert          | Art and design | null            | Test description | null       | null        |
    And user saving support services information on tutor wizard
    Then sucessful message is displayed
    When user next to profile picture
    And user uploads a profile photo on tutor wizard
    Then crop image modal is displayed on tutor wizard
    When user crop the image on tutor wizard
    Then upload a profile photo is successful on tutor wizard
    When user next to photo id
    And user uploads a photo id on tutor wizard
    Then crop image modal is displayed on tutor wizard
    When user crop the image on tutor wizard
    Then upload a photo id is successful on tutor wizard
    When user next to address
    Then sucessful message is displayed
    And verify address information is correct on tutor wizard
      | Country        | Address 1     | Address 2       | City   | Zip code | Province |
      | United Kingdom | Londonwriteup | 21 Hanover Road | London | NW10 3DR | Brent    |

  Scenario: C14610 - Verify adding contact number

  Scenario: C14611 - Verify editing contact number

  Scenario: C1463 - Verify adding reference

  Scenario: C1463 - Verify removing reference

  Scenario: C1463 - Verify term and condition

  Scenario: C1463 - Verify privacy policy

  Scenario: C1463 - Verify accepting the declaration

  Scenario: C1463 - Verify uploading DBS document
  
  Scenario: C14697 - Verify student notification when tutor application declined 
