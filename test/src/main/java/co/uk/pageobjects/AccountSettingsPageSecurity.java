package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.TextBox;

public class AccountSettingsPageSecurity {

	private static TextBox currentPasswordTextBox = new TextBox("Current password",By.xpath("//input[@id='currentPassword']"));
	private static TextBox newPasswordTextBox = new TextBox("New password",By.xpath("//input[@id='newPassword']"));
	private static TextBox confirmPasswordTextBox = new TextBox("Confirm password",By.xpath("//input[@id='confirmNewPassword']"));
	private static Button updatePassword = new Button("Update password",By.xpath("//button[@Type='submit' and contains(text(),' Update password')]"));
	
	public static void enterCurrentPassword(String currentPassword) {
		currentPasswordTextBox.setText(currentPassword);
	}
	
	public static void enterNewPassword(String newPassword) {
		newPasswordTextBox.setPassword(newPassword);
	}
	
	public static void enterConfirmPassword(String confirmPassword) {
		confirmPasswordTextBox.setText(confirmPassword);
	}
	
	public static void clickUpdatePassword() {
		updatePassword.click();
	}
	
}
