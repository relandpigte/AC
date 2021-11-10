package co.uk.stepdefinitions;

import co.uk.pageobjects.StudentProjectPageBrowseTutor;
import io.cucumber.java.en.Then;

public class StudentProjectPageBrowseTutorStepDefinitions {

	@Then("^user is in browse tutor tab")
	public void verifyBrowseTutorTabIsActive() {
		StudentProjectPageBrowseTutor.verifyBrowseTutorTabIsActive();
	}
}
