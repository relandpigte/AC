package co.uk.stepdefinitions;

import java.util.List;
import java.util.Map;

import co.uk.core.DriverHandler;
import co.uk.core.GmailReader;
import co.uk.core.TextUtility;
import co.uk.pageobjects.student.RegisterPage;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class RegisterPageStepDefinitions {

	@When("^user enter account details$")
	public void enterAccountdetails(DataTable accountDetails) {
	        List<Map<String, String>> data = accountDetails.asMaps(String.class, String.class);
	        String firstname = data.get(0).get("Firstname");
	        String lastname = data.get(0).get("Lastname");
	        String email = data.get(0).get("Email");
	        String dateOfBirth = data.get(0).get("Date of Birth");
	        if(!firstname.equals("null")) {
	        	RegisterPage.enterFirstName(firstname);
	        }
	        if(!lastname.equals("null")) {	 
	        	RegisterPage.enterLastName(lastname);
	        }
	        if(!email.equals("null")) {	 
	        	RegisterPage.enterEmail(email.replace("XXX",DriverHandler.timestamp)+"@gilmatugas.33mail.com");
	        				        }
	        if(!dateOfBirth.equals("null")) {	 
	        	RegisterPage.enterDateOfBirth(dateOfBirth);
	        }
	        RegisterPage.checkTermAndCondition();
	        RegisterPage.clickRegister();   
	}
	
	@When("^user activate account$")
	public void activateAccount() {
		DriverHandler.delay(5);
		String value = GmailReader.getEmailContent();
		 value = TextUtility.getValueByRegex(value, "<p>https://academically(.+?)<p/>").replace("<p>", "").replace("<p/>", "");
		 DriverHandler.navigateUrl(value);
		 DriverHandler.delay(10);
	}
	
	public static void main(String[] args) {
		String value = GmailReader.getEmailContent();
	//	value = TextUtility.getValueByRegex(value, "<p>https://academically(.+?)<p/>").replace("<p>", "").replace("<p/>", "");
		System.out.println(value);
	}
	
	@Then("^sent email modal is displayed$")
	public void sentEmailIsDisplayed() {
		RegisterPage.SentEmailModal.verifySentToEmailMessageIsDisplayed();
	}
}
