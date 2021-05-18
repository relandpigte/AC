package co.uk.pageobjects.student;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.Element;

public class UserProfilePage {

	private static Button editCoverPhoto = new Button("Edit cover photo",By.xpath("//div[contains(@class,'cover-photo-changer')]//button[@aria-controls='dropdown-basic']"));
	private static Element uploadCoverPhoto = new Element("Upload cover photo",By.xpath("//div[contains(@class,'cover-photo-changer')]//a[contains(text(),'Upload Photo')]"));
	private static Button editProfilePhoto = new Button("Edit profile photo",By.xpath("//div[contains(@class,'profile-picture-changer')]//button[@aria-controls='dropdown-basic']"));
	private static Element uploadProfilePhoto = new Element("Upload profile photo",By.xpath("//div[contains(@class,'profile-picture-changer')]//a[contains(text(),'Upload Photo')]"));
	
	public static void clickEditCoverPhoto() {
		editCoverPhoto.click();
		uploadCoverPhoto.click();
	}
	
	public static void clickEditProfilePhoto() {
		editProfilePhoto.click();
		uploadProfilePhoto.click();
	}
	
	public static class CropImageModal{
		
		private static Element cropImageModal = new Element("Crop image",By.xpath("//h4[@class='card-header-title' and contains(text(),'Crop Image')]"));
		private static Button crop = new Button("Crop",By.xpath("//span[contains(text(),'Crop')]/parent::button"));
		private static Button cancel = new Button("Cancel",By.xpath("//Button[contains(text(),'Cancel')]"));
		
	}
}
