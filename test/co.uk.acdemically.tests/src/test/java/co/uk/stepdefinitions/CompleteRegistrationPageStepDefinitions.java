package co.uk.stepdefinitions;

import java.util.List;
import java.util.Map;

import co.uk.core.DriverHandler;
import co.uk.pageobjects.student.CompleteRegistrationPage;
import co.uk.pageobjects.student.RegisterPage;
import cucumber.api.DataTable;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;

public class CompleteRegistrationPageStepDefinitions {

	@Then("^user is in complete registration form$")
	public void verifyCompleteRegisrationPageIsDisplayed() {
		CompleteRegistrationPage.verifyCompleteRegistrationPageIsDisplayed();
	}
	
	@When("^user enter password \"(.*)\" and confirm passoword \"(.*)\"$")
	public void enterEnterUserPassword(String password, String confirmPassword) {
		CompleteRegistrationPage.enterPassword(password);
		CompleteRegistrationPage.enterConfirmPassword(confirmPassword);
	}
	
	@When("^user register an account$")
	public void registerAnAccount() {
		CompleteRegistrationPage.clickRegister();
		DriverHandler.delay(2);
	}
	
	@Then("^registered the account successfully$")
	public void registerdAccountIsSuccessful() {
		CompleteRegistrationPage.verifySuccesfullyRegisteredMessageIsDisplayed();
	}
	
	@Then("^email address \"(.*)\" matched$")
	public void verifyEmailIsMatched(String email) {
		CompleteRegistrationPage.verifyEmailisMatched(email.replace("XXX", DriverHandler.timestamp)+"@gilmatugas.33mail.com");
	}
}
