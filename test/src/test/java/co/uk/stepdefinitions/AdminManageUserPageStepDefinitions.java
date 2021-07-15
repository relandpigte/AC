package co.uk.stepdefinitions;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import co.uk.core.DriverHandler;
import co.uk.pageobjects.AdminManageUserPage;
import co.uk.pageobjects.RegisterPage;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class AdminManageUserPageStepDefinitions {

	@Then("^user is in manage user page$")
	public void verifyUserPageIsDisplayed() {
		AdminManageUserPage.verifyTitleHeader();
		DriverHandler.delay(2);
	}
	
	@When("^user add a new user$")
	public void addNewUser() {
		AdminManageUserPage.clickCreate();
	}
	
	@When("^user enter a user details$")
	public void enterUserDetails(DataTable userDetails) {
        List<Map<String, String>> data = userDetails.asMaps(String.class, String.class);
        String name = data.get(0).get("Name");
        String surname = data.get(0).get("Surname");
        String username = data.get(0).get("Username");
        String password = data.get(0).get("Password");
        String email = data.get(0).get("Email");
        String activeStatus = data.get(0).get("Active");
        String publicStatus = data.get(0).get("Public");
        if(!name.equals("null")) {
        	AdminManageUserPage.CreateOrEditUserModal.enterName(name.replace("XXX", DriverHandler.timestamp));
        }
        if(!surname.equals("null")) {	 
        	AdminManageUserPage.CreateOrEditUserModal.enterSurname(surname);
        }
        if(!username.equals("null")) {	 
        	AdminManageUserPage.CreateOrEditUserModal.enterUsername(username.replace("XXX", DriverHandler.timestamp));
        }
        if(!password.equals("null")) {	 
        	AdminManageUserPage.CreateOrEditUserModal.enterPassword(password);
        	AdminManageUserPage.CreateOrEditUserModal.enterConfirmPassword(password);
        }
        if(!email.equals("null")) {	 
        	AdminManageUserPage.CreateOrEditUserModal.enterEmail(email.replace("XXX", DriverHandler.timestamp)+"@academically.33mail.com");
        }
        if(activeStatus.equals("Yes")) {	 
        	AdminManageUserPage.CreateOrEditUserModal.enableActiveStatus();
        }
        if(publicStatus.equals("Yes")) {	 
        	AdminManageUserPage.CreateOrEditUserModal.enablePublicStatus();
        }
        if(activeStatus.equals("No")) {	 
        	AdminManageUserPage.CreateOrEditUserModal.disableActiveStatus();
        }
        if(publicStatus.equals("No")) {	 
        	AdminManageUserPage.CreateOrEditUserModal.disablePublicStatus();
        }
    
	}
	
	@When("^user select a \"(.*)\" role$")
	public void selectRole(String role) {
		AdminManageUserPage.CreateOrEditUserModal.clickUserRolesTab();
		AdminManageUserPage.CreateOrEditUserModal.selectUserRole(role);
	}
	
	@When("^user saving user details$")
	public void saveUserDetails() {
		AdminManageUserPage.CreateOrEditUserModal.clickSave();
	}
	
	@When("^user search \"(.*)\" on user management$")
	public void enterSearch(String email) throws IOException {
		DriverHandler.refreshPage();
		AdminManageUserPage.enterSearch(email.replace("XXX", DriverHandler.timestamp+"@academically.33mail.com"));
		DriverHandler.delay(5);
	}
	
	@When("^user delete \"(.*)\" user$")
	public void deleteAUser(String email) {
		AdminManageUserPage.clickDelete(email.replace("XXX", DriverHandler.timestamp+"@academically.33mail.com"));
	}
	
	@Then("^delete modal is displayed on user management$")
	public void verifyDeleteModalisDisplayed() {
		AdminManageUserPage.conformationDelete.verifydeleteMessageModalIsDisplayed();
	}
	
	@When("^user click yes to delete on user management$")
	public void clickYesToDelete() {
		AdminManageUserPage.conformationDelete.clickYes();
	}
	
	@Then("^\"(.*)\" is not displayed$")
	public void verifyUserIsNotDisplayed(String email) {
		AdminManageUserPage.verifyEmailIsNotDisplayed(email.replace("XXX", DriverHandler.timestamp+"@academically.33mail.com"));
	}
	
	@When("^user edit \"(.*)\" user$")
	public void clickEdit(String email) {
		DriverHandler.delay(3);
		AdminManageUserPage.clickEdit(email);
	}
	
	@Then("^\"(.*)\" is displayed$")
	public void verifyEmailIsDisplayed(String email) {
		AdminManageUserPage.verifyEmailIsDisplayed(email.replace("XXX", DriverHandler.timestamp+"@academically.33mail.com"));
	}
}
