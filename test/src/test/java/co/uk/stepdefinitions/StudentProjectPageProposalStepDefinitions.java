package co.uk.stepdefinitions;

import co.uk.pageobjects.StudentProjectPageProposal;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class StudentProjectPageProposalStepDefinitions {

	@Then("^user is in proposal screen$")
	public void verifyProposalTabIsActive() {
		StudentProjectPageProposal.verifyProposalTabIsActive();
	}
	
	@Then("^\"(.*)\" offer is displayed$")
	public void verifyTutorNameIsDisplayed(String name) {
		StudentProjectPageProposal.verifyTutorNameIsDisplayed(name);
	}
	
	@When("^the user views the full details of \"(.*)\" offer$")
	public void viewFullDetailsOfTutorOffer(String tutorName) {
		StudentProjectPageProposal.clickFullDetails(tutorName);
	}
	
	@Then("^the user has successfully viewed the tutor offer$")
	public void verifyTutorOfferModalIsDisplayed() {
		StudentProjectPageProposal.FullDetailsModal.verifyFullDetailModalIsDisplayed();
	}
	
	@When("^user proceed to book session tab$")
	public void proceedToBookSeassionTab() {
		StudentProjectPageProposal.FullDetailsModal.clickBookSessionTab();
	}
	
	@When("^user add book session on payment page$")
	public void addBookSession() {
		StudentProjectPageProposal.FullDetailsModal.clickAddSession();
	}
	
	@Then("^Add booking modal is displayed$")
	public void addBookingModalIsDiplsyed() {
		StudentProjectPageProposal.FullDetailsModal.BookingModal.verifyBookingModalIsDisplayed();
	}
}
