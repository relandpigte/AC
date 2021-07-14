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
		DriverHandler.delay(1);
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
		ServicesPage.Step3.verifyPage3IsDisplayed();
	}
}
