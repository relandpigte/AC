package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.CheckBox;
import co.uk.webelements.Element;
import co.uk.webelements.Tab;
import co.uk.webelements.TextBox;

public class AdminManageUserPage {

	private static Element titleHeader = new Element("Users page",By.xpath("//h1[text()='Users']"));
	private static Element create = new Element("Create",By.xpath("//a[contains(text(),'Create')]"));
	private static TextBox search = new TextBox("Search",By.xpath("//div[@class='card-header ng-tns-c121-2']//input[@type='search']"));
	private static Element actionbutton(String email) {
		return new Element(email+" action button",By.xpath("//td[text()='"+email+"']/following::td[contains(@class,'table-action')][1]//a"));
	}
	private static Element actionEdit = new Element("Edit",By.xpath("//div[contains(@class,'dropdown')]/a[contains(text(),'Edit')]"));
	private static Element actionDelete = new Element("Delete",By.xpath("//div[contains(@class,'dropdown')]/a[contains(text(),'Delete')]"));
	
	public static void verifyTitleHeader() {
		titleHeader.verifyDisplayed();
	}
	
	public static void clickCreate() {
		create.click();
	}
	
	public static void enterSearch(String searchName) {
		search.setTextAndEnter(searchName);
	}
	
	public static void clickEdit(String email) {
		actionbutton(email).click();
		actionEdit.click();
	}
	
	public static void clickDelete(String email) {
		actionbutton(email).click();
		actionDelete.click();
	}
	
	public static class CreateOrEditUserModal{
		
		private static Tab userRoles = new Tab("User roles",By.xpath("//span[text()='User roles']/parent::a"));
		private static TextBox  nameTextbox = new TextBox("Name",By.xpath("//input[@id='name']"));
		private static TextBox  surnameTextBox = new TextBox("Surname",By.xpath("//input[@id='surname']"));
		private static TextBox  usernameTextBox = new TextBox("Username",By.xpath("//input[@id='userName']"));
		private static TextBox  passwordTextBox = new TextBox("Password",By.xpath("//input[@id='password']"));
		private static TextBox  confirmPasswordTextBox = new TextBox("Confirm password",By.xpath("//input[@id='confirmPassword']"));
		private static TextBox  emailTextBox = new TextBox("Email",By.xpath("//input[@id='emailAddress']"));
		private static CheckBox activeStatus = new CheckBox("Active status",By.xpath("//input[@id='isActive']"));
		private static CheckBox publicStatus = new CheckBox("Public status",By.xpath("//input[@id='isPublic']"));
		private static CheckBox userRole(String role) {
			return  new CheckBox(role,By.xpath("//label[contains(text(),'"+role+"')]//../input"));
		}
		
		public static void selectUserRole(String role) {
			if(!userRole(role).isSelected()) {
				userRole(role).click();
			}
		}
		
		public static void unselectUserRole(String role) {
			if(userRole(role).isSelected()) {
				userRole(role).click();
			}
		}
		
		public static void clickUserRolesTab() {
			userRoles.click();
		}
		
		public static void enterName(String name) {
			nameTextbox.setText(name);
		}
		
		public static void enterSurname(String surname) {
			surnameTextBox.setText(surname);
		}
		
		public static void enterUsername(String username) {
			usernameTextBox.setText(username);
		}
		
		public static void enterPassword(String password) {
			passwordTextBox.setText(password);
		}
		
		public static void enterConfirmPassword(String confirmPassword) {
			confirmPasswordTextBox.setText(confirmPassword);
		}
		
		public static void enterEmail(String email) {
			emailTextBox.setText(email);
		}
		
		public static void enableActiveStatus() {
			if(!activeStatus.isSelected()) {
				activeStatus.click();
			}
		}
		public static void enablePublicStatus() {
			if(!publicStatus.isSelected()) {
				publicStatus.click();
			}
		}
		
		public static void disablePublicStatus() {
			if(publicStatus.isSelected()) {
				publicStatus.click();
			}
		}
		
		public static void disableActiveStatus() {
			if(activeStatus.isSelected()) {				
				activeStatus.click();
			}
		}
	}
}
