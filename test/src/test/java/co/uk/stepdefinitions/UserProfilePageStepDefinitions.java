package co.uk.stepdefinitions;

import java.util.List;
import java.util.Map;
import co.uk.core.DriverHandler;
import co.uk.pageobjects.RegisterPage;
import co.uk.pageobjects.TutorWizardPageLanguage;
import co.uk.pageobjects.UserProfilePageCommonObjects;
import co.uk.pageobjects.UserProfilePageEducation;
import co.uk.pageobjects.UserProfilePageIntroduction;
import co.uk.pageobjects.UserProfilePageResearch;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class UserProfilePageStepDefinitions {

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
	
	@When("^user delete education information$")
	public void deleteEducationInformation() {
		UserProfilePageEducation.clickRemoveEducation();
	}
	
	@When("^the user confirms to remove a education information$")
	public void confirmToRemoveEducation() {
		UserProfilePageEducation.confirmationModal.clickYes();
	}
	
	@When("^user add research interest$")
    public void addResearchInterest() {
    	UserProfilePageResearch.clickAddResearchInterest();
    	DriverHandler.delay(3);
    }
	
	@Then("^\"(.*)\" interest modal is displayed$")
	public void verifyResearchModalTitleIsDisplayed(String title) {
		UserProfilePageResearch.ResearchInterestModal.verifyModalTitle(title);
	}
	
	@When("^user enter research interest information$")
	public void enterResearchInterest(DataTable researchInterestInformation) {
        List<Map<String, String>> data = researchInterestInformation.asMaps(String.class, String.class);
        String title = data.get(0).get("Title");
        String researchfields = data.get(0).get("Research fields");
        String description = data.get(0).get("Description");
        if(!title.equals("null")) {
        	UserProfilePageResearch.ResearchInterestModal.enterTitle(title);
        }
        if(!description.equals("null")) {	 
        	UserProfilePageResearch.ResearchInterestModal.enterDescription(description);
        }
        if(!researchfields.equals("null")) {	 
        	UserProfilePageResearch.ResearchInterestModal.clickAddResearchField();
        	UserProfilePageResearch.ResearchInterestModal.ResearchFieldModal.enterTreeFilter(researchfields);
        	UserProfilePageResearch.ResearchInterestModal.ResearchFieldModal.clickTreeItem(researchfields);
        	UserProfilePageResearch.ResearchInterestModal.ResearchFieldModal.verifyItemIsAdded(researchfields);
        	UserProfilePageResearch.ResearchInterestModal.ResearchFieldModal.clickAdd();
        }
	}
	
	@When("^user saving research interest information$")
	public static void saveResearchInterestInformation() {
		UserProfilePageResearch.ResearchInterestModal.clickSave();
	}
	
	@Then("^adding research interest \"(.*)\" is successful$")
	public void verifyResearchInterstIsAdded(String title) {
		UserProfilePageResearch.verifyResearchInterestIsDisplayed(title);
	}
	
	@When("^user delete research interest \"(.*)\"$")
	public void deleteResearchInterest(String title) {
		UserProfilePageResearch.clickRemoveResearchInterest(title);
	}
	
	@When("^the user confirms to remove a research interest$")
	public void confirmsToRemoveResearchInterest() {
		UserProfilePageResearch.confirmationModal.clickYes();
		DriverHandler.delay(4);
	}
	
	@Then("^removing \"(.*)\" research interest is successful$")
	public void verifyRemovingResearchInterestIsSuccessful(String title) {
		UserProfilePageResearch.verifyResearchInterestIsNotDisplayed(title);
	}
	
	@When("^user add research methodology$")
	public void addResearchMethodology() {
		UserProfilePageResearch.clickAddMethodology();
		DriverHandler.delay(8);
	}
	
	@Then("^\"(.*)\" Methodology modal is displayed$")
	public void verifyMethodologyModalIsDisplayed(String title) {
		UserProfilePageResearch.MethodologyModal.verifyModalTitle(title);
	}
	
	@When("^user enter research methodology information$")
	public void enterResearchMethodologyInformation(DataTable methodologyInformation) {
        List<Map<String, String>> data = methodologyInformation.asMaps(String.class, String.class);
        String title = data.get(0).get("Title");
        String ResearchMethod = data.get(0).get("Research method");
        String description = data.get(0).get("Description");
        if(!title.equals("null")) {
        	UserProfilePageResearch.MethodologyModal.enterTitle(title);
        }
        if(!description.equals("null")) {	 
        	UserProfilePageResearch.MethodologyModal.enterDescription(description);
        }
        if(!ResearchMethod.equals("null")) {	 
        	UserProfilePageResearch.MethodologyModal.clickAddMethod();
        	UserProfilePageResearch.MethodologyModal.ResearchMethodModal.enterTreeFilter(ResearchMethod);
        	UserProfilePageResearch.MethodologyModal.ResearchMethodModal.clickTreeItem(ResearchMethod);
        	UserProfilePageResearch.MethodologyModal.ResearchMethodModal.verifyItemIsAdded(ResearchMethod);
        	UserProfilePageResearch.MethodologyModal.ResearchMethodModal.clickAdd();
        }
	}
	
	@When("^user saving research methodology information$")
	public void savingResearchMethodologyInformation() {
		UserProfilePageResearch.MethodologyModal.clickSave();
	}
	
	@Then("^adding methodology \"(.*)\" is successful$")
	public void verifyMethodologyIsAdded(String title) {
		UserProfilePageResearch.verifyMethodologyIsDisplayed(title);
	}
	
	@When("^user delete \"(.*)\" research methodology$")
	public void removeResearchMethodology(String title) {
		UserProfilePageResearch.clickRemoveMethodology(title);
	}
	
	@When("^the user confirms to remove a research methodology$")
	public void confirmToRemoveResearchMethodology() {
		UserProfilePageResearch.confirmationModal.clickYes();
	}
	
	@Then("^removing \"(.*)\" research methodology is successful$")
	public void verifyRemovingResearhMethodologyIsSuccessful(String title) {
		UserProfilePageResearch.verifyMethodologyIsNotDisplayed(title);
	}
	
	@When("^user add publication$")
	public void addPublication() {
		UserProfilePageResearch.clickAddPublication();
		DriverHandler.delay(2);
	}
	
	@Then("^\"(.*)\" publication modal is displayed$")
	public void verifyPublicationModalIsDisplayed(String title) {
		UserProfilePageResearch.PublicationModal.verifyModalTitleIsDisplayed(title);
	}
	
	@When("^user enter publication information$")
	public void enterPublicationInformation(DataTable publicationInformation) {
        List<Map<String, String>> data = publicationInformation.asMaps(String.class, String.class);
        String title = data.get(0).get("Title");
        String publicationType = data.get(0).get("Publication Type");
        String publisher = data.get(0).get("Publisher");
        String date = data.get(0).get("Date");
        String tag = data.get(0).get("Tag");
        String abstarct = data.get(0).get("Abstarct");
        if(!title.equals("null")) {
        	UserProfilePageResearch.PublicationModal.enterTitle(title);
        }
        if(!publicationType.equals("null")) {
        	UserProfilePageResearch.PublicationModal.selectPublicationType(publicationType);
        }
        if(!publisher.equals("null")) {
        	UserProfilePageResearch.PublicationModal.enterPublisher(publisher.replace("XXX", DriverHandler.timestamp));
        }
        if(!date.equals("null")) {
        	UserProfilePageResearch.PublicationModal.enterPublicationDate(date);
        }
        if(!abstarct.equals("null")) {
        	UserProfilePageResearch.PublicationModal.enterAbstract(abstarct);
        }
        if(!tag.equals("null")) {
        	UserProfilePageResearch.PublicationModal.enterAndSelectTag(tag);
        }
	}
	
	@When("^user saving publication information$")
	public void savePublicationInformation() {
		UserProfilePageResearch.PublicationModal.clickSave();
		DriverHandler.delay(5);
	}
	
	@Then("^adding publication \"(.*)\" is successful$")
	public void verifyPublicationIsAdded(String title) {
		UserProfilePageResearch.verifyPublicationIsDisplayed(title);
	}
	
	@When("^user delete publication \"(.*)\"$")
	public void deletePublication(String title) {
		UserProfilePageResearch.clickRemovePublication(title);
	}
	
	@When("^the user confirms to remove a publication$")
	public void confirmToRemovePublication() {
		UserProfilePageResearch.confirmationModal.clickYes();
		DriverHandler.delay(6);
	}
	
	@Then("^removing \"(.*)\" publication is successful$")
	public void verifyPublicationIsNotDisplayed(String title) {
		UserProfilePageResearch.verifyPublicationIsNotDisplayed(title);
	}
	
	@When("^user edit publication \"(.*)\"$")
	public void editPublication(String title) {
			UserProfilePageResearch.clickEditPublication(title);
	}
	
	@When("^user edit \"(.*)\" research methodology$")
	public void editResearchMethodology(String title) {
		UserProfilePageResearch.clickEditMethodology(title);
	}
	
	@When("^user edit research interest \"(.*)\"$")
	public void editResearchInterest(String title) {
		UserProfilePageResearch.clickEditResearchInterest(title);
	}
	
	@Then("^verify publication informations are correct$")
	public void verifyPublication(DataTable publicationInformation) {
        List<Map<String, String>> data = publicationInformation.asMaps(String.class, String.class);
        String title = data.get(0).get("Title");
        String publicationType = data.get(0).get("Publication Type");
        String publisher = data.get(0).get("Publisher");
        String date = data.get(0).get("Date");
        String tag = data.get(0).get("Tag");
        String abstarct = data.get(0).get("Abstarct");
        DriverHandler.delay(3);
        if(!title.equals("null")) {
        	UserProfilePageResearch.PublicationModal.verifyTitleValueIsCorrect(title);
        }
        if(!publicationType.equals("null")) {
        	UserProfilePageResearch.PublicationModal.verifyPublicationTypeValueIsCorrect(publicationType);
        }
        if(!publisher.equals("null")) {
        	UserProfilePageResearch.PublicationModal.verifyPublisherValueIsCorrect(publisher.replace("XXX", DriverHandler.timestamp));
        }
        if(!date.equals("null")) {
        	UserProfilePageResearch.PublicationModal.verifypublicationDateValueIsCorrect(date);
        }
        if(!abstarct.equals("null")) {
        	UserProfilePageResearch.PublicationModal.verifyAbstractValueIsCorrect(abstarct);
        }
        if(!tag.equals("null")) {
        	UserProfilePageResearch.PublicationModal.verifyTagIsDisplayed(tag);
        }
	}
	
	@Then("^verify research methodology informations are correct$")
	public void verifyResearchMethodologyInformation(DataTable methodologyInformation) {
        List<Map<String, String>> data = methodologyInformation.asMaps(String.class, String.class);
        String title1 = data.get(0).get("Title");
        String ResearchMethod1 = data.get(0).get("Research method");
        String ResearchMethod2 = data.get(1).get("Research method");
        String description = data.get(0).get("Description");
        if(!title1.equals("null")) {
        	UserProfilePageResearch.MethodologyModal.verifyTitleValueIsCorrect(title1);
        }
        if(!description.equals("null")) {
        	UserProfilePageResearch.MethodologyModal.verifyDescriptionValueIsCorrect(description);
        }
        if(!ResearchMethod1.equals("null")) {
        	UserProfilePageResearch.MethodologyModal.verifyResearchMethodAlertIsDisplayed(ResearchMethod1);
        }
        if(!ResearchMethod2.equals("null")) {
        	UserProfilePageResearch.MethodologyModal.verifyResearchMethodAlertIsDisplayed(ResearchMethod2);
        }
	}
	
	@Then("^verify research interest informations are correct$")
	public void verifyResearchInterestInformation(DataTable researchInterestInformation) {
        List<Map<String, String>> data = researchInterestInformation.asMaps(String.class, String.class);
        String title = data.get(0).get("Title");
        String researchfields = data.get(0).get("Research fields");
        String description = data.get(0).get("Description");
        if(!title.equals("null")) {
        	UserProfilePageResearch.ResearchInterestModal.verifyTitleValueIsCorrect(title);
        }
        if(!description.equals("null")) {	 
        	UserProfilePageResearch.ResearchInterestModal.veriftyDescriptionValueIsCorrect(description);
        }
        if(!researchfields.equals("null")) {	 
        	UserProfilePageResearch.ResearchInterestModal.verifyresearchFieldAlertIsDisplayed(researchfields);
        }
	}
	
	
	
	@When("^user add language spoken$")
	public void addLanguageSpoken() {
		DriverHandler.delay(3);
		UserProfilePageIntroduction.LanguageSpoken.clickEdit();
		DriverHandler.delay(4);
	}

	@When("^user edit language spoken$")
	public void editLanguageSpoken() {
		UserProfilePageIntroduction.LanguageSpoken.clickEdit();
		DriverHandler.delay(4);
	}

	@When("^select \"(.*)\" english proficiency$")
	public void selectEnglishProficiency(String englishLevel) {
		UserProfilePageIntroduction.LanguageSpoken.LanguageModal.selectEnglishProficiency(englishLevel);
	}

	@When("^user add other language$")
	public void enterOtherLanguage(DataTable otherLanguage) {
		List<Map<String, String>> data = otherLanguage.asMaps(String.class, String.class);
		String language = data.get(0).get("Language");
		String proficiency = data.get(0).get("Proficiency");
		UserProfilePageIntroduction.LanguageSpoken.LanguageModal.clickAddLanguage();
		DriverHandler.delay(1);
		if (!proficiency.equals("null")) {
			UserProfilePageIntroduction.LanguageSpoken.LanguageModal.AddEditLanguageModal.selectLanguage(language);
		}
		if (!proficiency.equals("null")) {
			UserProfilePageIntroduction.LanguageSpoken.LanguageModal.AddEditLanguageModal.selectProficiency(proficiency);
		}
		UserProfilePageIntroduction.LanguageSpoken.LanguageModal.AddEditLanguageModal.clickAdd();
	}

	@When("^user saving spoken language information$")
	public void saveSpokenLanguageInformation() {
		UserProfilePageIntroduction.LanguageSpoken.LanguageModal.clickSave();
		DriverHandler.delay(5);
	}

	@Then("^\"(.*)\" \"(.*)\" language is added$")
	public void verifyAddedLanguage(String proficiency, String language) {
		UserProfilePageIntroduction.LanguageSpoken.verifyLanguageAndProficiencyAreDisplayed(language, proficiency);
	}
	
	@When("^user edit \"(.*)\" language$")
	public void editOtherLanguage(String language) {
		UserProfilePageIntroduction.LanguageSpoken.LanguageModal.clickEditOtherLanguage(language);
	}
	
	@When("^user edit other language$")
	public void editOtherLanguage(DataTable otherLanguage) {
		List<Map<String, String>> data = otherLanguage.asMaps(String.class, String.class);
		String language = data.get(0).get("Language");
		String proficiency = data.get(0).get("Proficiency");
		DriverHandler.delay(1);
		if (!proficiency.equals("null")) {
			UserProfilePageIntroduction.LanguageSpoken.LanguageModal.AddEditLanguageModal.selectLanguage(language);
		}
		if (!proficiency.equals("null")) {
			UserProfilePageIntroduction.LanguageSpoken.LanguageModal.AddEditLanguageModal.selectProficiency(proficiency);
		}
		UserProfilePageIntroduction.LanguageSpoken.LanguageModal.AddEditLanguageModal.clickUpdate();
	}
	
	@When("^user removes \"(.*)\" language$")
	public void removeLanguage(String language) {
		UserProfilePageIntroduction.LanguageSpoken.LanguageModal.removeEditOtherLanguage(language);
	}
	
	@Then("^removing \"(.*)\" \"(.*)\" language is successful$")
	public void verifyLanguageIsRemoved(String proficient, String language) {
		UserProfilePageIntroduction.LanguageSpoken.verifyLanguageIsNotDisplayed(language, proficient);
	}
}

