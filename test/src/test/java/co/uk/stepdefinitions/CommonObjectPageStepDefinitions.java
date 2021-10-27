package co.uk.stepdefinitions;

import co.uk.core.DriverHandler;
import co.uk.pageobjects.CommonObjects;
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
		DriverHandler.delay(2);
		CommonObjects.successfulMessageAtTheRightCornerIsDisplayed();
	}
	
	@When("^user proceed to manage user$")
	public void proceedToManageUserPage() {
		CommonObjects.clicknavSettings();
		CommonObjects.clicknavUsers();
	}
	
	@When("^user logout in academically$")
	public void logout() {
		CommonObjects.clickProfileDropUp();
		CommonObjects.clickLogout();
		DriverHandler.delay(4);
	}
	
	@When("^user proceed to account settings$")
	public void proceedToAccountSettings() {
		CommonObjects.clickProfileDropUp();
		CommonObjects.clickAccountSettings();
	}
	
	@Then("^confirmation of  become a tutor modal is displayed")
	public void verifyConfirmatioinToBecomeATutorIsDisplayed() {
		CommonObjects.TutorWizardConfirmation.modalMessageIsDisplayed();
	}
	
	@When("^user confirms to become a tutor$")
	public void userConfirmToBecomeAtutor() {
		CommonObjects.TutorWizardConfirmation.clickYes();
	}
	
	@When("^user proceed to the dashboard page$")
	public void proceedToTheDashboard() {
		CommonObjects.clicknavDashboard();
	}
	
	@When("^user proceed to the calendar$")
	public void proceedToTheCalendar() {
		CommonObjects.clicknavSchedule();
		DriverHandler.delay(2);
	}
	
	@Then("^sucessfuly deleted is displayed$")
	public void verifySuccesfulyDeletedIsDisplayed() {
		CommonObjects.verifySuccessfulDeleteMessageIsDisplayed();
	}
	
	@When("^user see all projects$")
	public void proceedToAllProjects() {
		CommonObjects.clicknavSeeAllProject();
		DriverHandler.delay(4);
	}
	
}
