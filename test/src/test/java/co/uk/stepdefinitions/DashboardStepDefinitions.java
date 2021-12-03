package co.uk.stepdefinitions;

import java.util.List;
import java.util.Map;

import co.uk.core.DriverHandler;
import co.uk.pageobjects.DashboardStudentAndTutor;
import co.uk.pageobjects.StudentProjectPageProposal;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class DashboardStepDefinitions {

	@Then("^user successfully login")
	public void loginIsSucessful() {
		DriverHandler.delay(15);
		DashboardStudentAndTutor.verifyDashBoardIsDisplayed();
	}
	
	@Then("^user is in dashboard page")
	public void verifyDashboardIsDisplayed() {
		DashboardStudentAndTutor.verifyDashBoardIsDisplayed();
	}
	
	@Then("^overview, coaching and usage tab are displayed$")
	public void verifyTabsForStudentAreDisplayed() {
		DashboardStudentAndTutor.verifyMyProjectTabIsDisplayed();
		DashboardStudentAndTutor.verifyOverviewTabIsDisplayed();
		DashboardStudentAndTutor.verifyUsageTabIsDisplayed();
	}
	
	@Then("^create new project is displayed on the dashboard$")
	public void verifyCreateNewProjectIsDisplayed() {
		DashboardStudentAndTutor.verifyCreateNewProjectIsDisplayed();
	}
	
	@Then("^user should see recent project and recent activity$")
	public void verifyRecentProjectAndActivityIsDisplayed() {
		DashboardStudentAndTutor.verifyRecentProjectIsDisplayed();
		DashboardStudentAndTutor.verifyRecentActivityIsDisplayed();
	}
	
	@When("^user navigate to overview tab$")
	public void navigateToOverviewTab() {
		DashboardStudentAndTutor.clickOverviewTab();
	}
	
	@When("^user navigate to my projects tab$")
	public void navigateToMyProjectsTab() {
		DashboardStudentAndTutor.clickMyProjectTab();
	}
	
	@When("^user navigate to usage tab$")
	public void navigateToUsageTab() {
		DashboardStudentAndTutor.clickUsageTab();
	}
	
	@Then("^user is in usage information$")
	public void verifyUsageInformation() {
		DashboardStudentAndTutor.UsageTab.verifyUsageTabIsActive();
	}
	
	@Then("^user should see actual total hours$")
	public void verifyActualTotalHours() {
		DashboardStudentAndTutor.UsageTab.verifyTotalHoursIsDisplayed();
	}
	
	@Then("^user should see all total projects$")
	public void verifyTotalProject() {
		DashboardStudentAndTutor.UsageTab.veriftTotalProjectIsDisplayed();
	}
	
	@Then("^user should see overview graph$")
	public void verifyOverviewGraph() {
		DashboardStudentAndTutor.UsageTab.verifyChart();
	}

	@Then("^user profile widget is displayed on the dashboard$")
	public void verifyProfileWidget() {
		DashboardStudentAndTutor.verifyProfileWidgetIsDisplayed();
	}
	
	@Then("^\"(.*)\" type is displayed$")
	public void verifyUsertype(String type) {
		DashboardStudentAndTutor.OverviewTab.ProfileWidget.verifyBadge(type);
	}
		
	@Then("^verification widget is displayed on the dashboard$")
	public void verifyVerificationWidget() {
		DashboardStudentAndTutor.verifyVerificationWidgetIsDisplayed();
	}
	
	@Then("^see a list of verification$")
	public void verifyListOfVerifcations() {
		DashboardStudentAndTutor.verifyEmailIsDisplayed();
		DashboardStudentAndTutor.verifyPhoneIsDisplayed();
	}
	
	@Then("^four key metrics is displayed on the dashboard$")
	public void verifyFourMetricsIsDisplayedOnTheDashboard() {
		DashboardStudentAndTutor.Metric.verifyTotalHoursMetricIsDisplayed();
		DashboardStudentAndTutor.Metric.verifyAcademicLevelMetricIsDisplayed();
		DashboardStudentAndTutor.Metric.verifyUserTypeMetricIsDisplayed();
		DashboardStudentAndTutor.Metric.verifyReviewsMetricIsDisplayed();
	}
	
	@When("^user navigate to profile settings using profile widget$")
	public void navigateProfileSettingsUsingWidget() {
		DashboardStudentAndTutor.OverviewTab.ProfileWidget.clickProfilePhoto();
		DriverHandler.delay(9);
	}
	
	@Then("^user should see all projects$")
	public void verifyProjectTableIsDisplayed() {
		DashboardStudentAndTutor.MyProjectTab.verifyProjectTableIsDisplayed();
	}
	
	@When("^user wants to become a tutor on the dashboard page$")
	public void userWantsTobecomeATutorOnTheDashboardPage() {
		DriverHandler.delay(5);
		DashboardStudentAndTutor.OverviewTab.ProfileWidget.clickBecomeTutor();
	}
	
	@When("^user create a new project$")
	public void clickCreateNewProject() {
		DashboardStudentAndTutor.clickCreateNewProject();
	}
	
	@When("^user proceed to project \"(.*)\"$")
	public void proceedToProject(String projectName) {
		DashboardStudentAndTutor.MyProjectTab.clickProject(projectName.replace("XXX", DriverHandler.timestamp));
		DriverHandler.delay(4);
	}
	
	@Then("^the last 3 projects are shown under recent projects$")
	public void verifyTheRecentProject(DataTable userDetails) {
		 List<Map<String, String>> data = userDetails.asMaps(String.class, String.class);
	     String project1 = data.get(0).get("Project 1");
	     String project2 = data.get(0).get("Project 2");
	     String project3 = data.get(0).get("Project 3");

	        if(!project1.equals("null")) {
	        	DashboardStudentAndTutor.OverviewTab.RecentProject.verifyProjectIsDisplayed(project1.replace("XXX", DriverHandler.timestamp));
	        }	
	        if(!project2.equals("null")) {
	        	DashboardStudentAndTutor.OverviewTab.RecentProject.verifyProjectIsDisplayed(project2.replace("XXX", DriverHandler.timestamp));
	        }
	        if(!project3.equals("null")) {
	        	DashboardStudentAndTutor.OverviewTab.RecentProject.verifyProjectIsDisplayed(project3.replace("XXX", DriverHandler.timestamp));
	        }
	}
	
	@Then("^project name \"(.*)\" is not displayed$")
	public void verifyProjectisNotDisplayed(String project) {
		DashboardStudentAndTutor.MyProjectTab.verifyProjectIsNotDisplayed(project);
	}
	
	@When("^user proceed to the course tab$")
	public void proceedToCourseTab() {
		DashboardStudentAndTutor.clickCourseTab();
	}
	
	@When("^user procced to the \"(.*)\" course$")
	public void proceedToCourse(String courseName) {
		DashboardStudentAndTutor.CourseTab.clickCourseDetails(courseName.replace("XXX", DriverHandler.timestamp));
	}
	
	@When("^user create a new course$")
	public void createNewCourse(DataTable userDetails) {
		List<Map<String, String>> data = userDetails.asMaps(String.class, String.class);
		String template = data.get(0).get("Template");
		String courseName = data.get(0).get("Course name");
		DashboardStudentAndTutor.CourseTab.clickCreateCourse();
		
		if(!template.equals("null")) {
	        DashboardStudentAndTutor.CourseTab.CreateCourseModal.selectCourseTemplate(template);
	        DashboardStudentAndTutor.CourseTab.CreateCourseModal.clickNext();
	       }
		if(!courseName.equals("null")) {
			DashboardStudentAndTutor.CourseTab.CreateCourseModal.enterCourseNameTxtBox(courseName.replace("XXX", DriverHandler.timestamp));
			DashboardStudentAndTutor.CourseTab.CreateCourseModal.clickSave();
       }
	}
	
	@When("^user proceed to the course name \"(.*)\"$")
	public void clickCoureName(String name) {
		DashboardStudentAndTutor.CourseTab.clickCourseDetails(name.replace("XXX", DriverHandler.timestamp));
	}
	
	@Then("^user should see \"(.*)\" course$")
	public void verifyCourseIsDisplayed(String name) {
		DashboardStudentAndTutor.CourseTab.verifyCourseIsDisplayed(name.replace("XXX", DriverHandler.timestamp));
	}
	
	@Then("^image uploaded in the course \"(.*)\" will then be displayed as a thumbnail$")
	public void verifyDefaultThumbnailIsNotDisplayed(String courseName) {
		DriverHandler.delay(3);
		DashboardStudentAndTutor.CourseTab.verifyCourseDefaultThumbnailisDisplayed(courseName.replace("XXX", DriverHandler.timestamp));
	}
}
