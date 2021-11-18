package co.uk.stepdefinitions;

import co.uk.core.DriverHandler;
import co.uk.pageobjects.UserProfilePageCommonObjects;
import co.uk.pageobjects.UserProfilePageEducation;
import co.uk.pageobjects.UserProfilePageResearch;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;


public class UserProfilePageCommonObjectStepDefinitions {
 
    private static String photoFile1 = System.getProperty("user.dir").replace("\\", "/") + "/src/main/resources/Data/"
            + DriverHandler.environment + "/Sample1.jpg";
    
    @Then("^user is in profile settings$")
    public void verifyUserProfilePageIsDisplayed() {
        UserProfilePageCommonObjects.verifyUserProfilePageIsDisplayed();
        DriverHandler.delay(2);
    }

    @When("^user upload a profile photo$")
    public void uploadProfilePhoto() {
    	DriverHandler.delay(2);
        UserProfilePageCommonObjects.uploadProfilePhoto(photoFile1);
    }

    @When("^user add a cover photo$")
    public void addCoverPhoto() {
        UserProfilePageCommonObjects.clickEditCoverPhoto();
    }

    @When("^user select a photo from the gallery$")
    public void selectCoverPhoto() {
    	DriverHandler.delay(10);
        UserProfilePageCommonObjects.CoverPhotoGallery.clickToselectCoverPhoto("2");
    }

    @When("^user crop the cover photo$")
    public void cropCoverPhoto() {
        UserProfilePageCommonObjects.CoverPhotoGallery.clickCrop();
        DriverHandler.delay(5);
    }

    @Then("^upload a cover photo is successful$")
    public void verifyCoverPhotoIsUploaded() {
        UserProfilePageCommonObjects.CoverPhotoGallery.verifySuccessfulMessageIsDisplayed();
    }

    @Then("^confirmation is displayed$")
    public void verifyConfirmationModalIsDisplayed() {
    	UserProfilePageCommonObjects.ConfirmationModal.verifyConfirmationModalIsDisplayed();
    }

    @When("^the user confirms to remove a cover photo$")
    public void userConfirmsToRemoveCoverPhoto() {
        UserProfilePageCommonObjects.ConfirmationModal.clickYes();
        DriverHandler.delay(5);
    }
    
    @Then("^crop profile photo modal is displayed$")
    public void verifyCropProfilePhotoModalIsDisplayed() {
    	UserProfilePageCommonObjects.CropImageModal.verifyCropImageModalIsDisplayed();
    }
    
    @When("^user crop the image$")
    public void cropImage() {
    	UserProfilePageCommonObjects.CropImageModal.clickCrop();
    	DriverHandler.delay(5);
    }
    
    @Then("^upload a profile photo is successful$")
    public void verifyUploadAProfilePhotoIsSuccessful() {
    	UserProfilePageCommonObjects.CropImageModal.verifySuccessfulMessageIsDisplayed();
    }
    
    @When("^user remove a profile photo$")
    public void removeProfilePhoto() {
    	UserProfilePageCommonObjects.removeProfilePhoto();
    	UserProfilePageCommonObjects.ConfirmationModal.clickYes();
    }
    
    @Then("^successfully displayed profile picture message was removed$")
    public void verifySuccessfulyMessageProfilePhotoWasRemoved() {
    	UserProfilePageCommonObjects.verifyRemoveProfilePhotoMessageIsDisplayed();
    }
    
    @Then("^profile photo is removed$")
    public void verifyAnoumousPhotoIsDisplayed() {
    	UserProfilePageCommonObjects.verifyAnonymousPhoto();
    }
    
    @When("^user proceed to education tab$")
    public void proceedToEducationTab() {
    	UserProfilePageCommonObjects.clickEducationTab();
    	DriverHandler.delay(4);
    }
    
    @When("^user proceed to research tab$")
    public void proceedToResearchTab() {
    	UserProfilePageCommonObjects.clickResearchTab();
    	DriverHandler.delay(5);
    }
    
    @Then("^new profile photo is displayed$")
    public void verifyNewProfilePhotoIsDisplayed() {
    	UserProfilePageCommonObjects.verifyAnonyomousPhotoIsNotDisplayed();
    }
    
    @Then("message show successfully deleted")
    public void verifyDeletedMessage() {
    	UserProfilePageCommonObjects.verifySuccesfulyDeletedMessageIsDisplayed();
    }
    
    @When("^user wants to become a tutor on the profile page$")
    public void userBecomeAtutor() {
    	DriverHandler.delay(5);
    	UserProfilePageCommonObjects.clickBecomeATutor();
    }
    
    @Then("^\"(.*)\" tab is displayed on profile settings$")
	public void verifyTabIsDisplayed(String tab) {
    	UserProfilePageCommonObjects.verifyTabIsDisplayed(tab);
	}
    
    @Then("^\"(.*)\" tab is not displayed on profile settings$")
   	public void verifyTabIsNotDisplayed(String tab) {
       	UserProfilePageCommonObjects.verifyTabIsNotDisplayed(tab);
   	}
}
