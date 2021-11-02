package co.uk.stepdefinitions;

import java.util.List;
import java.util.Map;

import co.uk.core.DriverHandler;
import co.uk.pageobjects.Dashboard;
import co.uk.pageobjects.StudentProjectPageProposal;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class DashboardStepDefinitions {

	@Then("^user successfully login")
	public void loginIsSucessful() {
		DriverHandler.delay(15);
		Dashboard.verifyDashBoardIsDisplayed();
	}
	
	@Then("^user is in dashboard page")
	public void verifyDashboardIsDisplayed() {
		Dashboard.verifyDashBoardIsDisplayed();
	}
	
	@Then("^overview, my project and usage tab are displayed$")
	public void verifyTabsForStudentAreDisplayed() {
		Dashboard.verifyMyProjectTabIsDisplayed();
		Dashboard.verifyOverviewTabIsDisplayed();
		Dashboard.verifyUsageTabIsDisplayed();
	}
	
	@Then("^create new project is displayed on the dashboard$")
	public void verifyCreateNewProjectIsDisplayed() {
		Dashboard.verifyCreateNewProjectIsDisplayed();
	}
	
	@Then("^user should see recent project and recent activity$")
	public void verifyRecentProjectAndActivityIsDisplayed() {
		Dashboard.verifyRecentProjectIsDisplayed();
		Dashboard.verifyRecentActivityIsDisplayed();
	}
	
	@When("^user navigate to overview tab$")
	public void navigateToOverviewTab() {
		Dashboard.clickOverviewTab();
	}
	
	@When("^user navigate to my projects tab$")
	public void navigateToMyProjectsTab() {
		Dashboard.clickMyProjectTab();
	}
	
	@When("^user navigate to usage tab$")
	public void navigateToUsageTab() {
		Dashboard.clickUsageTab();
	}
	
	@Then("^user is in usage information$")
	public void verifyUsageInformation() {
		Dashboard.Usage.verifyUsageTabIsActive();
	}
	
	@Then("^user should see actual total hours$")
	public void verifyActualTotalHours() {
		Dashboard.Usage.verifyTotalHoursIsDisplayed();
	}
	
	@Then("^user should see all total projects$")
	public void verifyTotalProject() {
		Dashboard.Usage.veriftTotalProjectIsDisplayed();
	}
	
	@Then("^user should see overview graph$")
	public void verifyOverviewGraph() {
		Dashboard.Usage.verifyChart();
	}

	@Then("^user profile widget is displayed on the dashboard$")
	public void verifyProfileWidget() {
		Dashboard.verifyProfileWidgetIsDisplayed();
	}
	
	@Then("^\"(.*)\" type is displayed$")
	public void verifyUsertype(String type) {
		Dashboard.OverviewTab.ProfileWidget.verifyBadge(type);
	}
		
	@Then("^verification widget is displayed on the dashboard$")
	public void verifyVerificationWidget() {
		Dashboard.verifyVerificationWidgetIsDisplayed();
	}
	
	@Then("^see a list of verification$")
	public void verifyListOfVerifcations() {
		Dashboard.verifyEmailIsDisplayed();
		Dashboard.verifyPhoneIsDisplayed();
	}
	
	@Then("^four key metrics is displayed on the dashboard$")
	public void verifyFourMetricsIsDisplayedOnTheDashboard() {
		Dashboard.Metric.verifyTotalHoursMetricIsDisplayed();
		Dashboard.Metric.verifyAcademicLevelMetricIsDisplayed();
		Dashboard.Metric.verifyUserTypeMetricIsDisplayed();
		Dashboard.Metric.verifyReviewsMetricIsDisplayed();
	}
	
	@When("^user navigate to profile settings using profile widget$")
	public void navigateProfileSettingsUsingWidget() {
		Dashboard.OverviewTab.ProfileWidget.clickProfilePhoto();
		DriverHandler.delay(8);
	}
	
	@Then("^user should see all projects$")
	public void verifyProjectTableIsDisplayed() {
		Dashboard.MyProject.verifyProjectTableIsDisplayed();
	}
	
	@When("^user wants to become a tutor on the dashboard page$")
	public void userWantsTobecomeATutorOnTheDashboardPage() {
		DriverHandler.delay(5);
		Dashboard.OverviewTab.ProfileWidget.clickBecomeTutor();
	}
	
	@When("^user create a new project$")
	public void clickCreateNewProject() {
		Dashboard.clickCreateNewProject();
	}
	
	@When("^user proceed to project \"(.*)\"$")
	public void proceedToProject(String projectName) {
		Dashboard.MyProject.clickProject(projectName.replace("XXX", DriverHandler.timestamp));
		DriverHandler.delay(4);
	}
	
	@Then("^the last 3 projects are shown under recent projects$")
	public void verifyTheRecentProject(DataTable userDetails) {
		 List<Map<String, String>> data = userDetails.asMaps(String.class, String.class);
	        String project1 = data.get(0).get("Project 1");
	        String project2 = data.get(0).get("Project 2");
	        String project3 = data.get(0).get("Project 3");

	        if(!project1.equals("null")) {
	        	Dashboard.OverviewTab.RecentProject.verifyProjectIsDisplayed(project1.replace("XXX", DriverHandler.timestamp));
	        }	
	        if(!project2.equals("null")) {
	        	Dashboard.OverviewTab.RecentProject.verifyProjectIsDisplayed(project2.replace("XXX", DriverHandler.timestamp));
	        }
	        if(!project3.equals("null")) {
	        	Dashboard.OverviewTab.RecentProject.verifyProjectIsDisplayed(project3.replace("XXX", DriverHandler.timestamp));
	        }
	}
	
	@Then("^project name \"(.*)\" is not displayed$")
	public void verifyProjectisNotDisplayed(String project) {
		Dashboard.MyProject.verifyProjectIsNotDisplayed(project);
	}
}
