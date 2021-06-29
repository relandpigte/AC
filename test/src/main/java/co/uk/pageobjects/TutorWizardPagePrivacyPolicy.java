package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.CheckBox;

public class TutorWizardPagePrivacyPolicy {
	
	private static Button print = new Button("Print",By.xpath("//app-privacy-policy//button[contains(text(),'Print')]"));
	private static CheckBox privacyPolicyAgrement = new CheckBox("Agrement privacy policy",By.xpath("//app-privacy-policy//input[@id='aceptPrivacyPolicy']"));
	private static Button next = new Button("Next",By.xpath("//button[contains(text(),'Next')]"));
	
	public static void clickprint() {
		print.click();
	}
	
	public static void enablePrivacyPolicy() {
		if(!privacyPolicyAgrement.isSelected()) {
			privacyPolicyAgrement.click();
		}
	}
	
	public static void disablePrivacyPolicy() {
		if(privacyPolicyAgrement.isSelected()) {
			privacyPolicyAgrement.click();
		}
	}
	
	public static void clickNext() {
		next.click();
	}
	
}
