package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.CheckBox;

public class TutorWizardPageTermOfUse {
	
	private static Button print = new Button("Print",By.xpath("//app-terms-of-use//button[contains(text(),'Print')]"));
	private static CheckBox termOfUseAgree = new CheckBox("Agrement term of use",By.xpath("//app-terms-of-use//input[@id='acceptTermsOfUse']"));
	private static Button next = new Button("Next",By.xpath("//button[contains(text(),'Next')]"));
	
	public static void clickprint() {
		print.click();
	}
	
	public static void enableTermOfUse() {
		if(!termOfUseAgree.isSelected()) {
			termOfUseAgree.click();
		}
	}
	
	public static void disableTermOfUse() {
		if(termOfUseAgree.isSelected()) {
			termOfUseAgree.click();
		}
	}
	
	public static void clickNext() {
		next.click();
	}
	
}
