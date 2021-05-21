package co.uk.stepdefinitions;

import co.uk.pageobjects.student.CommonObjects;
import cucumber.api.java.en.And;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;

public class CommonObjectPageStepDefinitions {
	
	@When("^user navigate to profile menu$")
	public void navigateToProfileMenu() {
		CommonObjects.clickProfileDropUp();
	}
	
	@Then("^account settings is displayed$")
	public void verifyAccountSettingsIsDisplayed() {
		CommonObjects.verifyAccountSettingsIsDisplayed();
	}
}
