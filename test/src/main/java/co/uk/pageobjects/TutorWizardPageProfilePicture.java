package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.core.DriverHandler;
import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.TextBox;

public class TutorWizardPageProfilePicture {
	
	private static Button editProfilePhoto = new Button("Edit profile photo",
            By.xpath("//div[contains(@class,'profile-picture-changer')]//button[@aria-controls='dropdown-basic']"));
    private static TextBox uploadProfilePhoto = new TextBox("Upload profile photo",
            By.xpath("//app-profile-picture-changer//input[@class='inline-file-upload']"));
    private static Element removeProfilePhoto = new Element("Remove profile photo",
            By.xpath("//app-profile-picture-changer//a[contains(text(),'Remove Photo ')]"));
    private static Element anonymousPhoto = new Element("Anonymous photo",
            By.xpath("//div[contains(@class,'header-avatar-top')]//img[@src='assets/img/anonymous.png']"));
    private static Button next = new Button("Next",By.xpath("//button[contains(text(),'Next')]"));
    
    public static void clickNext() {
    	next.click();
    }
    
    public static void uploadProfilePhoto(String filePath) {
        uploadProfilePhoto.uploadFile(filePath);
        DriverHandler.delay(5);
    }
    
    public static void removeProfilePhoto() {
        editProfilePhoto.click();
        removeProfilePhoto.click();
    }
    
    public static void verifyAnonymousPhoto() {
        anonymousPhoto.verifyDisplayed();
    }
    
    public static void verifyAnonyomousPhotoIsNotDisplayed() {
    	anonymousPhoto.verifyNotDisplayed();
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
