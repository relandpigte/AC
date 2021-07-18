package co.uk.stepdefinitions;

import co.uk.core.DriverHandler;
import co.uk.pageobjects.Homepage;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class HomePageStepDefinitions {

	@Then("^user successfully login")
	public void loginIsSucessful() {
		DriverHandler.delay(17);
		Homepage.verifyDashBoardIsDisplayed();
	}
	
	@Then("^user is in dashboard page")
	public void verifyDashboardIsDisplayed() {
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
	
	@Then("^user is in usage information$")
	public void verifyUsageInformation() {
		Homepage.Usage.verifyUsageTabIsActive();
	}
	
	@Then("^user should see actual total hours$")
	public void verifyActualTotalHours() {
		Homepage.Usage.verifyTotalHoursIsDisplayed();
	}
	
	@Then("^user should see all total projects$")
	public void verifyTotalProject() {
		Homepage.Usage.veriftTotalProjectIsDisplayed();
	}
	
	@Then("^user should see overview graph$")
	public void verifyOverviewGraph() {
		Homepage.Usage.verifyChart();
	}

	@Then("^user profile widget is displayed on the dashboard$")
	public void verifyProfileWidget() {
		Homepage.verifyProfileWidgetIsDisplayed();
	}
	
	@Then("^verification widget is displayed on the dashboard$")
	public void verifyVerificationWidget() {
		Homepage.verifyVerificationWidgetIsDisplayed();
	}
	
	@Then("^see a list of verification$")
	public void verifyListOfVerifcations() {
		Homepage.verifyEmailIsDisplayed();
		Homepage.verifyPhoneIsDisplayed();
	}
	
	@Then("^four key metrics is displayed on the dashboard$")
	public void verifyFourMetricsIsDisplayedOnTheDashboard() {
		Homepage.Metric.verifyTotalHoursMetricIsDisplayed();
		Homepage.Metric.verifyAcademicLevelMetricIsDisplayed();
		Homepage.Metric.verifyUserTypeMetricIsDisplayed();
		Homepage.Metric.verifyReviewsMetricIsDisplayed();
	}
	
	@When("^user navigate to profile settings using profile widget$")
	public void navigateProfileSettingsUsingWidget() {
		Homepage.ProfileWidget.clickProfilePhoto();
		DriverHandler.delay(8);
	}
	
	@Then("^user should see all projects$")
	public void verifyProjectTableIsDisplayed() {
		Homepage.MyProject.verifyProjectTableIsDisplayed();
	}
	
	@When("^user wants to become a tutor on the dashboard page$")
	public void userWantsTobecomeATutorOnTheDashboardPage() {
		DriverHandler.delay(5);
		Homepage.ProfileWidget.clickBecomeTutor();
	}
	
	@When("^user create a new project$")
	public void clickCreateNewProject() {
		Homepage.clickCreateNewProject();
	}
	
	@When("^user proceed to project \"(.*)\"$")
	public void proceedToProject(String projectName) {
		Homepage.MyProject.clickProject(projectName.replace("XXX", DriverHandler.timestamp));
		DriverHandler.delay(4);
	}
}
