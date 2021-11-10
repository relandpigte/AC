package co.uk.stepdefinitions;

import java.util.List;
import java.util.Map;

import co.uk.core.DriverHandler;
import co.uk.pageobjects.AdminManageUserPage;
import co.uk.pageobjects.StudentProjectCreationPage;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class StudentProjectCreationPageStepDefinitions {

	@Then("^user is in service wizard page$")
	public void verifyServicePageIsDisplayed() {
		StudentProjectCreationPage.verifyServicePageisDisplayed();
	}
	
	@When("^user click request support$")
	public void clickRequestSupport() {
		StudentProjectCreationPage.clickRequestSupport();
	}
	
	@When("^user select \"(.*)\" service$")
	public void clickServices(String service) {
		DriverHandler.delay(3);
		StudentProjectCreationPage.Step1.clickService(service);
	}
	
	@When("^user click continue to step2$")
	public void clickContinuetostep2() {
		StudentProjectCreationPage.Step1.clickContinue();
	}
	
	@Then("^user is in step 2$")
	public void verifyServiceLevelIsDisplayed() {
		DriverHandler.delay(2);
		StudentProjectCreationPage.Steps2.verifyPage2IsDisplayed();
	}
	
	@When("^user select \"(.*)\" level for the service$")
	public void clickServiceLevel(String serviceLevel) {
		StudentProjectCreationPage.Steps2.clickServiceLevel(serviceLevel);
	}
	
	@When("^user click continue to step 3$")
	public void clickContinueToStep3() {
		StudentProjectCreationPage.Steps2.clickContinue();
	}
	
	@Then("^user in in step 3$")
	public void verifyStep3IsDisplayed() {
		DriverHandler.delay(2);
		StudentProjectCreationPage.Step3.verifyPage3IsDisplayed();
	}
	
	@Then("^the \"(.*)\" level is displyed$")
	public void verifyServiceLevelOptionIsDisplayed(String level) {
		StudentProjectCreationPage.Steps2.verifyServiceIsDisplayed(level);
	}
	
	@Then("^the service \"(.*)\" is displayed$")
	public void verifyServiceOptionIsDisplayed(String service) {
		StudentProjectCreationPage.Step1.verifyServiceIsDisplayed(service);
	}
	
	@When("^user select \"(.*)\"$")
	public void clickSingleService(String service) {
		StudentProjectCreationPage.Step3.clickService(service);
	}
	
	@When("^user click continue to step 4$")
	public void clickContinueToStep4() {
		StudentProjectCreationPage.Step3.clickContinue();
	}
	
	@Then("^user is in step 4$")
	public void verifyStep4IsDisplayed() {
		DriverHandler.delay(2);
		StudentProjectCreationPage.Step4.verifyPage4IsDisplayed();
	}
	
	@Then("^project name textbox is displayed$")
	public void verifyProjectNameTextboxIsDisplayed(){
		StudentProjectCreationPage.Step4.verifyPrjectNameTextBoxIsDisplayed();
	}
	
	@When("^user enter project name \"(.*)\"$")
	public void enterProjectName(String projectname) {
		StudentProjectCreationPage.Step4.enterProjectName(projectname.replace("XXX", DriverHandler.timestamp));
		StudentProjectCreationPage.Step4.clickCreate();
		DriverHandler.delay(2);
	}
	
	@When("^user enter project details$")
	public void enterProjectDetails(DataTable userDetails) {
		List<Map<String, String>> data = userDetails.asMaps(String.class, String.class);
        String projectName = data.get(0).get("Project name");
        String description = data.get(0).get("Description");
        String academicLevel = data.get(0).get("Academic level");
        String qualification = data.get(0).get("Qualification");
        String methodology = data.get(0).get("Methodology");
        String subjectArea = data.get(0).get("Subject area");
        String subjectKeywords = data.get(0).get("Subject keywords");
        String urgencyLevel = data.get(0).get("Urgency level");
        String deadline = data.get(0).get("Deadline");
     
        if(!projectName.equals("null")) {
        	StudentProjectCreationPage.Step4.enterProjectName(projectName.replace("XXX", DriverHandler.timestamp));
        }
        if(description.equals("Lorem Ipsum")) {
        	StudentProjectCreationPage.Step4.enterDescription("\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"");
        	DriverHandler.delay(1);
        }
        if(!description.equals("Lorem Ipsum") && (!description.equals("null"))){
        	StudentProjectCreationPage.Step4.enterDescription(description);
        	DriverHandler.delay(1);
        }
        if(!academicLevel.equals("null")){
        	StudentProjectCreationPage.Step4.selectAcademicLevel(academicLevel);
        	DriverHandler.delay(1);
        }
        if(!qualification.equals("null")){
        	StudentProjectCreationPage.Step4.selectQualification(qualification);
        	DriverHandler.delay(1);
        }
        if(!methodology.equals("null")){
        	StudentProjectCreationPage.Step4.selectMethodology(methodology);
        	DriverHandler.delay(1);
        }
        if(!subjectArea.equals("null")){
        	StudentProjectCreationPage.Step4.selectSubjectArea(subjectArea);
        	DriverHandler.delay(1);
        }
        if(!subjectKeywords.equals("null")){
        	StudentProjectCreationPage.Step4.enterSubjectKeyword(subjectKeywords);
        	DriverHandler.delay(1);
        }
        if(!urgencyLevel.equals("null")){
        	StudentProjectCreationPage.Step4.selectUrgencyLevel(urgencyLevel);
        	DriverHandler.delay(1);
        }
        if(deadline.equals("Except Weekends")){
        	StudentProjectCreationPage.Step4.selectDeadlineDateExceptWeekends();
        }
        if(!deadline.equals("null")&&!deadline.equals("Except Weekends")){
        	StudentProjectCreationPage.Step4.enterDeadline(deadline);
        }
	}
	
	@When("^user sets availability \"(.*)\"$")
	public void setAvailability(String availability) {
		StudentProjectCreationPage.Step4.clickAddAvailability();
		StudentProjectCreationPage.Step4.AvailabilityModal.clickAvailability(availability);
	}
	
	@When("^user save availability details$")
	public void saveAvailabilityDetails() {
		StudentProjectCreationPage.Step4.AvailabilityModal.clickSave();
		DriverHandler.delay(1);
	}
	
	@Then("^availability details are displayed correctly$")
	public void verifyAvailabilityIsCorrect(DataTable userDetails) {
		List<Map<String, String>> data = userDetails.asMaps(String.class, String.class);
        String monday = data.get(0).get("Monday");
        String tuesday = data.get(0).get("Tuesday");
        String wednesday = data.get(0).get("Wednesday");
        String thursday = data.get(0).get("Thursday");
        String friday = data.get(0).get("Friday");
        String saturday = data.get(0).get("Saturday");
        String sunday = data.get(0).get("Sunday");
        if(!monday.equals("null")){
        	StudentProjectCreationPage.Step4.verifyAvailabilityIsCorrect("Monday", monday);
        }
        if(!tuesday.equals("null")){
        	StudentProjectCreationPage.Step4.verifyAvailabilityIsCorrect("Tuesday", tuesday);
        }
        if(!wednesday.equals("null")){
        	StudentProjectCreationPage.Step4.verifyAvailabilityIsCorrect("Wednesday", wednesday);
        }
        if(!thursday.equals("null")){
        	StudentProjectCreationPage.Step4.verifyAvailabilityIsCorrect("Thursday", thursday);
        }
        if(!friday.equals("null")){
        	StudentProjectCreationPage.Step4.verifyAvailabilityIsCorrect("Friday", friday);
        }
        if(!saturday.equals("null")){
        	StudentProjectCreationPage.Step4.verifyAvailabilityIsCorrect("Saturday", saturday);
        }
        if(!sunday.equals("null")){
        	StudentProjectCreationPage.Step4.verifyAvailabilityIsCorrect("Sunday", sunday);
        }
        
	}
	
	@When("^user will save the details to create a new project$")
	public void userSaveProjectDetails() {
		StudentProjectCreationPage.Step4.clickCreate();
	}
}
