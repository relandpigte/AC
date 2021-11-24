package co.uk.stepdefinitions;

import java.util.List;
import java.util.Map;

import co.uk.core.DriverHandler;
import co.uk.pageobjects.TutorCoursePageCommonObjects;
import co.uk.pageobjects.TutorCoursePageCurriculumTab;
import co.uk.pageobjects.TutorCoursePageDetailsTab;
import co.uk.pageobjects.TutorCoursePageSettingsTab;
import co.uk.pageobjects.TutorWizardCommonObject;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class TutorCoursePageStepDefinition {

    private static String samplePhoto = System.getProperty("user.dir").replace("\\", "/") + "/src/main/resources/Data/"
            + DriverHandler.environment + "/Sample1.jpg";
    
	@Then("^user is in the course details$")
	public void verifyCourseDetailTabIsActive() {
		TutorCoursePageDetailsTab.verifyDetailTabIsActive();
	}
	
	@When("^user proceed to the course settings tab$")
	public void clickCourseSettingsTab() {
		TutorCoursePageCommonObjects.clickSettingsTab();
		DriverHandler.delay(1);
	}
	
	@When("^user proceed to the curriculum tab$")
	public void clickCurriculumTab() {
		TutorCoursePageCommonObjects.clickCurriculumTab();
	}

	@When("^user add course details$")
	public void addCoursseDetails(DataTable userDetails) {
		List<Map<String, String>> data = userDetails.asMaps(String.class, String.class);
		String name = data.get(0).get("Name");
		String subtitle = data.get(0).get("Subtitle");
		String description = data.get(0).get("Description");
		String categories = data.get(0).get("Categories");
		String courseImage = data.get(0).get("Course image");
		String pricing = data.get(0).get("Pricing");
		String currency = data.get(0).get("Currency");
		String language = data.get(0).get("Language");
		if (!name.equals("null")) {
			TutorCoursePageDetailsTab.enterName(name.replace("XXX", DriverHandler.timestamp));
		}

		if (!subtitle.equals("null")) {
			TutorCoursePageDetailsTab.enterSubtitle(subtitle);
		}

		if (description.equals("Lorem ipsum")) {
			TutorCoursePageDetailsTab.enterDescription(
					"\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"");
		}

		if (!description.equals("Lorem ipsum") && !description.equals("null")) {
			TutorCoursePageDetailsTab.enterDescription(description);
		}
		
		if (!categories.equals("null")) {
			TutorCoursePageDetailsTab.enterCategories(categories);
		}
		
		if (!courseImage.equals("null")) {
			TutorCoursePageDetailsTab.uploadAnImage(samplePhoto);
			DriverHandler.delay(1);
			TutorCoursePageDetailsTab.CropImageModal.clickCrop();
		}
		
		if (pricing.equals("Free")) {
			TutorCoursePageDetailsTab.clickFree();
		}
		
		if (!pricing.equals("null") && !pricing.equals("Free")) {
			TutorCoursePageDetailsTab.enterPricing(pricing);
		}		
		if (!currency.equals("null")){
			TutorCoursePageDetailsTab.selectCurrency(currency);
		}	
		
		if (!language.equals("null")){
			TutorCoursePageDetailsTab.selectLanguage(language);
		}	
	}

	@When("^user save the course details$")
	public void saveCourseDetails() {
		TutorCoursePageDetailsTab.clickSave();
	}

	@Then("^the course details are correct$")
	public void verifyCourseDetailsAreCorrect(DataTable userDetails) {
		List<Map<String, String>> data = userDetails.asMaps(String.class, String.class);
		String name = data.get(0).get("Name");
		String subtitle = data.get(0).get("Subtitle");
		String description = data.get(0).get("Description");
		String category = data.get(0).get("Categories");
		String courseImage = data.get(0).get("Course image");
		String pricing = data.get(0).get("Pricing");
		String currency = data.get(0).get("Currency");
		String language = data.get(0).get("Language");
		DriverHandler.delay(2);
		if (!name.equals("null")) {
			TutorCoursePageDetailsTab.verifyNameIsCorrect(name.replace("XXX", DriverHandler.timestamp));
		}

		if (!subtitle.equals("null")) {
			TutorCoursePageDetailsTab.verifySubtitleIsCorrect(subtitle);
		}

		if (description.equals("Lorem ipsum")) {
			TutorCoursePageDetailsTab.verifyDescriptionIsCorrect(
					"\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"");
		}

		if (!description.equals("Lorem ipsum") && !description.equals("null")) {
			TutorCoursePageDetailsTab.verifyDescriptionIsCorrect(description);
		}
		
		if (!category.equals("null")) {

		}
		
		if (!courseImage.equals("null")) {
			TutorCoursePageDetailsTab.verifyImageFileNameIsDisplayed(courseImage);
		}
		
		if (!pricing.equals("null")) {
			
		}
		
		if (!currency.equals("null")) {
			
		}
		
		if (!language.equals("null")) {
			TutorCoursePageDetailsTab.verifySelectedLanguageIsDisplayed(language);
		}
		
	}
	
	@Then("^category field is displayed$")
	public static void verifyCategoryTextBoxIsDisplayed() {
		TutorCoursePageDetailsTab.verifyCategoriesTextboxIsDisplayed();
	}
	
	@When("^user selects course configuration to Standard$")
	public static void selectCourseConfigurationToStandard() {
		TutorCoursePageSettingsTab.clickStandartType();
	}
	
	@When("^user save the course settings$")
	public static void saveCourseSettings() {
		TutorCoursePageSettingsTab.clickCreate();
	}
	
	@Then("^course progress section is displayed$")
	public static void verifyCourseProgressSectionIsDisplayed() {
		TutorCoursePageSettingsTab.verifyCourseProgressSectionIsDisplayed();
	}
	
	@Then("^comment section is displayed$")
	public static void verifyCommentSectionIsDisplayed() {
		TutorCoursePageSettingsTab.verifyCommentSectionIsDisplayed();
	}
	
	@Then("^user is in curriculum tab$")
	public static void verifyCurriculumTabIsActive() {
		TutorCoursePageCurriculumTab.verifyCurriculumTabIsActive();
	}
	
	@Then("^custom url section is displayed$")
	public static void verifyCustomURLSectionIsDisplayed() {
		TutorCoursePageSettingsTab.verifyCustomCourseURLsectionIsDisplayed();
	}
	
	@Then("^autoplay section is displayed$")
	public static void verifyAutoplaySectionIsDisplayed() {
		TutorCoursePageSettingsTab.verifyAutoplaySectionIsDisplayed();
	}
	
	@Then("^course visibility section is displayed$")
	public static void verifyCOurseVisibilitySectionIsDisplayed() {
		TutorCoursePageSettingsTab.verifyCourseVisibilitySectionIsDisplayed();
	}
	
	@When("^user create a first module$")
	public static void createFirstModule() {
		TutorCoursePageCurriculumTab.clickAddModule();
		TutorCoursePageCurriculumTab.ModuleModal.enterModuleName("Module 1");
		TutorCoursePageCurriculumTab.ModuleModal.clickSave();
	}
	
	@When("^user create a first lesson$")
	public static void createFirstLesson() {
		TutorCoursePageCurriculumTab.clickAddLesson();
		TutorCoursePageCurriculumTab.LessonModal.clickTemplate("Blank");
		TutorCoursePageCurriculumTab.LessonModal.clickNext();
		TutorCoursePageCurriculumTab.LessonModal.enterLessonName("Lesson 1");
		TutorCoursePageCurriculumTab.LessonModal.clickSave();
	}
	
	@Then("^module name \"(.*)\" is displayed in curriculum tab$")
	public void verifyModuleIsDisplayed(String name) {
		DriverHandler.delay(8);
		TutorCoursePageCurriculumTab.verifyCurriculumItemIsDisplayed("Module", name);
	}
	
	@Then("^lesson name \"(.*)\" is displayed in curriculum tab$")
	public void verifyLessonIsDisplayed(String name) {
		DriverHandler.delay(8);
		TutorCoursePageCurriculumTab.verifyCurriculumItemIsDisplayed("Lesson", name);
	}
	
	@When("^user create a new module \"(.*)\"$")
	public void createNewModule(String name) {
		TutorCoursePageCurriculumTab.clickAddnewModule();
		TutorCoursePageCurriculumTab.ModuleModal.enterModuleName(name);
		TutorCoursePageCurriculumTab.ModuleModal.clickSave();
	}
	
	@When("^user create a new lesson \"(.*)\" within \"(.*)\"$")
	public void createNewLessonWithinModule(String lessonName,String moduleName) {
		TutorCoursePageCurriculumTab.clickAddnewLessonWithinModule(moduleName);
		TutorCoursePageCurriculumTab.LessonModal.clickTemplate("Blank");
		TutorCoursePageCurriculumTab.LessonModal.clickNext();
		TutorCoursePageCurriculumTab.LessonModal.enterLessonName(lessonName);
		TutorCoursePageCurriculumTab.LessonModal.clickSave();
	}
	
	@Then("^created lesson \"(.*)\" within \"(.*)\" is displayed$")
	public void verifyLessonIsDisplayedWithinModule(String lessonName, String moduleName) {
		DriverHandler.delay(2);
		TutorCoursePageCurriculumTab.verifyCirriculumNestedItemIsDisplayed(moduleName, lessonName);
	}
	
	@Then("^created unit \"(.*)\" within \"(.*)\" is displayed$")
	public void verifyUnitIsDisplayedWithinModule(String unitName, String moduleName) {
		DriverHandler.delay(2);
		TutorCoursePageCurriculumTab.verifyCirriculumNestedItemIsDisplayed(moduleName, unitName);
	}
	
	@When("^user create a new unit \"(.*)\" within \"(.*)\"$")
	public void createNewUnitnWithinModule(String unitName,String moduleName) {
		TutorCoursePageCurriculumTab.clickAddNewUnitWithinModule(moduleName);
		TutorCoursePageCurriculumTab.UnitModal.enterLessonName(unitName);
		TutorCoursePageCurriculumTab.UnitModal.clickSave();
	}
	
	@When("^user create a new Lesson \"(.*)\" within \"(.*)\"$")
	public void createLessonWithinUnit(String lessonName, String unitName) {
		TutorCoursePageCurriculumTab.clickAddNewLessonWithinUnit(unitName);
		TutorCoursePageCurriculumTab.LessonModal.clickTemplate("Blank");
		TutorCoursePageCurriculumTab.LessonModal.clickNext();
		TutorCoursePageCurriculumTab.LessonModal.enterLessonName(lessonName);
		TutorCoursePageCurriculumTab.LessonModal.clickSave();
		
	}
}
