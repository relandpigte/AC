Feature: Tutor course

  @UI  @TestRails(C15195)
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

  @UI  @TestRails(15198)
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

  @UI  @TestRails(15199)
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

  @UI  @TestRails(15193) 
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

  @UI  @TestRails(15194)
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

  @UI  @TestRails(15197)
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

  @UI  @TestRails(15200)
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

  @UI  @TestRails(15201)
  Scenario: C15201	Verify that tutor can change the course type -draft
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

  @UI  @TestRails(15202)
  Scenario: C15202	Verify that tutor should see course progress in course settings -draft
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

  @UI  @TestRails(15203)
  Scenario: C15203	Verify that tutor should see comments section in course settings -draft
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

  @UI  @TestRails(15204)
  Scenario: C15204	Verify that tutor should see custom url section in course settings -draft
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

  @UI  @TestRails(15205)
  Scenario: C15205	Verify that tutor should see autoplay section in course settings -draft
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
@UI  @TestRails(15212)
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
    
    
    
Scenario: C15214	Verify that tutor can create the first module -draft	
        Given User is in academically login page
    # When user login as "admin"
    # Then user successfully login
    # When user proceed to manage user
    # Then user is in manage user page
    # When user add a new user
    # And user enter a user details
    #   | Name            | Surname | Username        | Password   | Email           | Active | Public |
    #   | Automated113XXX | Test    | automated113XXX | Test@12345 | automated113XXX | Yes    | Yes    |
    # And user select a "Tutor" role
    # And user saving user details
    # Then sucessful message is displayed
    # When user logout in academically
    # Then user is in academically login page
    # When user enter username "automated113XXX" and password "Test@12345"
    When user enter username "automated102201726" and password "Test@12345"
    Then user successfully login
    When user proceed to the course tab
    And user create a new course
      | Template | Course name     |
      | Blank    | automated113XXX |
    Then user is in the course details
    When user proceed to the curriculum tab		
    Then user is in curriculum tab
    When user create a first module
    Then u

Scenario:	C15215	Verify that tutor can choose a template for the lesson -draft			
Scenario:	C15216	Verify that tutor can enter a name for the lesson -draft			
Scenario:	C15217	Verify that tutor should see the entire course on the curriculum tab -draft			
Scenario:	C15218	Verify that tutor should be able to duplicate the module, lesson and unit -draft			
Scenario:	C15219	Verify that tutor should be able to delete the module, lesson and unit -draft			
Scenario:	C15220	Verify that tutor should be able to edit the module, lesson and unit -draft			
Scenario:	C15221	Verify that tutor should have the option to view the module, lesson and unit -draft			
Scenario:	C15222	Verify that tutor should proceed to the page builder if user click on/lesson/unit/module name -draft			
Scenario:	C15223	Verify that tutor has the ability to add more sections to the course -draft			
Scenario:	C15224	Verify that tutor can add a lesson within the module -draft			
Scenario:	C15225	Verify that tutor can add a unit within the module -draft			
Scenario:	C15226	Verify that tutor can add a lesson within the unit -draft 			
Scenario:	C15228	Verify that tutor can add a new section to the page builder -draft