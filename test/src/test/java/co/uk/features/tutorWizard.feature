Feature: Tutor Wizard

  @UI @TestRails(C14520)
  Scenario: C14520 - Verify opening the tutor wizard from dashboard
    Given User is in academically login page
    When user login as "student"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page

  @UI @TestRails(C14521)
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

  @UI @TestRails(C14522)
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

  @UI @TestRails(C14523)
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

  @UI @TestRails(C14524)
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

  @UI @TestRails(C14525)
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

  @UI @TestRails(C14526)
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

  @UI @TestRails(C14527)
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

  @UI @TestRails(C14528)
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
    When user skip to enter research information
    And user add language spoken on tutor wizard
    And select "Fluent" english proficiency on tutor wizard
    And user add other language on tutor wizard
      | Language | Proficiency |
      | Czech    | Basic       |
    And user saving spoken language information on tutor wizard
    Then sucessful message is displayed
    And "Fluent" "English" language is added
    And "Basic" "Czech" language is added

  @??
  Scenario: C14529 - Verify adding support services from the tutor wizard
    Given User is in academically login page
    #        When user login as "admin"
    #        Then user successfully login
    #        When user proceed to manage user
    #        Then user is in manage user page
    #        When user add a new user
    #        And user enter a user details
    #          | Name           | Surname | Username       | Password   | Email          | Active | Public |
    #          | Automated47XXX | Test    | automated47XXX | Test@12345 | automated47XXX | Yes    | Yes    |
    #        And user select a "Student" role
    #        And user saving user details
    #        Then sucessful message is displayed
    #        When user logout in academically
    #        Then user is in academically login page
    When user enter username "automated41155452" and password "Test@12345"
    Then user successfully login
    When user wants to become a tutor on the dashboard page
    Then confirmation of  become a tutor modal is displayed
    When user confirms to become a tutor
    Then user is in tutor wizard page
    #       When user adds about information
    #         | Firstname      | Lastname | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
    #         | null | null     | "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." |
    #       And user next to education
    #       Then sucessful message is displayed
    #    When user add education information on tutor wizard
    #    And user enter education information on tutor wizard
    #      | Country        | Institution                 | City      | Start year | End year |
    #      | United Kingdom | The University of Cambridge | Cambridge |       1995 |     2000 |
    #    And user add education level on tutor wizard
    #      | Course title                           | Academic Level | Grade |
    #      | Level 7 (Masters degree or equivalent) | Masters        |     4 |
    #    And user add evidence file on tutor wizard
    #		Then "Sample1" evidence is added on tutor wizard
    #		When user enter "Certificate" category evidence on tutor wizard
    #    And user saving the education information on tutor wizard
    #    Then sucessful message is displayed
    # When user skip to enter research information
    # And user add language spoken on tutor wizard
    # And select "Fluent" english proficiency on tutor wizard
    # And user add other language on tutor wizard
    #   | Language | Proficiency |
    #   | Czech    | Basic       |
    # And user saving spoken language information on tutor wizard
    # Then sucessful message is displayed
    # And "Fluent" "English" language is added
    # And "Basic" "Czech" language is added
    When user next to services offered
    And user adds support service on tutor wizard
    And user enters services information on tutor wizard
      | Category | Service | Level | Expertise level | Subject | Subject details | Description |
    ####????????????????????
    And user saving support services information on tutor wizard
    Then sucessful message is displayed

  @?? @automated48XXX
  Scenario: C14530 - Verify removing user education information

  @?? @automated49XXX
  Scenario: C14633 - Verify editing user education information

  @?? @automated50XXX
  Scenario: C14532 - Verify removing user education information by evidence

  @UI @TestRails(C14528)
  Scenario: C14533 - Verify removing research interest
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated51XXX | Test    | automated43XXX | Test@12345 | automated51XXX | Yes    | Yes    |
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

  @?? @automated52XXX
  Scenario: C14534 - Verify editing research interest

  @UI @TestRails(C14535)
  Scenario: C14535 - Verify removing research methodology
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated53XXX | Test    | automated43XXX | Test@12345 | automated53XXX | Yes    | Yes    |
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

  @?? @automated53XXX
  Scenario: C14536 - Verify editing research methodology

  @UI @TestRails(C14537)
  Scenario: C14537 - Verify removing publication
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name           | Surname | Username       | Password   | Email          | Active | Public |
      | Automated54XXX | Test    | automated45XXX | Test@12345 | automated54XXX | Yes    | Yes    |
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

  @??
  Scenario: C14538 - Verify editing publication
