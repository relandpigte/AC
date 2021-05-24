package co.uk.stepdefinitions;

import co.uk.core.DriverHandler;
import co.uk.pageobjects.student.UserProfilePageCommonObjects;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;

public class UserProfilePageCommonObjectStepDefinitions {
	
	@Then("^user is in profile settings$")
	public void verifyUserProfilePageIsDisplayed() {
		UserProfilePageCommonObjects.verifyUserProfilePageIsDisplayed();
	}

	@When("^user add a cover photo$")
	public void addCoverPhoto() {
		UserProfilePageCommonObjects.clickEditCoverPhoto();
	}

	@When("^user select a photo from the gallery$")
	public void selectCoverPhoto() {
		UserProfilePageCommonObjects.CoverPhotoGallery.clickToselectCoverPhoto("2");
	}

	@When("^user crop the cover photo$")
	public void cropCoverPhoto() {
		UserProfilePageCommonObjects.CoverPhotoGallery.clickCrop();
	}

	@Then("^upload a cover photo is successful$")
	public void verifyCoverPhotoIsUploaded() {
		UserProfilePageCommonObjects.CoverPhotoGallery.verifySuccessfulMessageIsDisplayed();
	}

	@When("^user remove a cover photo$")
	public void removeCoverPhoto() {
		UserProfilePageCommonObjects.removeCoverPhoto();
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

	@Then("^removing a cover photo is successful$")
	public void verifyRemovingCoverPhotoIsSuccessful() {
		UserProfilePageCommonObjects.verifyRemoveCoverPhotoMessageIsDisplayed();
	}
}
