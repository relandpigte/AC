package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.TextBox;

public class LoginPage {

	private static TextBox textBoxUsername = new TextBox("Username",By.xpath("//input[@id='userNameOrEmailAddress']"));
	private static Element forgetPasswordLink = new Element("Forget password",By.xpath("//a[contains(text(),' Forgot password')]"));
	private static Element registerLink = new Element("Register",By.xpath("//a[contains(text(),'Register')]"));
	private static TextBox textBoxPassWord = new TextBox("Password",By.xpath("//app-password-toggle[@id='password']//input[@type='password']"));
	private static Button buttonSignIn = new Button("Submit",By.xpath("//button[@type='submit']"));

	public static void enterUsername(String username) {
		textBoxUsername.setText(username);
	}
	
	public static void clickForgetPassword() {
		forgetPasswordLink.click();
	}
	
	public static void clickRegister() {
		registerLink.click();
	}
	
	public static void enterPassword(String pass) {
		textBoxPassWord.setText(pass);
	}
	
	public static void clickLogin() {
		buttonSignIn.click();
	}
	
	public static class LoginFailedModal{
		
		private static Element loginFailed = new Element("Login failed modal",By.xpath("//h2[text()='Login failed!']"));
		
		public static void verifyLoginFailedModalIsDisplayed() {
			loginFailed.verifyDisplayed();
		}
	}
}
