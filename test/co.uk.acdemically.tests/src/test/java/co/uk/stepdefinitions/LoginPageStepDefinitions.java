package co.uk.stepdefinitions;

import java.io.IOException;

import org.json.JSONException;

import co.uk.core.DateUtilities;
import co.uk.core.DriverHandler;
import co.uk.dataobjects.TestDataObjects;
import co.uk.pageobjects.student.CommonObjects;
import co.uk.pageobjects.student.LoginPage;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;

public class LoginPageStepDefinitions {

	@When("^user login as \"(.*)\"$")
	public void loginToAcademically(String user) throws JSONException, InterruptedException, IOException {
		LoginPage.enterUsername(TestDataObjects.getUsername(user));
		LoginPage.enterPassword(TestDataObjects.getPassword(user));
		LoginPage.clickLogin();
	}
	
	@When("^user login with valid credentials$")
	public void loginValidCredential() throws JSONException, InterruptedException, IOException {
		LoginPage.enterUsername(TestDataObjects.getUsername("student"));
		LoginPage.enterPassword(TestDataObjects.getPassword("student"));
		LoginPage.clickLogin();
	}
	
	@When("^user enter username \"(.*)\" and password \"(.*)\"$")
	public void loginInvalidCredential(String username, String password) {
		LoginPage.enterUsername(username.replace("XXX", DriverHandler.timestamp)+"@gilmatugas.33mail.com");
		LoginPage.enterPassword(password);
		LoginPage.clickLogin();
	}
	
	@Then("^user is not successfully login$")
	public void loginNotSuccessful() {
		LoginPage.LoginFailedModal.verifyLoginFailedModalIsDisplayed();
	}
	
	@When("^user register a student$")
	public void register() {
		LoginPage.clickRegister();
	}
}
