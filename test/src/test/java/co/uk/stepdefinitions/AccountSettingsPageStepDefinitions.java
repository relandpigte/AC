package co.uk.stepdefinitions;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.json.JSONException;

import co.uk.core.DriverHandler;import co.uk.dataobjects.TestDataObjects;
import co.uk.pageobjects.AccountSettingsPageGeneral;
import co.uk.pageobjects.TutorWizardPageAddress;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class AccountSettingsPageStepDefinitions {

	@Then("^the user is in the account settings general tab$")
	public void verifyAccountSettingsPageIsDisplayed() {
		AccountSettingsPageGeneral.verifyGeneralTabIsActive();
	}
	
	@When("^user enter general information$")
	public void enterGeneralInformation(DataTable generalInformation) throws JSONException, InterruptedException, IOException {
		List<Map<String, String>> data = generalInformation.asMaps(String.class, String.class);
		String firstname = data.get(0).get("First name");
		String lastname = data.get(0).get("Last name");
		String dateOfBirth = data.get(0).get("Date of birth");
		String dialCode = data.get(0).get("Dial code");
		String phoneNumber = data.get(0).get("Phone number");		
		String email = data.get(0).get("Email");
		String timezone = data.get(0).get("Timezone");
		String country = data.get(0).get("Country");		
		String address1 = data.get(0).get("Address 1");
		String address2 = data.get(0).get("Address 2");
		String city = data.get(0).get("City");
		String zipcode = data.get(0).get("Zip code");
		String province = data.get(0).get("Province");
		DriverHandler.delay(2);
		
		if (!firstname.equals("null")) {
			AccountSettingsPageGeneral.enterFirstName(firstname);
		}
		if (!lastname.equals("null")) {
			AccountSettingsPageGeneral.enterLastName(lastname);
		}
		if (!dateOfBirth.equals("null")) {
			AccountSettingsPageGeneral.enterDateOfBirth(dateOfBirth);
		}
		if (!dialCode.equals("null")) {
			AccountSettingsPageGeneral.selectDialCode(TestDataObjects.getphoneNumber(dialCode));
		}
		if (!phoneNumber.equals("null")) {
			AccountSettingsPageGeneral.enterPhoneNumber(TestDataObjects.getphoneNumber(phoneNumber));
		}
		if (!email.equals("null")) {
			AccountSettingsPageGeneral.enterEmail(email);
		}
		if (!timezone.equals("null")) {
			AccountSettingsPageGeneral.selectTimezone(timezone);
		}
		if (!country.equals("null")) {
			AccountSettingsPageGeneral.selectCountry(country);
		}
		if (!address1.equals("null")) {
			AccountSettingsPageGeneral.enterAddress1(address1);
		}
		if (!address2.equals("null")) {
			AccountSettingsPageGeneral.enterAddress2(address2);
		}
		if (!zipcode.equals("null")) {
			AccountSettingsPageGeneral.enterPostcode(zipcode);
		}
		if (!province.equals("null")) {
			AccountSettingsPageGeneral.enterState(province);
		}
	}
	
	@When("^user saving general information$")
	public void savingGeneralInformation() {
		AccountSettingsPageGeneral.clicksaveChanges();
		DriverHandler.delay(6);
	}
}
