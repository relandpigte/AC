package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.core.DriverHandler;
import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.TextBox;

public class TutorWizardPageContactNumber {

	private static Element dialCode = new Element("Dial code",By.xpath("//div[contains(@class,'iti__flag-container')]"));
	private static Element dialCodeDropdown(String country) {
		return new Element(country+" Dial code",By.xpath("//span[text()='"+country+"']/parent::li"));
	}	
	private static TextBox phoneNumberTextBox = new TextBox("Phone Number",By.xpath("//input[@id='phone']"));
	
	private static TextBox verificationCodeTextBox = new TextBox("Verification Code",By.xpath("//input[@id='VerificationCode']"));
	private static Button send = new Button("Send",By.xpath("//button[contains(text(),'Send')]"));
	private static Button edit = new Button("Edit",By.xpath("//button[contains(text(),'Edit')]"));
	private static Button next = new Button("Next",By.xpath("//button[contains(text(),'Next')]"));
	private static Button back = new Button("Back",By.xpath("//button[contains(text(),'Back')]"));
	private static Button resend = new Button("Resend",By.xpath("//button[contains(text(),'Resend')]"));
	
	public static void selectDialCode(String country) {
		dialCode.click();
		DriverHandler.delay(1);
		dialCodeDropdown(country).click();
	}
	
	public static void enterPhoneNumber(String number) {
		phoneNumberTextBox.setText(number);
	}
	
	public static void enterVerificationCode(String verificationCode) {
		verificationCodeTextBox.setText(verificationCode);
	}
	
	public static void clickSend() {
		send.click();
	}
	
	public static void clickEdit() {
		edit.click();
	}
	
	public static void clickResend() {
		resend.click();
	}
	
	public static void clickNext() {
		next.click();
	}
	
	public static void clickBack() {
		back	.click();
	}
}
