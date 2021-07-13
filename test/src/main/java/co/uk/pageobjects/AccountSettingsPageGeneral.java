package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.CheckBox;
import co.uk.webelements.Element;
import co.uk.webelements.ListBox;
import co.uk.webelements.Tab;
import co.uk.webelements.TextBox;

public class AccountSettingsPageGeneral {
	
	private static Tab generalTabIsActive = new Tab("General",By.xpath("//a[@class='nav-link active' and contains(text(),'General')]"));
	private static TextBox firstnameTextBox = new TextBox("Firstname",By.xpath("//input[@id='name']"));
	private static TextBox lastnameTextBox = new TextBox("Lastname",By.xpath("//input[@id='surname']"));
	private static TextBox dateofBirthTextBox = new TextBox("Date of Birth",By.xpath("//input[@id='dateOfBirth']"));
	private static Element phoneCountry = new Element("Dial code container",By.xpath("//div[@class='iti__flag-container']"));
	private static Element phoneNumberValue(String value) {
		return new Element("Dial code :"+value,By.xpath("//div[@class='selected-dial-code ng-star-inserted' and text()='"+value+"']"));
	}
	private static Element phoneCountryDropdown(String dialcode) {
		return new Element(dialcode,By.xpath("//span[@class='iti__dial-code' and text()='"+dialcode+"']//parent::li"));
	}
	private static TextBox phoneNumberTextBox = new TextBox("Phone Number",By.xpath("//input[@id='phone']"));
	private static TextBox emailTextBox = new TextBox("Email",By.xpath("//input[@id='emailAddress']"));
	private static TextBox address1TextBox = new TextBox("Address 1",By.xpath("//input[@id='AddressLine1']"));
	private static TextBox address2TextBox = new TextBox("Address 2",By.xpath("//input[@id='AddressLine2']"));
	private static TextBox cityTextBox = new TextBox("City",By.xpath("//input[@id='City']"));
	private static TextBox postcodeTextBox = new TextBox("Zip/Postcode",By.xpath("//input[@id='ZipOrPostCode']"));
	private static TextBox stateTextBox = new TextBox("State/Province",By.xpath("//input[@id='StateOrProvince']"));
	private static ListBox timezoneDropdown = new ListBox("Timezone",By.xpath("//select[@id='TimeZone']"));
	private static Element verifytimezone = new Element("Timezone",By.xpath("//select[@id='TimeZone']"));
	private static ListBox countryDropdown = new ListBox("Country",By.xpath("//select[@id='country']"));
	private static Element verifyCountry = new Element("Country",By.xpath("//select[@id='country']"));
	private static CheckBox studentprofile = new CheckBox("Student profile",By.xpath("//input[@id='isPublic']"));
	private static Button saveChanges = new Button("Save changes",By.xpath("//button[contains(text(),'Save Changes')]"));
	
	public static void selectDialCode(String dialCode) {
		phoneCountry.click();
		phoneCountryDropdown(dialCode).click();
	}
	public static void verifyDialCode(String dialcode) {
		phoneNumberValue(dialcode).verifyDisplayed();
	}
	
	public static void clicksaveChanges() {
		saveChanges.click();
	}
	
	public static void verifyGeneralTabIsActive() {
		generalTabIsActive.verifyDisplayed();
	}
	
	public static void enterFirstName(String fname) {
		firstnameTextBox.setText(fname);
	}
	
	public static void verifyFirstName(String fname) {
		firstnameTextBox.verifyAttributeEquals("value", fname);
	}
	
	public static void enterLastName(String lname) {
		lastnameTextBox.setText(lname);
	}
	
	public static void verifyLastName(String lname) {
		lastnameTextBox.verifyAttributeContains("value", lname);
	}
	
	public static void enterDateOfBirth(String date) {
		dateofBirthTextBox.setValueWithJavascript(date);
	}
	
	public static void verifyDateOfBirth(String date) {
		dateofBirthTextBox.verifyAttributeEquals("value", date);
	}
	
	public static void enterPhoneNumber(String number) {
		phoneNumberTextBox.setText(number);
	}
	
	public static void verifyPhoneNumber(String number) {
		phoneNumberTextBox.verifyAttributeEquals("value", number);
	}
	
	public static void enterEmail(String email) {
		emailTextBox.setText(email);
	}
	
	public static void verifyEmail(String email) {
		emailTextBox.verifyAttributeEquals("value", email);
	}
	
	public static void enterAddress1(String address1) {
		address1TextBox.setText(address1);
	}
	
	public static void verifyAddress1(String address1) {
		address1TextBox.verifyAttributeEquals("value", address1);
	}
	
	public static void enterAddress2(String address2) {
		address2TextBox.setText(address2);
	}
	
	public static void verifyAddress2(String address2) {
		address2TextBox.verifyAttributeEquals("value", address2);
	}
	
	public static void enterCity(String city) {
		cityTextBox.setText(city);
	}
	
	public static void verifyCity(String city) {
		cityTextBox.verifyAttributeEquals("value", city);
	}
	
	public static void enterPostcode(String postcode) {
		postcodeTextBox.setText(postcode);
	}
	
	public static void verifyPostCode(String postcode) {
		postcodeTextBox.verifyAttributeEquals("value", postcode);
	}
	
	public static void enterState(String state) {
		stateTextBox.setText(state);
	}
	
	public static void verifyState(String state) {
		stateTextBox.verifyAttributeEquals("value", state);
	}
	
	public static void selectTimezone(String timezone) {
		timezoneDropdown.selectByVisibleText(timezone);
	}
	
	public static void verifyTimezone(String timezone) {
		verifytimezone.verifyAttributeEquals("value", timezone);
	}
	
	public static void selectCountry(String country) {
		countryDropdown.selectByVisibleText(country);
	}
	
	public static void verifyCountry(String country) {
		verifyCountry.verifyAttributeEquals("value", country);
	}
	
	public static void enableStudentProfile() {
		if(!studentprofile.isSelected()) {
			studentprofile.click();
		}
	}
	
	public static void disableStudentProfile() {
		if(studentprofile.isSelected()) {
			studentprofile.click();
		}
	}
	
}
