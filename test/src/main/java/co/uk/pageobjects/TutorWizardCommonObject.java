package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Element;

public class TutorWizardCommonObject {

	private static Element tutorWizard = new Element("Tutor wizard",By.xpath("//app-tutor-wizard//h1[text()='Tutor Wizard']"));
	
	public static void verifyTutorWizardIsDisplayed() {
		tutorWizard.verifyDisplayed();
	}
}
