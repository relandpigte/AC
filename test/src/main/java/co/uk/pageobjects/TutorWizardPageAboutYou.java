package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.TextBox;

public class TutorWizardPageAboutYou {
	
	private static TextBox firstnameTextBox = new TextBox("Firsname",By.xpath("//input[@id='name']"));
	private static TextBox lastnameTextBox = new TextBox("Lastname",By.xpath("//input[@id='surname']"));
	private static TextBox professionalOverviewTextBox = new TextBox("Professional Overview",By.xpath("//div[contains(@class,'ql-editor')]/p"));
	private static Button next = new  Button("Next",By.xpath("//button[@type='submit' and contains(text(),'Next')]"));
	
	public static void enterFirstname(String firsname) {
		firstnameTextBox.setText(firsname);
	}
	
	public static void enterLastName(String lastname) {
		lastnameTextBox.setText(lastname);
	}
	
	public static void enterProfessionalOverview(String message) {
		professionalOverviewTextBox.setText(message);
	}
	
	public static void clickNext() {
		next.click();
	}
}
