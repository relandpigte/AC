package co.uk.stepdefinitions;

import co.uk.core.DriverHandler;
import co.uk.pageobjects.student.Homepage;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;

public class HomePageStepDefinitions {

	@Then("^user successfully login")
	public void loginIsSucessful() {
		DriverHandler.delay(10);
		Homepage.verifyDashBoardIsDisplayed();
	}
	
	@Then("^overview, my project and usage tab are displayed$")
	public void verifyTabsForStudentAreDisplayed() {
		Homepage.verifyMyProjectTabIsDisplayed();
		Homepage.verifyOverviewTabIsDisplayed();
		Homepage.verifyUsageTabIsDisplayed();
	}
	
	@Then("^create new project is displayed on the dashboard$")
	public void verifyCreateNewProjectIsDisplayed() {
		Homepage.verifyCreateNewProjectIsDisplayed();
	}
	
	@Then("^user should see recent project and recent activity$")
	public void verifyRecentProjectAndActivityIsDisplayed() {
		Homepage.verifyRecentProjectIsDisplayed();
		Homepage.verifyRecentActivityIsDisplayed();
	}
	
	@When("^user navigate to overview tab$")
	public void navigateToOverviewTab() {
		Homepage.clickOverviewTab();
	}
	
	@When("^user navigate to my projects tab$")
	public void navigateToMyProjectsTab() {
		Homepage.clickMyProjectTab();
	}
	
	@When("^user navigate to usage tab$")
	public void navigateToUsageTab() {
		Homepage.clickUsageTab();
	}
	
	
}
