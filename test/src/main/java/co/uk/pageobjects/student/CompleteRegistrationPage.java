package co.uk.pageobjects.student;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.TextBox;

public class CompleteRegistrationPage {

	private static Element completeRegistration = new Element("Complete registration",By.xpath("//h1[text()='Complete Registration']"));
	private static TextBox textboxEmail = new TextBox("Email",By.xpath("//input[@id='EmailAddress']"));
	private static TextBox textboxPassword = new TextBox("Password",By.xpath("//input[@id='Password']"));
	private static TextBox textboxConfirmPassword = new TextBox("Confirm Password",By.xpath("//input[@id='ConfirmPassword']"));
	private static Button register = new Button("Register",By.xpath("//button[text()='Register']"));
	private static Element sucessfullyRegisteredMessage = new Element("Successful message",By.xpath("//span[@class='text-light' and text()='Successfully registered']"));

	public static void verifySuccesfullyRegisteredMessageIsDisplayed() {
		sucessfullyRegisteredMessage.verifyDisplayed();
	}
	
	public static void verifyCompleteRegistrationPageIsDisplayed() {
		completeRegistration.verifyDisplayed();
	}
	
	public static void verifyEmailisMatched(String email) {
		textboxEmail.verifyAttributeEquals("value", email);
	}
	
	public static void enterPassword(String password) {
		textboxPassword.setText(password);
	}
	
	public static void enterConfirmPassword(String password) {
		textboxConfirmPassword.setText(password);
	}
	
	public static void clickRegister() {
		register.click();
	}
	
	public static class RequestIsNotValidModal {
		
		private static Element requestIsNotValid = new Element("Request is not valid",By.xpath("//h2[@id='swal2-title' and text()='Your request is not valid!']"));
		
		public static void verifyRequestIsNotValidIsDisplayed() {
			requestIsNotValid.verifyDisplayed();
		}
	}
}
