package co.uk.stepdefinitions;

import java.util.List;
import java.util.Map;
import co.uk.core.DriverHandler;
import co.uk.pageobjects.student.UserProfilePageCommonObjects;
import co.uk.pageobjects.student.UserProfilePageEducation;
import co.uk.pageobjects.student.UserProfilePageIntroduction;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class UserProfilePageStepDefinistions {

	@When("^user add about information$")
	public void enterAboutInformation() {
		UserProfilePageIntroduction.About.clickEdit();
		UserProfilePageIntroduction.About.enterMessage(
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
		UserProfilePageIntroduction.About.clickSave();
		DriverHandler.delay(5);
	}
	
	@Then("^adding about user information is successful$")
	public void verifyAboutinformationIsDisplayed() {
		UserProfilePageIntroduction.About.verifyAboutMessageIsEqual(
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
	}
	
	@When("^user add education$")
	public void addEducation() {
		UserProfilePageEducation.clickAddEducation();
	}

	@When("^user enter education information$")
	public void enterEducationInformation(DataTable educationInformation) {
        List<Map<String, String>> data = educationInformation.asMaps(String.class, String.class);
        String country = data.get(0).get("Country");
        String institution = data.get(0).get("Institution");
        String city = data.get(0).get("City");
        String startyear = data.get(0).get("Start year");
        String Endyear = data.get(0).get("End year");
        if (!country.equals("null")) {
        	UserProfilePageEducation.AddEditEducationModal.selectCountry(country);
        }
        if(!institution.equals("null")) {
        	UserProfilePageEducation.AddEditEducationModal.enterInstitution(institution);
        }
        if(!city.equals("null")) {
        	UserProfilePageEducation.AddEditEducationModal.enterCity(city);
        }
        if(!startyear.equals("null")) {
        	UserProfilePageEducation.AddEditEducationModal.selectStartYear(startyear);
        }
        if(!Endyear.equals("null")) {
        	UserProfilePageEducation.AddEditEducationModal.selectEndYear(Endyear);
        }
	}
	
	@When("^user add education level$")
	public void enterAddEducationLevel(DataTable educationLevelInformation) {
		List<Map<String, String>> data = educationLevelInformation.asMaps(String.class, String.class);
        String coursetitle = data.get(0).get("Course title");
        String academicLevel = data.get(0).get("Academic Level");
        String grade = data.get(0).get("Grade");
        UserProfilePageEducation.AddEditEducationModal.clickAddCourse();
        if(!coursetitle.equals("null")) {
        	UserProfilePageEducation.AddEditEducationModal.CourseModal.selectCourseTitle(coursetitle);
        }
        if(!academicLevel.equals("null")) {
        	UserProfilePageEducation.AddEditEducationModal.CourseModal.enterAcademicLevel(academicLevel);
        }
        if(!grade.equals("null")) {
        	UserProfilePageEducation.AddEditEducationModal.CourseModal.enterGrade(grade);
        }
        UserProfilePageEducation.AddEditEducationModal.CourseModal.clickAddCourse();
	}
	
	@When("^user saving education information$")
	public void savingEducationInformation() {
		UserProfilePageEducation.AddEditEducationModal.clickSave();
	}
	
	@When("^user add course$")
	public void addOtherCourse() {
		UserProfilePageEducation.clickOtherCourse();
	}
	
	@Then("^add qualification modal is displayed$")
	public void verifyQulificationModalIsDisplayed() {
		UserProfilePageEducation.OtherCourse.verifyModalIsDisplayed("Add Qualification");
	}
	
	@When("^user enter qualification information$")
	public void enterQulificationInformation(DataTable educationLevelInformation) {
		List<Map<String, String>> data = educationLevelInformation.asMaps(String.class, String.class);
        String certificate = data.get(0).get("Certificate");
        String organization = data.get(0).get("Organization");
        String grade = data.get(0).get("Grade attained");
        String startYear = data.get(0).get("Start year");
        String endYear = data.get(0).get("End year");
        String country = data.get(0).get("Country");
        String city = data.get(0).get("City");
        String summary = data.get(0).get("Summary");
        
        if(!certificate.equals("null")) {
        	UserProfilePageEducation.OtherCourse.enterProfessionalCertification(certificate);
        }
        if(!organization.equals("null")) {
        	UserProfilePageEducation.OtherCourse.enterOrganization(organization);
        }
        if(!grade.equals("null")) {
        	UserProfilePageEducation.OtherCourse.enterGrade(grade);
        }
        if(!startYear.equals("null")) {
        	UserProfilePageEducation.OtherCourse.selectStartYear(startYear);
        }
        if(!endYear.equals("null")) {
        	UserProfilePageEducation.OtherCourse.selectEndYear(endYear);
        }
        if(!country.equals("null")) {
        	UserProfilePageEducation.OtherCourse.selectCountry(country);
        }
        if(!city.equals("null")) {
        	UserProfilePageEducation.OtherCourse.enterCity(city);
        }
        if(!summary.equals("null")) {
        	UserProfilePageEducation.OtherCourse.enterSummary(summary);
        }
	}
	
	@When("^user saving qualification information$")
	public void savingQulificationInformation() {
		UserProfilePageEducation.OtherCourse.clickSave();
	}
	
	@When("^user delete \"(.*)\" course information$")
	public void deleteCourse(String course) {
		UserProfilePageEducation.clickRemoveCourse(course);
	}
	
	@Then("^removing \"(.*)\" course is successful$")
	public void removeCourseIsSuccessful(String course) {
		UserProfilePageEducation.verifyCourseIsNotDisplayed(course);
	}
	
	@When("^the user confirms to remove a course$")
	public void confirmsToRemoveCourse() {
		UserProfilePageEducation.confirmationModal.clickYes();
		DriverHandler.delay(3);
	}
	
    private static String sampleFile = System.getProperty("user.dir").replace("\\", "/") + "/src/main/resources/Data/"
            + DriverHandler.environment + "/Sample1.jpg";
   
	@When("^user upload evidence of qualification attained$")
	public void uploadEvidenceQualification() {
		UserProfilePageEducation.OtherCourse.uploadDocument(sampleFile);
	}
	
	@When("^user add evidence file$")
	public void addEvidenceFile() {
		UserProfilePageEducation.AddEditEducationModal.clickEvidenceTab();
		UserProfilePageEducation.AddEditEducationModal.uploadEvidence(sampleFile);
	}
	
	@Then("^\"(.*)\" evidence is added$")
	public void verifyEvidenceIsAdded(String name) {
		DriverHandler.delay(1);
		UserProfilePageEducation.AddEditEducationModal.verifyEvidenceNameIsDisplayed(name);
	}
	
	@When("^user enter \"(.*)\" category evidence$")
	public void enterCategoryEvidence(String category) {
		UserProfilePageEducation.AddEditEducationModal.enterEvidenceCategory(category);
	}
	
	@When("^user saving the education information$")
	public void saveEducationInformation() {
		UserProfilePageEducation.AddEditEducationModal.clickSave();
		DriverHandler.delay(4);
	}
	
	
}


