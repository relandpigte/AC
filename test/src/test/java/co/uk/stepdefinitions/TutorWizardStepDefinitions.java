package co.uk.stepdefinitions;

import java.util.List;
import java.util.Map;

import co.uk.core.DriverHandler;
import co.uk.pageobjects.RegisterPage;
import co.uk.pageobjects.TutorWizardCommonObject;
import co.uk.pageobjects.TutorWizardPageAboutYou;
import co.uk.pageobjects.TutorWizardPageEducation;
import co.uk.pageobjects.TutorWizardPageLanguage;
import co.uk.pageobjects.TutorWizardPageProfilePicture;
import co.uk.pageobjects.TutorWizardPageResearchInterest;
import co.uk.pageobjects.TutorWizardPageServicesOffered;
import co.uk.pageobjects.UserProfilePageCommonObjects;
import co.uk.pageobjects.UserProfilePageEducation;
import co.uk.pageobjects.UserProfilePageResearch;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class TutorWizardStepDefinitions {
	
	private static String sampleFile = System.getProperty("user.dir").replace("\\", "/") + "/src/main/resources/Data/"
			+ DriverHandler.environment + "/Sample1.jpg";
	
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

	@When("^user edit language spoken on tutor wizard$")
	public void editLanguageSpoken() {
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
			TutorWizardPageLanguage.LanguageModal.AddEditLanguageModal.selectLanguage(language);
		}
		if (!proficiency.equals("null")) {
			TutorWizardPageLanguage.LanguageModal.AddEditLanguageModal.selectProficiency(proficiency);
		}
		TutorWizardPageLanguage.LanguageModal.AddEditLanguageModal.clickAdd();
	}

	@When("^user saving spoken language information on tutor wizard$")
	public void saveSpokenLanguageInformation() {
		TutorWizardPageLanguage.LanguageModal.clickSave();
		DriverHandler.delay(5);
	}

	@Then("^\"(.*)\" \"(.*)\" language is added on tutor wizard$")
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
		String studyArea = data.get(0).get("Study area");
		String studyfield = data.get(0).get("Study field");
		DriverHandler.delay(1);
		if (!category.equals("null")) {
			TutorWizardPageServicesOffered.AddEditServicesModal.selectCategory(category);
			DriverHandler.delay(1);
		}
		if (!service.equals("null")) {
			TutorWizardPageServicesOffered.AddEditServicesModal.selectService(service);
			DriverHandler.delay(1);
		}
		if (!level.equals("null")) {
			TutorWizardPageServicesOffered.AddEditServicesModal.selectLevel(level);
			DriverHandler.delay(1);
		}
		if (!expertiselevel.equals("null")) {
			TutorWizardPageServicesOffered.AddEditServicesModal.selectExpertiseLeve(expertiselevel);
			DriverHandler.delay(1);
		}
		
		if (!subject.equals("null")) {
			TutorWizardPageServicesOffered.AddEditServicesModal.enterSubject(subject);
			DriverHandler.delay(1);
		}
		
		if (!description.equals("null")) {;
			TutorWizardPageServicesOffered.AddEditServicesModal.enterDescription(description);
			DriverHandler.delay(1);
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
	
	@When("^user edit \"(.*)\" research methodology on tutor wizard$")
	public void editResearchMethodology(String title) {
		TutorWizardPageResearchInterest.clickEditMethodology(title);
	}
	
	@Then("^verify research methodology informations are correct on tutor wizard$")
	public void verifyResearchMethodologyInformation(DataTable methodologyInformation) {
        List<Map<String, String>> data = methodologyInformation.asMaps(String.class, String.class);
        String title1 = data.get(0).get("Title");
        String ResearchMethod1 = data.get(0).get("Research method");
        String ResearchMethod2 = data.get(1).get("Research method");
        String description = data.get(0).get("Description");
        if(!title1.equals("null")) {
        	TutorWizardPageResearchInterest.MethodologyModal.verifyTitleValueIsCorrect(title1);
        }
        if(!description.equals("null")) {
        	TutorWizardPageResearchInterest.MethodologyModal.verifyDescriptionValueIsCorrect(description);
        }
        if(!ResearchMethod1.equals("null")) {
        	TutorWizardPageResearchInterest.MethodologyModal.verifyResearchMethodAlertIsDisplayed(ResearchMethod1);
        }
        if(!ResearchMethod2.equals("null")) {
        	TutorWizardPageResearchInterest.MethodologyModal.verifyResearchMethodAlertIsDisplayed(ResearchMethod2);
        }
	}
	
	@When("^user edit publication \"(.*)\" on tutor wizard$")
	public void editPublication(String title) {
		TutorWizardPageResearchInterest.clickEditPublication(title);
	}
	
	@Then("^verify publication informations are correct on tutor wizard$")
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
        	TutorWizardPageResearchInterest.PublicationModal.verifyTitleValueIsCorrect(title);
        }
        if(!publicationType.equals("null")) {
        	TutorWizardPageResearchInterest.PublicationModal.verifyPublicationTypeValueIsCorrect(publicationType);
        }
        if(!publisher.equals("null")) {
        	TutorWizardPageResearchInterest.PublicationModal.verifyPublisherValueIsCorrect(publisher.replace("XXX", DriverHandler.timestamp));
        }
        if(!date.equals("null")) {
        	TutorWizardPageResearchInterest.PublicationModal.verifypublicationDateValueIsCorrect(date);
        }
        if(!abstarct.equals("null")) {
        	TutorWizardPageResearchInterest.PublicationModal.verifyAbstractValueIsCorrect(abstarct);
        }
        if(!tag.equals("null")) {
        	TutorWizardPageResearchInterest.PublicationModal.verifyTagIsDisplayed(tag);
        }
	}
	
	@When("^user edit research interest \"(.*)\" on tutor wizard$")
	public void editResearchInterest(String title) {
		TutorWizardPageResearchInterest.clickEditResearchInterest(title);
	}
	
	@When("^user saving research interest information on tutor wizard$")
	public static void saveResearchInterestInformation() {
		TutorWizardPageResearchInterest.ResearchInterestModal.clickSave();
	}
	
	@Then("^verify research interest informations are correct on tutor wizard$")
	public void verifyResearchInterestInformation(DataTable researchInterestInformation) {
        List<Map<String, String>> data = researchInterestInformation.asMaps(String.class, String.class);
        String title = data.get(0).get("Title");
        String knowledge = data.get(0).get("Knowledge Base");
        String description = data.get(0).get("Description");
        if(!title.equals("null")) {
        	TutorWizardPageResearchInterest.ResearchInterestModal.verifyTitleValueIsCorrect(title);
        }
        if(!description.equals("null")) {	 
        	TutorWizardPageResearchInterest.ResearchInterestModal.veriftyDescriptionValueIsCorrect(description);
        }
        if(!knowledge.equals("null")) {	 
        	TutorWizardPageResearchInterest.ResearchInterestModal.verifyKnowledgeBaseIsDisplayed(knowledge);
        }
	}
	
	@When("^user edit \"(.*)\" language on tutor wizard$")
	public void editOtherLanguage(String language) {
		TutorWizardPageLanguage.LanguageModal.clickEditOtherLanguage(language);
	}
	
	@When("^user edit other language on tutor wizard$")
	public void editOtherLanguage(DataTable otherLanguage) {
		List<Map<String, String>> data = otherLanguage.asMaps(String.class, String.class);
		String language = data.get(0).get("Language");
		String proficiency = data.get(0).get("Proficiency");
		DriverHandler.delay(1);
		if (!proficiency.equals("null")) {
			TutorWizardPageLanguage.LanguageModal.AddEditLanguageModal.selectLanguage(language);
		}
		if (!proficiency.equals("null")) {
			TutorWizardPageLanguage.LanguageModal.AddEditLanguageModal.selectProficiency(proficiency);
		}
		TutorWizardPageLanguage.LanguageModal.AddEditLanguageModal.clickUpdate();
	}
	
	@When("^user removes \"(.*)\" language on tutor wizard$")
	public void removeLanguage(String language) {
		TutorWizardPageLanguage.LanguageModal.removeEditOtherLanguage(language);
	}
	
	@Then("^removing \"(.*)\" \"(.*)\" language is successful on tutor wizard$")
	public void verifyLanguageIsRemoved(String proficient, String language) {
		TutorWizardPageLanguage.verifyLanguageIsNotDisplayed(language, proficient);
	}
	
	@When("^user next to profile picture$")
	public void nextToProfilePicture() {
		DriverHandler.delay(3);
		TutorWizardPageLanguage.clickNext();
	}
	
	@When("^user uploads a profile photo on tutor wizard$")
	public void uploadProfilePhoto() {
		TutorWizardPageProfilePicture.uploadProfilePhoto(sampleFile);
	}
	
	@Then("^crop image modal is displayed on tutor wizard$")
	public void verifyCropImageModalIsDisplayed() {
		TutorWizardPageProfilePicture.CropImageModal.verifyCropImageModalIsDisplayed();
	}
	
    @When("^user crop the image on tutor wizard$")
    public void cropImage() {
    	TutorWizardPageProfilePicture.CropImageModal.clickCrop();
    	DriverHandler.delay(5);
    }
    
    @Then("^upload a profile photo is successful$")
    public void verifyUploadProfilePhotoIsSuccessful() {
    	TutorWizardPageProfilePicture.verifyAnonyomousPhotoIsNotDisplayed();
    }
}
