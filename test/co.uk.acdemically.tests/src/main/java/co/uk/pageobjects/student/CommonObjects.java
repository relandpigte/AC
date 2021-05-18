package co.uk.pageobjects.student;

import org.openqa.selenium.By;

import co.uk.core.DriverHandler;
import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.TextBox;

public class CommonObjects {
	
	private static Element cyclopsLogo = new Element("Cyclops",By.xpath("//img[@alt='Cyclops Logo']/parent::a"));
	private static Button newCameraBtn = new Button("New camera",By.xpath("//input[@id='newCameraBtn']"));
	private static Button verifyCameraBtn = new Button("Verify camera",By.xpath("//input[@id='verifyCamera']"));
	private static TextBox addressSearch = new TextBox("Address search",By.xpath("//input[@id='address']"));
	private static Element countryDrpdown = new Element("Conutry dropdown",By.xpath("//select[@id='zones']"));
	private static Element selectCountryDrpDown(String country) {
		return new Element("Select country: "+country,By.xpath("//select[@id='zones']/option[text()='"+country+"']"));
	}
	private static Button searchCameraBtn = new Button("Search camera",By.xpath("//input[@id='searchCamera']"));
	public static void clickCyclopsLogo() {
		cyclopsLogo.click();
	}
	
	public static void verifyCyclopsLogoIsNotDisplayed() {
		cyclopsLogo.verifyNotDisplayed();
	}
	
	public static void verifyCyclopsLogoIsDisplayed() {
		cyclopsLogo.verifyDisplayed();
	}
	
	public static void clickNewCamera() {
		newCameraBtn.click();
	}
	
	public static void clickVerifyCamera() {
		verifyCameraBtn.click();
	}
	
	public static void enterAddress(String address) {
		addressSearch.setText(address);
	}
	
	public static void selectCountry(String country) {
		countryDrpdown.click();
		DriverHandler.delay(1);
		selectCountryDrpDown(country).click();
	}
	
	public static void clickSearchCamera() {
		searchCameraBtn.click();
	}
}

