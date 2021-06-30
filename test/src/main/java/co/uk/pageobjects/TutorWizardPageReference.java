package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.core.DriverHandler;
import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.ListBox;
import co.uk.webelements.TextBox;

public class TutorWizardPageReference {
	
	private static Button addReference = new Button("Add reference",By.xpath("//app-references//Button[contains(text(),'Add Reference')]"));
	private static Button skip = new Button("Skip",By.xpath("//button[contains(text(),'Skip')]"));
	private static Button next = new Button("Next",By.xpath("//button[contains(text(),'Next')]"));
	
	public static void clickAddreference() {
		addReference.click();
	}
	
	public static void clickSkip() {
		skip.click();
	}
	
	public static void clickNext() {
		next.click();
	}
	
	public static class AddEditReferenceModal{
		
		private static TextBox forenameTextBox = new TextBox("Forename",By.xpath("//app-create-edit-reference//input[@id='forename']"));
		private static TextBox surnameTextBox = new TextBox("Surname",By.xpath("//app-create-edit-reference//input[@id='surname']"));
		private static TextBox emailTextBox = new TextBox("Email",By.xpath("//app-create-edit-reference//input[@id='email']"));
		private static TextBox phoneNumberTextBox = new TextBox("Phone number",By.xpath("//app-create-edit-reference//input[@id='phone']"));
		private static Element dialCode = new Element("Dial code",By.xpath("//app-create-edit-reference//div[contains(@class,'iti__flag-container')]"));
		private static Element dialCodeDropdown(String country) {
			return new Element(country+" Dial code",By.xpath("//app-create-edit-reference//span[text()='"+country+"']/parent::li"));
		}
		private static ListBox relationship = new ListBox("Relationship",By.xpath("//app-create-edit-reference//select[@id='relationship']"));
		private static TextBox documentuploader = new TextBox("File",By.xpath("//app-create-edit-reference//input[@id='DocumentUploader']"));
		private static Button save = new Button("Save",By.xpath("//app-create-edit-reference//button[contains(text(),'Save')]"));
		
		public static void enterForename(String forename) {
			forenameTextBox.setText(forename);
		}
		
		public static void enterSurname(String surname) {
			surnameTextBox.setText(surname);
		}
		
		public static void enterEmail(String email) {
			emailTextBox.setText(email);
		}
		
		public static void phoneNumber(String number) {
			phoneNumberTextBox.setText(number);
		}
		
		public static void selectDialCode(String country) {
			dialCode.click();
			DriverHandler.delay(1);
			dialCodeDropdown(country).click();
		}
		
		public static void selectRelationship(String selectRelation) {
			relationship.selectByVisibleText(selectRelation);
		}
		
		public static void uploadProfilePhoto(String filePath) {
			documentuploader.uploadFile(filePath);
		    DriverHandler.delay(5);
		}
		
		public static void clickSave() {
			save.click();
		}
		
	    public static class CropImageModal {

	        private static Element cropImageModal = new Element("Crop image",
	                By.xpath("//h4[@class='card-header-title' and contains(text(),'Crop Image')]"));
	        private static Button crop = new Button("Crop", By.xpath("//span[contains(text(),'Crop')]/parent::button"));
	        private static Button cancel = new Button("Cancel", By.xpath("//Button[contains(text(),'Cancel')]"));
	        private static Element successfulMessage = new Element("Your profile picture was uploaded",
	                By.xpath("//span[text()='Your profile picture was uploaded.']"));

	        public static void verifySuccessfulMessageIsDisplayed() {
	            successfulMessage.verifyDisplayed();
	        }

	        public static void verifyCropImageModalIsDisplayed() {
	            cropImageModal.verifyDisplayed();
	        }

	        public static void clickCrop() {
	            crop.click();
	        }

	        public static void clickCancel() {
	            cancel.click();
	        }
	    }
	}
}
