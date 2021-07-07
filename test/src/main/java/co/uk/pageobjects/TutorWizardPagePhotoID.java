package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.core.DriverHandler;
import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.TextBox;

public class TutorWizardPagePhotoID {

	private static TextBox documentUploader = new TextBox("Photo file",By.xpath("//app-photo-id//input[@id='DocumentUploader']"));
	private static Element imagePreview = new Element ("Image preview",By.xpath("//app-photo-id//img[@class='image-preview']"));
	private static Button next = new Button("Next",By.xpath("//button[contains(text(),'Next')]"));
	
	public static void verifyImagePreviewIsDisplayed() {
		imagePreview.verifyDisplayed();
	}
	
	public static void uploadProfilePhoto(String filePath) {
		documentUploader.uploadFile(filePath);
	    DriverHandler.delay(5);
	}
	
	public static void clickNext() {
		next.click();
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
