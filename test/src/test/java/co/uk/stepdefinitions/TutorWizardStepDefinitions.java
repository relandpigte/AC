package co.uk.stepdefinitions;

import java.util.List;
import java.util.Map;

import co.uk.core.DriverHandler;
import co.uk.pageobjects.RegisterPage;
import co.uk.pageobjects.TutorWizardCommonObject;
import co.uk.pageobjects.TutorWizardPageAboutYou;
import co.uk.pageobjects.TutorWizardPageEducation;
import co.uk.pageobjects.TutorWizardPageLanguage;
import co.uk.pageobjects.TutorWizardPageResearchInterest;
import co.uk.pageobjects.TutorWizardPageServicesOffered;
import co.uk.pageobjects.UserProfilePageCommonObjects;
import co.uk.pageobjects.UserProfilePageEducation;
import co.uk.pageobjects.UserProfilePageResearch;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class TutorWizardStepDefinitions {

	@Then("^user is in tutor wizard page$")
	public void verifyTutorWizardIsDisplayed() {
		TutorWizardCommonObject.verifyTutorWizardIsDisplayed();
	}

	@When("^user adds about information$")
	public void enterAboutInformation(DataTable accountDetails) {
		DriverHandler.delay(5);
		List<Map<String, String>> data = accountDetails.asMaps(String.class, String.class);
		String firstname = data.get(0).get("Firstname".replace("XXX", DriverHandler.timestamp));
		String lastname = data.get(0).get("Lastname");
		String overview = data.get(0).get("Overview");

		if (!firstname.equals("null")) {
			TutorWizardPageAboutYou.enterFirstname(firstname.replace("XXX", DriverHandler.timestamp));
		}

		if (!lastname.equals("null")) {
			TutorWizardPageAboutYou.enterLastName(lastname);
		}

		if (!overview.equals("null")) {
			TutorWizardPageAboutYou.enterProfessionalOverview(overview);
			DriverHandler.delay(2);
		}
	}

	@When("^user next to education$")
	public void nextToEducation() {
		TutorWizardPageAboutYou.clickNext();
	}

	@Then("^add level modal is displayed$")
	public void addEditlevelModalIsDisplayed() {
		TutorWizardPageEducation.AddEditEducationModal.verifyTitleModal(null);
	}

	@When("^user add education information on tutor wizard$")
	public void clickAddEducationInformation() {
		TutorWizardPageEducation.clickAddEducation();
	}

	@When("^user enter education information on tutor wizard$")
	public void enterEducationInformation(DataTable educationInformation) {
		List<Map<String, String>> data = educationInformation.asMaps(String.class, String.class);
		String country = data.get(0).get("Country");
		String institution = data.get(0).get("Institution");
		String city = data.get(0).get("City");
		String startyear = data.get(0).get("Start year");
		String Endyear = data.get(0).get("End year");
		if (!country.equals("null")) {
			TutorWizardPageEducation.AddEditEducationModal.selectCountry(country);
		}
		if (!institution.equals("null")) {
			TutorWizardPageEducation.AddEditEducationModal.enterInstitution(institution);
		}
		if (!city.equals("null")) {
			TutorWizardPageEducation.AddEditEducationModal.enterCity(city);
		}
		if (!startyear.equals("null")) {
			TutorWizardPageEducation.AddEditEducationModal.selectStartYear(startyear);
		}
		if (!Endyear.equals("null")) {
			TutorWizardPageEducation.AddEditEducationModal.selectEndYear(Endyear);
		}
	}

	@When("^user add education level on tutor wizard$")
	public void enterAddEducationLevel(DataTable educationLevelInformation) {
		List<Map<String, String>> data = educationLevelInformation.asMaps(String.class, String.class);
		String coursetitle = data.get(0).get("Course title");
		String academicLevel = data.get(0).get("Academic Level");
		String grade = data.get(0).get("Grade");
		TutorWizardPageEducation.AddEditEducationModal.clickAddCourse();
		if (!coursetitle.equals("null")) {
			DriverHandler.delay(1);
			TutorWizardPageEducation.AddEditEducationModal.CourseModal.selectCourseTitle(coursetitle);
		}
		if (!academicLevel.equals("null")) {
			TutorWizardPageEducation.AddEditEducationModal.CourseModal.enterAcademicLevel(academicLevel);
		}
		if (!grade.equals("null")) {
			TutorWizardPageEducation.AddEditEducationModal.CourseModal.enterGrade(grade);
		}
		TutorWizardPageEducation.AddEditEducationModal.CourseModal.clickAddCourse();
		DriverHandler.delay(1);
	}

	@When("^user saving the education information on tutor wizard$")
	public void savingEducationInformation() {
		TutorWizardPageEducation.AddEditEducationModal.clickSave();
	}

	private static String sampleFile = System.getProperty("user.dir").replace("\\", "/") + "/src/main/resources/Data/"
			+ DriverHandler.environment + "/Sample1.jpg";

	@When("^user add evidence file on tutor wizard$")
	public void userAddEvidenceFile() {
		TutorWizardPageEducation.AddEditEducationModal.clickEvidenceTab();
		TutorWizardPageEducation.AddEditEducationModal.uploadEvidence(sampleFile);
	}

	@Then("^\"(.*)\" evidence is added on tutor wizard$")
	public void verifyEvidenceIsAdded(String file) {
		TutorWizardPageEducation.AddEditEducationModal.verifyEvidenceNameIsDisplayed(file);
	}

	@When("^user enter \"(.*)\" category evidence on tutor wizard$")
	public void enterCategoryEvidence(String category) {
		TutorWizardPageEducation.AddEditEducationModal.enterEvidenceCategory(category);
	}

	@When("^user next to research$")
	public void userNextToresearch() {
		TutorWizardPageEducation.clickNext();
	}

	@Then("^\"(.*)\" interest modal is displayed on tutor wizard$")
	public void verifyResearchModalTitleIsDisplayed(String title) {
		TutorWizardPageResearchInterest.ResearchInterestModal.verifyModalTitle(title);
	}

	@When("^user add research interest on tutor wizard$")
	public void addResearchInterest() {
		TutorWizardPageResearchInterest.clickAddResearchInterest();
		DriverHandler.delay(3);
	}

	@When("^user enter research interest information on tutor wizard$")
	public void enterResearchInterest(DataTable researchInterestInformation) {
		List<Map<String, String>> data = researchInterestInformation.asMaps(String.class, String.class);
		String title = data.get(0).get("Title");
		String knowledge = data.get(0).get("Knowledge Base");
		String description = data.get(0).get("Description");
		if (!title.equals("null")) {
			TutorWizardPageResearchInterest.ResearchInterestModal.enterTitle(title);
		}
		if (!description.equals("null")) {
			TutorWizardPageResearchInterest.ResearchInterestModal.enterDescription(description);
		}
		if (!knowledge.equals("null")) {
			TutorWizardPageResearchInterest.ResearchInterestModal.enterAndSelectKnowledgeBase(knowledge);
		}
	}

	@Then("^adding research interest \"(.*)\" is successful on tutor wizard$")
	public void verifyResearchInterstIsAdded(String title) {
		TutorWizardPageResearchInterest.verifyResearchInterestIsDisplayed(title);
	}

	@When("^user add research methodology on tutor wizard$")
	public void addResearchMethodology() {
		TutorWizardPageResearchInterest.clickAddMethodology();
		DriverHandler.delay(8);
	}

	@Then("^\"(.*)\" Methodology modal is displayed on tutor wizard$")
	public void verifyMethodologyModalIsDisplayed(String title) {
		TutorWizardPageResearchInterest.MethodologyModal.verifyModalTitle(title + " Methodology");
	}

	@When("^user enter research methodology information on tutor wizard$")
	public void enterResearchMethodologyInformation(DataTable methodologyInformation) {
		List<Map<String, String>> data = methodologyInformation.asMaps(String.class, String.class);
		String title = data.get(0).get("Title");
		String ResearchMethod = data.get(0).get("Research method");
		String description = data.get(0).get("Description");
		if (!title.equals("null")) {
			TutorWizardPageResearchInterest.MethodologyModal.enterTitle(title);
		}
		if (!description.equals("null")) {
			TutorWizardPageResearchInterest.MethodologyModal.enterDescription(description);
		}
		if (!ResearchMethod.equals("null")) {
			TutorWizardPageResearchInterest.MethodologyModal.clickAddMethod();
			TutorWizardPageResearchInterest.MethodologyModal.ResearchMethodModal.enterTreeFilter(ResearchMethod);
			TutorWizardPageResearchInterest.MethodologyModal.ResearchMethodModal.clickTreeItem(ResearchMethod);
			TutorWizardPageResearchInterest.MethodologyModal.ResearchMethodModal.verifyItemIsAdded(ResearchMethod);
			TutorWizardPageResearchInterest.MethodologyModal.ResearchMethodModal.clickAdd();
		}
	}

	@When("^user saving research methodology information on tutor wizard$")
	public void savingResearchMethodologyInformation() {
		TutorWizardPageResearchInterest.MethodologyModal.clickSave();
	}

	@Then("^adding methodology \"(.*)\" is successful on tutor wizard$")
	public void verifyMethodologyIsAdded(String title) {
		TutorWizardPageResearchInterest.verifyMethodologyIsDisplayed(title);
	}

	@When("^user add publication on tutor wizard$")
	public void addPublication() {
		TutorWizardPageResearchInterest.clickAddPublication();
		DriverHandler.delay(2);
	}

	@Then("^\"(.*)\" publication modal is displayed on tutor wizard$")
	public void verifyPublicationModalIsDisplayed(String title) {
		TutorWizardPageResearchInterest.PublicationModal.verifyModalTitleIsDisplayed(title);
	}

	@When("^user enter publication information on tutor wizard$")
	public void enterPublicationInformation(DataTable publicationInformation) {
		List<Map<String, String>> data = publicationInformation.asMaps(String.class, String.class);
		String title = data.get(0).get("Title");
		String publicationType = data.get(0).get("Publication Type");
		String publisher = data.get(0).get("Publisher");
		String date = data.get(0).get("Date");
		String tag = data.get(0).get("Tag");
		String abstarct = data.get(0).get("Abstarct");
		if (!title.equals("null")) {
			TutorWizardPageResearchInterest.PublicationModal.enterTitle(title);
		}
		if (!publicationType.equals("null")) {
			TutorWizardPageResearchInterest.PublicationModal.selectPublicationType(publicationType);
		}
		if (!publisher.equals("null")) {
			TutorWizardPageResearchInterest.PublicationModal
					.enterPublisher(publisher.replace("XXX", DriverHandler.timestamp));
		}
		if (!date.equals("null")) {
			TutorWizardPageResearchInterest.PublicationModal.enterPublicationDate(date);
		}
		if (!abstarct.equals("null")) {
			TutorWizardPageResearchInterest.PublicationModal.enterAbstract(abstarct);
		}
		if (!tag.equals("null")) {
			TutorWizardPageResearchInterest.PublicationModal.enterAndSelectTag(tag);
		}
	}

	@When("^user saving publication information on tutor wizard$")
	public void savePublicationInformation() {
		TutorWizardPageResearchInterest.PublicationModal.clickSave();
		DriverHandler.delay(5);
	}

	@Then("^adding publication \"(.*)\" is successful on tutor wizard$")
	public void verifyPublicationIsAdded(String title) {
		TutorWizardPageResearchInterest.verifyPublicationIsDisplayed(title);
	}

	@When("^user skip to enter research information$")
	public void skipResearchInformation() {
		TutorWizardPageResearchInterest.clickSkip();
		DriverHandler.delay(4);
	}

	@When("^user add language spoken on tutor wizard$")
	public void addLanguageSpoken() {
		TutorWizardPageLanguage.clickEdit();
		DriverHandler.delay(4);
	}

	@When("^select \"(.*)\" english proficiency on tutor wizard$")
	public void selectEnglishProficiency(String englishLevel) {
		TutorWizardPageLanguage.LanguageModal.selectEnglishProficiency(englishLevel);
	}

	@When("^user add other language on tutor wizard$")
	public void enterOtherLanguage(DataTable otherLanguage) {
		List<Map<String, String>> data = otherLanguage.asMaps(String.class, String.class);
		String language = data.get(0).get("Language");
		String proficiency = data.get(0).get("Proficiency");
		TutorWizardPageLanguage.LanguageModal.clickAddLanguage();
		DriverHandler.delay(1);
		if (!proficiency.equals("null")) {
			TutorWizardPageLanguage.LanguageModal.AddLanguageModal.selectLanguage(language);
		}
		if (!proficiency.equals("null")) {
			TutorWizardPageLanguage.LanguageModal.AddLanguageModal.selectProficiency(proficiency);
		}
		TutorWizardPageLanguage.LanguageModal.AddLanguageModal.clickAdd();
	}

	@When("^user saving spoken language information on tutor wizard$")
	public void saveSpokenLanguageInformation() {
		TutorWizardPageLanguage.LanguageModal.clickSave();
		DriverHandler.delay(5);
	}

	@Then("^\"(.*)\" \"(.*)\" language is added$")
	public void verifyAddedLanguage(String proficiency, String language) {
		TutorWizardPageLanguage.verifyLanguageAndProficiencyAreDisplayed(language, proficiency);
	}

	@When("^user next to services offered$")
	public void nextToServicesOffered() {
		TutorWizardPageLanguage.clickNext();
		DriverHandler.delay(3);
	}

	@When("^user adds support service on tutor wizard$")
	public void addservice() {
		TutorWizardPageServicesOffered.clickAddService();
	}

	@When("^user enters services information on tutor wizard$")
	public void enterSerivesInformation(DataTable otherLanguage) {
		List<Map<String, String>> data = otherLanguage.asMaps(String.class, String.class);
		String category = data.get(0).get("Category");
		String service = data.get(0).get("Service");
		String level = data.get(0).get("Level");
		String expertiselevel = data.get(0).get("Expertise level");
		String subject = data.get(0).get("Subject");
		String subjectDetails = data.get(0).get("Subject Details");
		String description = data.get(0).get("Description");
		if (!category.equals("null")) {
			TutorWizardPageServicesOffered.AddEditServicesModal.selectCategory(category);
		}
		if (!service.equals("null")) {
			TutorWizardPageServicesOffered.AddEditServicesModal.selectService(service);
		}
		if (!level.equals("null")) {
			TutorWizardPageServicesOffered.AddEditServicesModal.selectLevel(level);
		}
		if (!expertiselevel.equals("null")) {
			TutorWizardPageServicesOffered.AddEditServicesModal.selectExpertiseLeve(expertiselevel);
		}
		if (!subjectDetails.equals("null")) {
			TutorWizardPageServicesOffered.AddEditServicesModal.enterSubject(subjectDetails);
		}
		if (!description.equals("null")) {
			TutorWizardPageServicesOffered.AddEditServicesModal.enterDescription(description);
		}
	}

	@When("^user saving support services information on tutor wizard$")
	public void savingSerivcesInformation() {
		TutorWizardPageServicesOffered.AddEditServicesModal.clickSave();
	}

	@When("^user delete research interest \"(.*)\" on tutor wizard$")
	public void deleteResearchInterest(String title) {
		TutorWizardPageResearchInterest.clickRemoveResearchInterest(title);
	}

	@Then("^confirmation is displayed on tutor wizard$")
	public void verifyConfirmationModalIsDisplayed() {
		TutorWizardCommonObject.ConfirmationModal.verifyConfirmationModalIsDisplayed();
	}
	
	@When("^the user confirms to remove a research interest on tutor wizard$")
	public void confirmsToRemoveResearchInterest() {
		TutorWizardCommonObject.ConfirmationModal.clickYes();
		DriverHandler.delay(4);
	}
	
	@Then("^removing \"(.*)\" research interest is successful on tutor wizard$")
	public void verifyRemovingResearchInterestIsSucessful(String title) {
		TutorWizardPageResearchInterest.verifyResearchInterestIsNotDisplayed(title);
	}
	
	@When("^user delete \"(.*)\" research methodology on tutor wizard$")
	public void removeResearchMethodology(String title) {
		TutorWizardPageResearchInterest.clickRemoveMethodology(title);
	}
	
	@When("^the user confirms to remove a research methodology on tutor wizard$")
	public void confirmToRemoveResearchMethodology() {
		TutorWizardPageResearchInterest.confirmationModal.clickYes();
	}
	
	@Then("^removing \"(.*)\" research methodology is successful on tutor wizard$")
	public void verifyRemovingResearhMethodologyIsSuccessful(String title) {
		TutorWizardPageResearchInterest.verifyMethodologyIsNotDisplayed(title);
	}
	
	@When("^user delete publication \"(.*)\" on tutor wizard$")
	public void deletePublication(String title) {
		TutorWizardPageResearchInterest.clickRemovePublication(title);
	}
	
	@When("^the user confirms to remove a publication on tutor wizard$")
	public void confirmToRemovePublication() {
		TutorWizardPageResearchInterest.confirmationModal.clickYes();
		DriverHandler.delay(6);
	}
	
	@Then("^removing \"(.*)\" publication is successful on tutor wizard$")
	public void verifyPublicationIsNotDisplayed(String title) {
		TutorWizardPageResearchInterest.verifyPublicationIsNotDisplayed(title);
	}
}
