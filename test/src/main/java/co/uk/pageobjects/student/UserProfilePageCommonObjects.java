package co.uk.pageobjects.student;

import java.nio.file.Path;

import org.openqa.selenium.By;

import co.uk.core.DriverHandler;
import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.Tab;
import co.uk.webelements.TextBox;

public class UserProfilePageCommonObjects {
	
	private static Tab introductionTab = new Tab("Introduction",By.xpath("//a[contains(@class,'nav-link') and contains(text(),'Introduction')]"));
	private static Tab educationTab = new Tab("Education",By.xpath("//a[contains(@class,'nav-link') and contains(text(),'Education')]"));
	private static Tab researchTab = new Tab("Research",By.xpath("//a[contains(@class,'nav-link') and contains(text(),' Research ')]"));
	private static Tab industryExperienceTab = new Tab("Industry Experience",By.xpath("//a[contains(@class,'nav-link') and contains(text(),'Industry Experience')]"));
	public static Element userProfile = new Element("User profile page",By.xpath("//app-header//div[contains(@class,'avatar')]"));
	private static Button editCoverPhoto = new Button("Edit cover photo",By.xpath("//div[contains(@class,'cover-photo-changer')]//button[@aria-controls='dropdown-basic']"));
	private static Element browseCoverPhoto = new Element("Browse Gallery",By.xpath("//app-cover-photo-changer//a[contains(text(),' Browse Gallery')]"));	
	private static Element removeCoverPhoto = new Element("Remove Photo",By.xpath("//app-cover-photo-changer//a[contains(text(),'Remove Photo')]"));
	private static Element removeCoverPhotoMessage = new Element("",By.xpath("the user confirms to remove a cover photo"));
	private static Button editProfilePhoto = new Button("Edit profile photo",By.xpath("//div[contains(@class,'profile-picture-changer')]//button[@aria-controls='dropdown-basic']"));
	private static TextBox uploadProfilePhoto = new TextBox("Upload profile photo",By.xpath("//app-profile-picture-changer//input[@class='inline-file-upload']"));
	
	public static void clickIntroductionTab() {
		introductionTab.click();
	}
	
	public static void clickEducationTab() {
		educationTab.click();
	}
	
	public static void clickResearchTab() {
		researchTab.click();
	}
	
	public static void clickIndustryExperienceTab() {
		industryExperienceTab.click();
	}
	
	public static void verifyRemoveCoverPhotoMessageIsDisplayed() {
		removeCoverPhotoMessage.verifyDisplayed();
	}
	
	public static void removeCoverPhoto() {
		editCoverPhoto.click();
		removeCoverPhoto.click();
	}
	
	public static void clickEditCoverPhoto() {
		editCoverPhoto.click();
		browseCoverPhoto.click();
	}
	
	public static void verifyUserProfilePageIsDisplayed() {
		userProfile.verifyDisplayed();
	}
	
	public static void uploadProfilePhoto(String filePath) {
	uploadProfilePhoto.setText(filePath);
		
	}
	
	public static class CropImageModal{
		
		private static Element cropImageModal = new Element("Crop image",By.xpath("//h4[@class='card-header-title' and contains(text(),'Crop Image')]"));
		private static Button crop = new Button("Crop",By.xpath("//span[contains(text(),'Crop')]/parent::button"));
		private static Button cancel = new Button("Cancel",By.xpath("//Button[contains(text(),'Cancel')]"));
		
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
	
	public static class CoverPhotoGallery {
		
		private static Element coverPhotoGaleryModal = new Element("Cover Photo Gallery",By.xpath("//app-image-gallery//h4[contains(text(),'Cover Photo Gallery')]"));
		private static Element coverPhoto(String coverPhotoNumber) {
			return new Element("Cover photo "+coverPhotoNumber,By.xpath("//app-image-gallery//h4[contains(text(),'Cover Photo Gallery')]//following::a["+coverPhotoNumber+"]"));	
		}
		private static Button crop = new Button("Crop",By.xpath("//app-image-gallery//following::button/span[contains(text(),'Crop')]"));
		private static Button cancel = new Button("Cancel",By.xpath("//app-image-gallery//following::button[contains(text(),'Cancel')]"));
		private static Element successfulmessage = new Element("Your cover photo was uploaded",By.xpath("//span[@class='text-light' and text()='Your cover photo was uploaded.']"));
		
		public static void verifySuccessfulMessageIsDisplayed() {
			successfulmessage.verifyDisplayed();
		}
		
		public static void verifyCoverPhotoGaleryIsDisplayed() {
			coverPhotoGaleryModal.verifyDisplayed();
		}
		
		public static void clickToselectCoverPhoto(String number) {
			coverPhoto(number).click();
		}
		
		public static void clickCrop() {
			crop.click();
		}
		
		public static void clickCancel() {
			cancel.click();
		}
	}
	
	public static class ConfirmationModal{
		
		private static Element confirmationModalIsDisplayed = new Element("Confirmation modal",By.xpath("//div[@class='swal2-header']//h2[text()='Are you sure?']"));
		private static Button yes = new Button("Yes",By.xpath("//div[@class='swal2-header']//h2[text()='Are you sure?']//following::button[text()='Yes']"));
		private static Button cancel = new Button("Cancel",By.xpath("//div[@class='swal2-header']//h2[text()='Are you sure?']//following::button[text()='Cancel']"));
		
		public static void verifyConfirmationModalIsDisplayed() {
			confirmationModalIsDisplayed.verifyDisplayed();
		}
		
		public static void clickYes() {
			yes.click();
		}
		
		public static void clickCancel() {
			cancel.click();
		}
	}
}
