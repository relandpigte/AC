package co.uk.stepdefinitions;

import co.uk.core.DriverHandler;
import co.uk.pageobjects.StudentProjectCreationPage;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class ServicePageStepDefinitions {

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
}
