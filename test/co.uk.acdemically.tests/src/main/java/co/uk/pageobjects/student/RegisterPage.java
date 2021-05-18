package co.uk.pageobjects.student;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.TextBox;

public class RegisterPage {

	private static Element registerTitle = new Element("Register",By.xpath("//h1[text()='Register']"));
	private static TextBox textboxFirstname = new TextBox("Firsname",By.xpath("//input[@id='FirstName']"));
	private static TextBox textboxLastname = new TextBox("Lastname",By.xpath("//input[@id='LastName']"));
	private static TextBox textboxEmail = new TextBox("Email",By.xpath("//input[@id='EmailAddress']"));
	private static TextBox textboxDateOfBirth = new TextBox("Date of birth",By.xpath("//input[@id='DateOfBirth']"));
	private static Element checkboxTermAndCondition = new Element("Term of condition",By.xpath("//input[@id='AcceptTAndC']"));		
	private static Button register = new Button("Register",By.xpath("//button[contains(text(),'Register')]"));
	
	public static void verifyRegisterIsDisplayed() {
		registerTitle.verifyDisplayed();
	}
	
	public static void enterFirstName(String firstname) {
		textboxFirstname.setPassword(firstname);
	}
	
	public static void enterLastName(String lastname) {
		textboxLastname.setText(lastname);
	}
	
	public static void enterEmail(String email) {
		textboxEmail.setText(email);
	}
	
	public static void enterDateOfBirth(String dateOfBirth) {
		textboxDateOfBirth.setTextAndEnter(dateOfBirth);
		//Example: 09/12/2021
	}
	
	public static void checkTermAndCondition() {
		checkboxTermAndCondition.click();
	}
	
	public static void clickRegister() {
		register.click();
	}
	
	public static class SentEmailModal {
		
		private static Element sentToEmailMessage = new Element("Link sent to email",By.xpath("//h2[@id='swal2-title' and contains(text(),'sent to your email')]"));
		private static Button ok = new Button("Ok",By.xpath("//button[text()='Ok']"));
		
		public static void verifySentToEmailMessageIsDisplayed() {
			sentToEmailMessage.verifyDisplayed();
		}
		
		public static void clickOk() {
			ok.click();
		}
	}
}
