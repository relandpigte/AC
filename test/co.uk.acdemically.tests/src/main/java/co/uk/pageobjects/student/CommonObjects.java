package co.uk.pageobjects.student;

import org.openqa.selenium.By;

import co.uk.core.DriverHandler;
import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.TextBox;

public class CommonObjects {
	
	private static Element profileDropdown = new Element("Profile dropup",By.xpath("//div[@class='dropup']/a[@data-toggle='dropdown']"));
	private static Element accountSettings = new Element("Account settings",By.xpath("//div[@class='dropup show' ]//a[text()='Account Settings']"));

	public static void verifyAccountSettingsIsDisplayed() {
		accountSettings.verifyDisplayed();
	}
	
	public static void clickAccountSettings() {
		accountSettings.click();
	}
	public static void clickProfileDropUp() {
		profileDropdown.click();
	}
}

