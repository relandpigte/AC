package co.uk.stepdefinitions;

import co.uk.pageobjects.student.CommonObjects;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class CommonObjectPageStepDefinitions {
	
	@When("^user navigate to profile menu$")
	public void navigateToProfileMenu() {
		CommonObjects.clickProfileDropUp();
	}
	
	@Then("^account settings is displayed$")
	public void verifyAccountSettingsIsDisplayed() {
		CommonObjects.verifyAccountSettingsIsDisplayed();
	}
	
	@Then("sucessful message is displayed$")
	public void verifySuccessfulMessageIsDisplayed() {
		CommonObjects.successfulMessageAtTheRightCornerIsDisplayed();
	}
}
