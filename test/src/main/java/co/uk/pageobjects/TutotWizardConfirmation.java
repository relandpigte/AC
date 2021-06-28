package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.Element;

public class TutotWizardConfirmation {

	private static Element modalMessage = new Element("Confirmation to apply a tutor",
			By.xpath("//div[contains(text(),'You are applying to become a tutor')]"));
	private static Button yes = new Button("Yes",
			By.xpath("//div[contains(text(),'You are applying to become a tutor')]"));

	public static void modalMessageIsDisplayed() {
		modalMessage.verifyDisplayed();
	}

	public static void clickYes() {
		yes.click();
	}
}
