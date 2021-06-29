package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.CheckBox;

public class TutorWizardPageDeclaration {
	
	private static Button completeApplication = new Button("Complete application",By.xpath("//app-declaration//button[contains(text(),'Complete Application')]"));
	private static CheckBox decalartion(String number) {
		
		return new CheckBox("Declartion: "+1,By.xpath("//app-declaration//input[@id='declaration"+number+"']"));
	}
	
	public static void enableAllDeclaration() {
		
		for(int i= 1;i<=10;i++) {
			decalartion(String.valueOf(i)).click();
		}
	}
	
	public static void clickCompleteApplication() {
		completeApplication.click();
	}
}
