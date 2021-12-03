Feature: Tutor course

  @UI @TestRails(C15195) @Parallel
  Scenario: C15195	Verify that tutor can see the list of courses
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name            | Surname | Username        | Password   | Email           | Active | Public |
      | Automated100XXX | Test    | automated100XXX | Test@12345 | automated100XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated100XXX" and password "Test@12345"
    Then user successfully login
    When user proceed to the course tab
    And user create a new course
      | Template | Course name       |
      | Blank    | automated100-1XXX |
    Then user is in the course details
    When user proceed to the dashboard page
    And user proceed to the course tab
    And user create a new course
      | Template | Course name       |
      | Blank    | automated100-2XXX |
    Then user is in the course details
    When user proceed to the dashboard page
    And user proceed to the course tab
    Then user should see "automated100-1XXX" course
    Then user should see "automated100-2XXX" course

  @UI @TestRails(15198) @Parallel
  Scenario: C15198	Verify that tutor can create a course
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name            | Surname | Username        | Password   | Email           | Active | Public |
      | Automated101XXX | Test    | automated101XXX | Test@12345 | automated101XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated101XXX" and password "Test@12345"
    Then user successfully login
    When user proceed to the course tab
    And user create a new course
      | Template | Course name     |
      | Blank    | automated101XXX |
    Then user is in the course details

  @UI @TestRails(15199) @Parallel
  Scenario: C15199	Verify that tutor is able to add course details
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name            | Surname | Username        | Password   | Email           | Active | Public |
      | Automated102XXX | Test    | automated102XXX | Test@12345 | automated102XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated102XXX" and password "Test@12345"
    Then user successfully login
    When user proceed to the course tab
    And user create a new course
      | Template | Course name     |
      | Blank    | automated102XXX |
    Then user is in the course details
    When user add course details
      | Name              | Subtitle | Description |
      | automated102XXX-1 | Testing  | Lorem ipsum |
    And user save the course details
    Then sucessful message is displayed
    When user proceed to the dashboard page
    And user proceed to the course tab
    And user procced to the "automated102XXX-1" course
    Then the course details are correct
      | Name              | Subtitle | Description | Categories | Course image | Pricing | Language |
      | automated102XXX-1 | Testing  | Lorem ipsum | null       | null         | null    | null     |

  @UI @TestRails(15193) @Parallel
  Scenario: C15193	Verify that tutor can upload an image for the main thumbnail of his or her course
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name            | Surname | Username        | Password   | Email           | Active | Public |
      | Automated103XXX | Test    | automated103XXX | Test@12345 | automated103XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated103XXX" and password "Test@12345"
    Then user successfully login
    When user proceed to the course tab
    And user create a new course
      | Template | Course name     |
      | Blank    | automated103XXX |
    Then user is in the course details
    When user add course details
      | Name            | Subtitle | Description | Categories | Course image | Pricing | Currency | Language |
      | automated103XXX | Testing  | Lorem ipsum | null       | Sample1.jpg  | null    | null     | null     |
    And user save the course details
    Then sucessful message is displayed
    When user proceed to the dashboard page
    And user proceed to the course tab
    Then image uploaded in the course "automated103XXX" will then be displayed as a thumbnail
    And user procced to the "automated103XXX" course
    Then the course details are correct
      | Name            | Subtitle | Description | Categories | Course image | Pricing | Currency | Language |
      | automated103XXX | Testing  | Lorem ipsum | null       | Sample1.jpg  | null    | null     | null     |

  @UI @TestRails(15194) @Parallel
  Scenario: C15194	Verify that tutor can set the course price
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name            | Surname | Username        | Password   | Email           | Active | Public |
      | Automated104XXX | Test    | automated104XXX | Test@12345 | automated104XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated104XXX" and password "Test@12345"
    Then user successfully login
    When user proceed to the course tab
    And user create a new course
      | Template | Course name     |
      | Blank    | automated104XXX |
    Then user is in the course details
    When user add course details
      | Name            | Subtitle | Description | Categories | Course image | Pricing | Currency | Language |
      | automated104XXX | Testing  | Lorem ipsum | null       | null         |      50 | USD      | null     |
    And user save the course details
    Then sucessful message is displayed
    When user proceed to the dashboard page
    And user proceed to the course tab
    And user procced to the "automated104XXX" course
    Then the course details are correct
      | Name            | Subtitle | Description | Categories | Course image | Pricing | Currency | Language |
      | automated104XXX | Testing  | Lorem ipsum | null       | null         |      50 | USD      | null     |

  @UI @TestRails(15197) @Parallel
  Scenario: C15197	Verify that tutor can add a language of the course
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name            | Surname | Username        | Password   | Email           | Active | Public |
      | Automated105XXX | Test    | automated105XXX | Test@12345 | automated105XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated105XXX" and password "Test@12345"
    Then user successfully login
    When user proceed to the course tab
    And user create a new course
      | Template | Course name     |
      | Blank    | automated105XXX |
    Then user is in the course details
    When user add course details
      | Name            | Subtitle | Description | Categories | Course image | Pricing | Currency | Language |
      | automated105XXX | Testing  | Lorem ipsum | null       | null         | null    | null     | English  |
    And user save the course details
    Then sucessful message is displayed
    When user proceed to the dashboard page
    And user proceed to the course tab
    And user procced to the "automated105XXX" course
    Then the course details are correct
      | Name            | Subtitle | Description | Categories | Course image | Pricing | Currency | Language |
      | automated105XXX | Testing  | Lorem ipsum | null       | null         | null    | null     | English  |

  @UI @TestRails(15200) @Parallel
  Scenario: C15200	Verify that tutor should see a category in detail for the course
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name            | Surname | Username        | Password   | Email           | Active | Public |
      | Automated106XXX | Test    | automated106XXX | Test@12345 | automated106XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated106XXX" and password "Test@12345"
    Then user successfully login
    When user proceed to the course tab
    And user create a new course
      | Template | Course name     |
      | Blank    | automated106XXX |
    Then user is in the course details
    And category field is displayed

  @UI @TestRails(15201) @Parallel
  Scenario: C15201	Verify that tutor can change the course type
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name            | Surname | Username        | Password   | Email           | Active | Public |
      | Automated107XXX | Test    | automated107XXX | Test@12345 | automated107XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated107XXX" and password "Test@12345"
    Then user successfully login
    When user proceed to the course tab
    And user create a new course
      | Template | Course name     |
      | Blank    | automated107XXX |
    Then user is in the course details
    When user proceed to the course settings tab
    And user selects course configuration to Standard
    And user save the course settings
    Then sucessful message is displayed

  @UI @TestRails(15202) @Parallel
  Scenario: C15202	Verify that tutor should see course progress in course settings
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name            | Surname | Username        | Password   | Email           | Active | Public |
      | Automated108XXX | Test    | automated108XXX | Test@12345 | automated108XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated108XXX" and password "Test@12345"
    Then user successfully login
    When user proceed to the course tab
    And user create a new course
      | Template | Course name     |
      | Blank    | automated108XXX |
    Then user is in the course details
    When user proceed to the course settings tab
    Then course progress section is displayed

  @UI @TestRails(15203) @Parallel
  Scenario: C15203	Verify that tutor should see comments section in course settings
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name            | Surname | Username        | Password   | Email           | Active | Public |
      | Automated109XXX | Test    | automated109XXX | Test@12345 | automated109XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated109XXX" and password "Test@12345"
    Then user successfully login
    When user proceed to the course tab
    And user create a new course
      | Template | Course name     |
      | Blank    | automated109XXX |
    Then user is in the course details
    When user proceed to the course settings tab
    Then comment section is displayed

  @UI @TestRails(15204) @Parallel
  Scenario: C15204	Verify that tutor should see custom url section in course settings
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name            | Surname | Username        | Password   | Email           | Active | Public |
      | Automated110XXX | Test    | automated110XXX | Test@12345 | automated110XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated110XXX" and password "Test@12345"
    Then user successfully login
    When user proceed to the course tab
    And user create a new course
      | Template | Course name     |
      | Blank    | automated110XXX |
    Then user is in the course details
    When user proceed to the course settings tab
    Then custom url section is displayed

  @UI @TestRails(15205) @Parallel
  Scenario: C15205	Verify that tutor should see autoplay section in course settings
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name            | Surname | Username        | Password   | Email           | Active | Public |
      | Automated111XXX | Test    | automated111XXX | Test@12345 | automated111XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated111XXX" and password "Test@12345"
    Then user successfully login
    When user proceed to the course tab
    And user create a new course
      | Template | Course name     |
      | Blank    | automated111XXX |
    Then user is in the course details
    When user proceed to the course settings tab
    Then autoplay section is displayed

  @UI @TestRails(15212) @Parallel
  Scenario: C15212	Verify that tutor should see course visibility section in course settings -draft
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name            | Surname | Username        | Password   | Email           | Active | Public |
      | Automated112XXX | Test    | automated112XXX | Test@12345 | automated112XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated112XXX" and password "Test@12345"
    Then user successfully login
    When user proceed to the course tab
    And user create a new course
      | Template | Course name     |
      | Blank    | automated112XXX |
    Then user is in the course details
    When user proceed to the course settings tab
    Then course visibility section is displayed

  @UI @TestRails(15214) @Parallel
  Scenario: C15214	Verify that tutor can create the first module
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name            | Surname | Username        | Password   | Email           | Active | Public |
      | Automated113XXX | Test    | automated113XXX | Test@12345 | automated113XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated113XXX" and password "Test@12345"
    #When user enter username "automated113103656" and password "Test@12345"
    Then user successfully login
    When user proceed to the course tab
    And user create a new course
      | Template | Course name     |
      | Blank    | automated113XXX |
    Then user is in the course details
    When user proceed to the curriculum tab
    Then user is in curriculum tab
    When user create a first module
    Then module name "Module 1" is displayed in curriculum tab

  @UI @TestRails(15213) @Parallel
  Scenario: C15213	Verify that tutor can create the first lesson
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name            | Surname | Username        | Password   | Email           | Active | Public |
      | Automated114XXX | Test    | automated114XXX | Test@12345 | automated114XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated114XXX" and password "Test@12345"
    #When user enter username "automated113103656" and password "Test@12345"
    Then user successfully login
    When user proceed to the course tab
    And user create a new course
      | Template | Course name     |
      | Blank    | automated114XXX |
    Then user is in the course details
    When user proceed to the curriculum tab
    Then user is in curriculum tab
    When user create a first lesson
    Then lesson name "Lesson 1" is displayed in curriculum tab

  @UI @TestRails(15217) @Parallel
  Scenario: C15217	Verify that tutor should see the entire course on the curriculum tab -draft
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name            | Surname | Username        | Password   | Email           | Active | Public |
      | Automated115XXX | Test    | automated115XXX | Test@12345 | automated115XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated115XXX" and password "Test@12345"
    #When user enter username "automated27100701" and password "Test@12345"
    Then user successfully login
    When user proceed to the course tab
    And user create a new course
      | Template | Course name     |
      | Blank    | automated115XXX |
    Then user is in the course details
    When user proceed to the curriculum tab
    Then user is in curriculum tab
    When user create a first module
    And user proceed to the dashboard page
    And user proceed to the course tab
    And user proceed to the course name "automated115XXX"
    Then user is in the course details
    When user proceed to the curriculum tab
    Then user is in curriculum tab
    When user create a new lesson "Lesson 1" within "Module 1"
    Then created lesson "Lesson 1" within "Module 1" is displayed
    When user create a new unit "Unit 1" within "Module 1"
    Then created unit "Unit 1" within "Module 1" is displayed
    When user create a new Lesson "Lesson 2" within "Unit 1"
    Then created lesson "Lesson 2" within "Unit 1" is displayed

  Scenario: C15218	Verify that tutor should be able to duplicate the module, lesson and unit -draft
    Given User is in academically login page
    #When user login as "admin"
    #Then user successfully login
    #When user proceed to manage user
    #Then user is in manage user page
    #When user add a new user
    #And user enter a user details
    #  | Name            | Surname | Username        | Password   | Email           | Active | Public |
    #  | Automated116XXX | Test    | automated116XXX | Test@12345 | automated116XXX | Yes    | Yes    |
    #And user select a "Tutor" role
    #And user saving user details
    #Then sucessful message is displayed
    #When user logout in academically
    #Then user is in academically login page
    #When user enter username "automated116XXX" and password "Test@12345"
    When user enter username "automated113103656" and password "Test@12345"
    Then user successfully login
    When user proceed to the course tab
    And user create a new course
      | Template | Course name     |
      | Blank    | automated116XXX |
    Then user is in the course details
    When user proceed to the curriculum tab
    Then user is in curriculum tab
    When user create a first module
    And user proceed to the dashboard page
    And user proceed to the course tab
    And user proceed to the course name "automated116XXX"
    Then user is in the course details
    When user proceed to the curriculum tab
    Then user is in curriculum tab
    When user create a new lesson "Lesson 1" within "Module 1"
    Then created lesson "Lesson 1" within "Module 1" is displayed
    When user create a new unit "Unit 1" within "Module1"
    Then created unit "Unit 1" within "Module 1" is displayed
    When user create a new Lesson "Lesson 2" within "Unit 1"
    Then created lesson "Lesson 2" within "Unit 1" is displayed

  ## Then module name "Module 1" is displayed in curriculum tab
  @117
  Scenario: C15219	Verify that tutor should be able to delete the module, lesson and unit -draft

  @118
  Scenario: C15220	Verify that tutor should be able to edit the module, lesson and unit -draft

  @119
  Scenario: C15221	Verify that tutor should have the option to view the module, lesson and unit -draft

  @120
  Scenario: C15222	Verify that tutor should proceed to the page builder if user click on/lesson/unit/module name -draft

  @121
  Scenario: C15223	Verify that tutor has the ability to add more sections to the course -draft

  @UI @TestRails(15224) @Parallel
  Scenario: C15224	Verify that tutor can add a lesson within the module -draft
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name            | Surname | Username        | Password   | Email           | Active | Public |
      | Automated122XXX | Test    | automated122XXX | Test@12345 | automated122XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    #When user enter username "automated122XXX" and password "Test@12345"
    #When user enter username "automated113103656" and password "Test@12345"
    Then user successfully login
    When user proceed to the course tab
    And user create a new course
      | Template | Course name     |
      | Blank    | automated122XXX |
    Then user is in the course details
    When user proceed to the curriculum tab
    Then user is in curriculum tab
    When user create a first module
    And user proceed to the dashboard page
    And user proceed to the course tab
    And user proceed to the course name "automated122XXX"
    Then user is in the course details
    When user proceed to the curriculum tab
    Then user is in curriculum tab
    When user create a new lesson "Lesson 1" within "Module 1"
    Then created lesson "Lesson 1" within "Module 1" is displayed

  @UI @TestRails(15225) @Parallel
  Scenario: C15225	Verify that tutor can add a unit within the module -draft
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name            | Surname | Username        | Password   | Email           | Active | Public |
      | Automated123XXX | Test    | automated123XXX | Test@12345 | automated123XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated123XXX" and password "Test@12345"
    #When user enter username "automated113103656" and password "Test@12345"
    Then user successfully login
    When user proceed to the course tab
    And user create a new course
      | Template | Course name     |
      | Blank    | automated123XXX |
    Then user is in the course details
    When user proceed to the curriculum tab
    Then user is in curriculum tab
    When user create a first module
    And user proceed to the dashboard page
    And user proceed to the course tab
    And user proceed to the course name "automated123XXX"
    Then user is in the course details
    When user proceed to the curriculum tab
    Then user is in curriculum tab
    When user create a new unit "Unit 1" within "Module 1"
    Then created unit "Unit 1" within "Module 1" is displayed

  @UI @TestRails(15226) @Parallel
  Scenario: C15226	Verify that tutor can add a lesson within the unit -draft
    Given User is in academically login page
    When user login as "admin"
    Then user successfully login
    When user proceed to manage user
    Then user is in manage user page
    When user add a new user
    And user enter a user details
      | Name            | Surname | Username        | Password   | Email           | Active | Public |
      | Automated124XXX | Test    | automated124XXX | Test@12345 | automated124XXX | Yes    | Yes    |
    And user select a "Tutor" role
    And user saving user details
    Then sucessful message is displayed
    When user logout in academically
    Then user is in academically login page
    When user enter username "automated124XXX" and password "Test@12345"
    #When user enter username "automated113103656" and password "Test@12345"
    Then user successfully login
    When user proceed to the course tab
    And user create a new course
      | Template | Course name     |
      | Blank    | automated124XXX |
    Then user is in the course details
    When user proceed to the curriculum tab
    Then user is in curriculum tab
    When user create a first module
    And user proceed to the dashboard page
    And user proceed to the course tab
    And user proceed to the course name "automated124XXX"
    Then user is in the course details
    When user proceed to the curriculum tab
    Then user is in curriculum tab
    When user create a new unit "Unit 1" within "Module 1"
    And user proceed to the dashboard page
    And user proceed to the course tab
    And user proceed to the course name "automated123XXX"
    Then user is in the course details
    When user proceed to the curriculum tab
    Then user is in curriculum tab
    And created unit "Unit 1" within "Module 1" is displayed
    When user create a new Lesson "Lesson 1" within "Unit 1"
    Then created lesson "Lesson 1" within "Unit 1" is displayed

  Scenario: C15228	Verify that tutor can add a new section to the page builder -draft
