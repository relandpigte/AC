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
		DriverHandler.delay(1);
		ServicesPage.Step1.clickService(service);
	}
	
	@When("^user click continue to step 2$")
	public void clickContinuetostep2() {
		ServicesPage.Step1.clickContinue();
	}
}
