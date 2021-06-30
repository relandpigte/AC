package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.ListBox;
import co.uk.webelements.TextBox;

public class TutorWizardPageAddress {

	private static ListBox countryDropdown = new ListBox("Country",By.xpath("//select[@id='country']"));
	private static TextBox address1TextBox = new TextBox("Address 1",By.xpath("//input[@id='AddressLine1']"));
	private static TextBox address2TextBox = new TextBox("Address 2",By.xpath("//input[@id='AddressLine2']"));
	private static TextBox cityTextBox = new TextBox("City",By.xpath("//input[@id='City']"));
	private static TextBox postcodeTextBox = new TextBox("Zip/Postcode",By.xpath("//input[@id='ZipOrPostCode']"));
	private static TextBox stateTextBox = new TextBox("State/Province",By.xpath("//input[@id='StateOrProvince']"));
	private static Button next = new Button("Next",By.xpath("//button[contains(text(),'Next')]"));
	  
	public static void clickNext() {
		next.click();
	}
	
	public static void enterAddress1(String address1) {
		address1TextBox.setText(address1);
	}
	
	public static void enterAddress2(String address2) {
		address2TextBox.setText(address2);
	}
	
	public static void enterCity(String city) {
		cityTextBox.setText(city);
	}
	
	public static void enterPostcode(String postcode) {
		postcodeTextBox.setText(postcode);
	}
	
	public static void enterState(String state) {
		stateTextBox.setText(state);
	}
	
	public static void selectCountry(String country) {
		countryDropdown.selectByVisibleText(country);
	}
}
