package co.uk.stepdefinitions;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.json.JSONException;

import co.uk.core.DriverHandler;import co.uk.dataobjects.TestDataObjects;
import co.uk.pageobjects.AccountSettingsPageCommonObjects;
import co.uk.pageobjects.AccountSettingsPageGeneral;
import co.uk.pageobjects.AccountSettingsPageSecurity;
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
		if (!city.equals("null")) {
			AccountSettingsPageGeneral.enterCity(city);
		}
		if (!zipcode.equals("null")) {
			AccountSettingsPageGeneral.enterPostcode(zipcode);
		}
		if (!province.equals("null")) {
			AccountSettingsPageGeneral.enterState(province);
		}
	}
	
	@Then("^the all details in general information are correct$")
	public void verifyGeneralInformation(DataTable verifygeneralInformation) throws JSONException, InterruptedException, IOException {
		List<Map<String, String>> data = verifygeneralInformation.asMaps(String.class, String.class);
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
		DriverHandler.delay(4);
		
		if (!firstname.equals("null")) {
			AccountSettingsPageGeneral.verifyFirstName(firstname);
		}
		if (!lastname.equals("null")) {
			AccountSettingsPageGeneral.verifyLastName(lastname);
		}
		if (!dateOfBirth.equals("null")) {
			AccountSettingsPageGeneral.verifyDateOfBirth(dateOfBirth);
		}
		if (!dialCode.equals("null")) {
			AccountSettingsPageGeneral.verifyDialCode(TestDataObjects.getphoneNumber(dialCode));
		}
		if (!phoneNumber.equals("null")) {
			AccountSettingsPageGeneral.verifyPhoneNumber(TestDataObjects.getphoneNumber(phoneNumber));
		}
		if (!email.equals("null")) {
			AccountSettingsPageGeneral.verifyEmail(email);
		}
		if (!timezone.equals("null")) {
			AccountSettingsPageGeneral.verifyTimezone(timezone);
		}
		if (!country.equals("null")) {
			AccountSettingsPageGeneral.verifyCountry(country);
		}
		if (!address1.equals("null")) {
			AccountSettingsPageGeneral.verifyAddress1(address1);
		}
		if (!address2.equals("null")) {
			AccountSettingsPageGeneral.verifyAddress2(address2);
		}
		if (!city.equals("null")) {
			AccountSettingsPageGeneral.verifyCity(city);
		}
		if (!zipcode.equals("null")) {
			AccountSettingsPageGeneral.verifyPostCode(zipcode);
		}
		if (!province.equals("null")) {
			AccountSettingsPageGeneral.verifyState(province);
		}
	}
	
	@When("^user saving general information$")
	public void savingGeneralInformation() {
		AccountSettingsPageGeneral.clicksaveChanges();
		DriverHandler.delay(6);
	}
	
	@When("^user proceed to security tab$")
	public void proceedToSecurityTab() {
		AccountSettingsPageCommonObjects.clickSecurityTab();
	}
	
	@Then("^user is in security tab$")
	public void verifySecurityTabIsActive() {
		AccountSettingsPageSecurity.verifySecurityTabIsActive();
	}
	
	@When("^user enter invalid current password \"(.*)\"$")
	public void enterInvalidCurrentPassword(String password) {
		AccountSettingsPageSecurity.enterCurrentPassword(password);
	}
	
	@When("^user enter current password \"(.*)\"$")
	public void enterCurrentPassword(String password) {
		AccountSettingsPageSecurity.enterCurrentPassword(password);
	}
	
	@When("^user enter a new password \"(.*)\"$")
	public void enterNewPassword(String password) {
		AccountSettingsPageSecurity.enterNewPassword(password);
		AccountSettingsPageSecurity.enterConfirmPassword(password);
	}
	
	@When("^user update the password$")
	public void clickUpdatePassword() {
		AccountSettingsPageSecurity.clickUpdatePassword();
		DriverHandler.delay(4);
	}
	
	@Then("^existing password did not match the one on record message is displayed$")
	public void verifyPasswordDidnotMatchModalIsDisplayed() {
		AccountSettingsPageSecurity.verifyPasswordDidNotMatchModalIsDisplayed();
	}
	
	@When("^user wants to delete his account$")
	public void deleteAccount() {
		AccountSettingsPageSecurity.clickDeleteAccount();
	}
	
	@When("^user confirmed to delete account$")
	public void confirmedToDeleteAccount() {
		AccountSettingsPageSecurity.DeleteConfirmModal.enterConfirm("CONFIRM");
		AccountSettingsPageSecurity.DeleteConfirmModal.clickDelete();
	}
}
