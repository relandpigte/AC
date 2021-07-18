package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Element;

public class AdminManageRolesPage {
	
	private static Element titleHeader = new Element("Roles page",By.xpath("//h1[text()='Roles']"));
	
	public static void verifyRolePageIsDisplayed() {
		titleHeader.verifyDisplayed();
	}
	
}
