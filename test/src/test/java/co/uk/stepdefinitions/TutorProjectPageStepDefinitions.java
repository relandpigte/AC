package co.uk.stepdefinitions;

import co.uk.core.DriverHandler;
import co.uk.pageobjects.TutorProjectsPageFindWork;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class TutorProjectPageStepDefinitions {

	@Then("^user in in find work screen$")
	public void verifyFindWorkTabIsActive() {
		TutorProjectsPageFindWork.verifyFindWorkTabIsActive();
	}
	
	@Then("^project name \"(.*)\" is displayed$")
	public void verifyProjectNameIsDisplayed(String projectName) {
		TutorProjectsPageFindWork.verifyProjectNameIsDisplayed(projectName.replace("XXX", DriverHandler.timestamp));
	}
	
	@When("^user view a full details of the project \"(.*)\"$")
	public void clickFullDetails(String projectName) {
		TutorProjectsPageFindWork.clickFullViewDetails(projectName.replace("XXX",DriverHandler.timestamp));
		DriverHandler.delay(4);
	}
	
	@Then("^project details modal is displayed$")
	public void verifyProjectDetailsModalIsDisplayed() {
		TutorProjectsPageFindWork.ProjectDetails.verifyProjectDetailsModalIsDisplayed();
	}
}
