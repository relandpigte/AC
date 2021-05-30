package co.uk.stepdefinitions;

import co.uk.core.DriverHandler;
import co.uk.pageobjects.student.UserProfilePageIntroduction;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class UserProfilePageStepDefinistions {

	@When("^user add about information$")
	public void enterAboutInformation() {
		UserProfilePageIntroduction.About.clickEdit();
		UserProfilePageIntroduction.About.enterMessage(
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
		UserProfilePageIntroduction.About.clickSave();
		DriverHandler.delay(5);
	}
	
	@Then("^adding about user information is successful$")
	public void verifyAboutinformationIsDisplayed() {
		UserProfilePageIntroduction.About.verifyAboutMessageIsEqual(
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
	}
}

