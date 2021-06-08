package co.uk.stepdefinitions;

import co.uk.core.DriverHandler;
import co.uk.pageobjects.student.UserProfilePageCommonObjects;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class UserProfilePageCommonObjectStepDefinitions {

    private static String profilePhotoFile = System.getProperty("user.dir").replace("\\", "/") + "/src/main/resources/Data/"
            + DriverHandler.environment + "/ProfilePhoto_Benjamin_Franklin.jpg";

    @Then("^user is in profile settings$")
    public void verifyUserProfilePageIsDisplayed() {
        UserProfilePageCommonObjects.verifyUserProfilePageIsDisplayed();
    }

    @When("^user upload a profile photo$")
    public void uploadProfilePhoto() {
        UserProfilePageCommonObjects.uploadProfilePhoto(profilePhotoFile);
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
    }
}
