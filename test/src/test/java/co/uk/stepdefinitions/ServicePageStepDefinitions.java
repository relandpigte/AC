package co.uk.stepdefinitions;

import co.uk.core.DriverHandler;
import co.uk.pageobjects.ServicesPage;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class ServicePageStepDefinitions {

	@Then("^user is in service wizard page$")
	public void verifyServicePageIsDisplayed() {
		ServicesPage.verifyServicePageisDisplayed();
	}
	
	@When("^user click request support$")
	public void clickRequestSupport() {
		ServicesPage.clickRequestSupport();
	}
	
	@When("^user select \"(.*)\" service$")
	public void clickServices(String service) {
		DriverHandler.delay(3);
		ServicesPage.Step1.clickService(service);
	}
	
	@When("^user click continue to step2$")
	public void clickContinuetostep2() {
		ServicesPage.Step1.clickContinue();
	}
	
	@Then("^user is in step 2$")
	public void verifyServiceLevelIsDisplayed() {
		DriverHandler.delay(2);
		ServicesPage.Steps2.verifyPage2IsDisplayed();
	}
	
	@When("^user select \"(.*)\" level for the service$")
	public void clickServiceLevel(String serviceLevel) {
		ServicesPage.Steps2.clickServiceLevel(serviceLevel);
	}
	
	@When("^user click continue to step 3$")
	public void clickContinueToStep3() {
		ServicesPage.Steps2.clickContinue();
	}
	
	@Then("^user in in step 3$")
	public void verifyStep3IsDisplayed() {
		DriverHandler.delay(2);
		ServicesPage.Step3.verifyPage3IsDisplayed();
	}
	
	@Then("^the \"(.*)\" level is displyed$")
	public void verifyServiceLevelOptionIsDisplayed(String level) {
		ServicesPage.Steps2.verifyServiceIsDisplayed(level);
	}
	
	@Then("^the service \"(.*)\" is displayed$")
	public void verifyServiceOptionIsDisplayed(String service) {
		ServicesPage.Step1.verifyServiceIsDisplayed(service);
	}
	
	@When("^user select \"(.*)\"$")
	public void clickSingleService(String service) {
		ServicesPage.Step3.clickService(service);
	}
	
	@When("^user click continue to step 4$")
	public void clickContinueToStep4() {
		ServicesPage.Step3.clickContinue();
	}
	
	@Then("^user is in step 4$")
	public void verifyStep4IsDisplayed() {
		DriverHandler.delay(2);
		ServicesPage.Step4.verifyPage4IsDisplayed();
	}
}
