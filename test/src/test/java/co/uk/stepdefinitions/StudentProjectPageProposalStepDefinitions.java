package co.uk.stepdefinitions;

import co.uk.pageobjects.StudentProjectPageProposal;
import io.cucumber.java.en.Then;

public class StudentProjectPageProposalStepDefinitions {

	@Then("^user is in proposal screen$")
	public void verifyProposalTabIsActive() {
		StudentProjectPageProposal.verifyProposalTabIsActive();
	}
	
	@Then("^\"(.*)\" offer is displayed$")
	public void verifyTutorNameIsDisplayed(String name) {
		StudentProjectPageProposal.verifyTutorNameIsDisplayed(name);
	}
}
