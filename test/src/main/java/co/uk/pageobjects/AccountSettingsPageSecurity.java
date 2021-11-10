package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.Tab;
import co.uk.webelements.TextBox;

public class AccountSettingsPageSecurity {
	
	private static Tab securityTabIsActive = new Tab("Security",By.xpath("//a[@class='nav-link active' and contains(text(),'Security')]"));
	private static TextBox currentPasswordTextBox = new TextBox("Current password",By.xpath("//input[@id='currentPassword']"));
	private static TextBox newPasswordTextBox = new TextBox("New password",By.xpath("//input[@id='newPassword']"));
	private static TextBox confirmPasswordTextBox = new TextBox("Confirm password",By.xpath("//input[@id='confirmNewPassword']"));
	private static Button updatePassword = new Button("Update password",By.xpath("//button[@Type='submit' and contains(text(),' Update password')]"));
	private static Element passwordDidNotMatchMessage = new Element("Warning message: password did not match",By.xpath("//h2[@id='swal2-title' and contains(text(),'did not match the one on record')]"));
	private static Element deleteAccountLink = new Element("Delete account",By.xpath("//a[text()='Delete your account']"));
	
	public static void clickDeleteAccount() {
		deleteAccountLink.click();
	}
	
	public static void verifyPasswordDidNotMatchModalIsDisplayed() {
		passwordDidNotMatchMessage.verifyDisplayed();
	}
	
	public static void verifySecurityTabIsActive() {
		securityTabIsActive.verifyDisplayed();
	}
	
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
	
	public static class DeleteConfirmModal{
		private static TextBox confirmTxtBox = new TextBox("Confirm",By.xpath("//input[@class='swal2-input']"));
		private static Button delete = new Button("Delete",By.xpath("//button[text()='Delete My Account']"));
		
		public static void enterConfirm(String confirm) {
			confirmTxtBox.setText(confirm);
		}
		
		public static void clickDelete() {
			delete.click();
		}
	}
}
