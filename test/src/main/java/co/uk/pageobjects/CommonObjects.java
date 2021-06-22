package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.core.DriverHandler;
import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.TextBox;

public class CommonObjects {
	
	private static Element profileDropdown = new Element("Profile dropup",By.xpath("//div[@class='dropup']/a[@data-toggle='dropdown']"));
	private static Element accountSettings = new Element("Account settings",By.xpath("//div[@class='dropup show' ]//a[text()='Account Settings']"));
	private static Element logout = new Element("Logout",By.xpath("//div[@class='dropup show' ]//a[text()='Logout']"));
	private static Element successfullMesssage = new Element("Successful message",By.xpath("//span[text()='Saved successfully']"));
	private static Element navSettings = new Element("Navigation settings",By.xpath("//nav//a[contains(text(),'Settings')]"));
	private static Element navUsers = new Element("Navigation users",By.xpath("//nav//a[contains(text(),'Users')]"));
	private static Element navRoles = new Element("Navigation roles",By.xpath("//nav//a[contains(text(),'Roles')]"));
	private static Element navSchedule = new Element("Navigation schedule",By.xpath("//nav//a[contains(text(),'Schedule')]"));
	private static Element navSuggestion = new Element("Navigation suggestion",By.xpath("//nav//a[contains(text(),'Suggestions')]"));
	private static Element navServiceSubject = new Element("Navigation service subject",By.xpath("//nav//a[contains(text(),'Service Subjects')]"));
	
	public static void clicknavSettings() {
		navSettings.click();
	}
	
	public static void clicknavUsers() {
		navUsers.click();
	}
	
	public static void clicknavRoles() {
		navRoles.click();
	}
	
	public static void clicknavSchedule() {
		navSchedule.click();
	}
	
	public static void clicknavSuggestion() {
		navSuggestion.click();
	}
	
	public static void clicknavServiceSubject() {
		navServiceSubject.click();
	}
	
	public static void clickLogout() {
		logout.click();
	}
	
	public static void successfulMessageAtTheRightCornerIsDisplayed() {
		successfullMesssage.verifyDisplayed();
	}
	
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

