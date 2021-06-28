package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.Tab;
import co.uk.webelements.TextBox;

public class TutorWizardPageEducation {
	
	private static Button addEducationBtn = new Button("Add education",By.xpath("//app-educations//a[contains(text(),'Add')]")); 
	private static Button removeEducation = new Button("Remove education",By.xpath("//app-education//span[contains(@class,'trash')]"));
	
	public static void clickRemoveEducation() {
		removeEducation.click();
	}
	
	public static void clickAddEducation() {
		addEducationBtn.click();
	}
	
	public static class AddEditEducationModal{
		
		private static Element EducationModal(String title) {
			return new Element(title+" education modal",By.xpath("//app-create-edit-education//h4[contains(text(),'"+title+" Education')]"));
		}
		private static Element countryDropdown = new Element("Country dropdown",By.xpath("//span[@id='select2-CountryCode-container']"));
		private static Element selectCounrty(String country) {
			return new Element(country,By.xpath("//ul[@id='select2-CountryCode-results']/li[text()='"+country+"']"));
		}
		private static TextBox institution = new TextBox("Institution",By.xpath("//input[@id='UniversityName']"));
		private static Element dropDownInststitutionForUK = new Element("Institution Dropdwown",By.xpath("//typeahead-container[contains(@class,'dropdown')]"));
		private static TextBox city = new TextBox("City",By.xpath("//input[@id='City']"));
		private static Element startYearContainer = new Element("Start year container",By.xpath("//span[@id='select2-StartYear-container']"));
		private static Element startyear(String year) {
			return new Element("Start year: "+year,By.xpath("//ul[@id='select2-StartYear-results']//li[text()='"+year+"']"));
		}
		private static Element verifyStartYear(String year) {
			return new Element("Start year: "+year,By.xpath("//span[@id='select2-StartYear-container' and text()='"+year+"']"));
		}
		
		private static Element endYearContainer = new Element("End year container",By.xpath("//span[@id='select2-EndYear-container']"));
		private static Element endyear(String year) {
			return new Element("End year: "+year,By.xpath("//ul[@id='select2-EndYear-results']//li[text()='"+year+"']"));
		}
		private static Element verifyEndYear(String year) {
			return new Element("End year: "+year,By.xpath("//span[@id='select2-EndYear-container' and text()='"+year+"']"));
		}
		private static Button addCourseBtn = new Button("Add Course",By.xpath("//app-education-levels//a[contains(text(),'Add')]"));
		private static Tab evidenceTab = new Tab("Evidence tab",By.xpath("//a[@id='evidences-tab']"));
		private static Button saveBtn = new Button("Save",By.xpath("//app-create-edit-education//button[@type='submit']"));
		private static TextBox documentUploader = new TextBox("Upload evidence",By.xpath("//input[@id='DocumentUploader']"));
		private static Element evidenceName(String name) {
			return new Element(name,By.xpath("//app-document-uploader//h4[contains(text(),'"+name+"')]"));
		}
		
		private static TextBox evidenceCategory = new TextBox("Evidence category",By.xpath("//app-document-uploader//input[@id='Categiry_0']"));
		
		public static void verifyTitleModal(String title) {
			EducationModal(title).verifyDisplayed();
		}
		
		public static void enterEvidenceCategory(String categoryName) {
			evidenceCategory.setText(categoryName);
		}
		
		public static void verifyEvidenceNameIsDisplayed(String name) {
			evidenceName(name).verifyDisplayed();
		}
		
		public static void uploadEvidence(String file) {
			documentUploader.uploadFile(file);
		}
		
		public static void selectStartYear(String year) {
			startYearContainer.click();
			startyear(year).click();
		}
		
		public static void verifyStartYearIsCorrect(String year) {
			verifyStartYear(year).verifyDisplayed();
		}
		
		public static void verifyEndYearIsCorrect(String year) {
			verifyEndYear(year).verifyDisplayed();
		}
		
		public static void selectEndYear(String year) {
			endYearContainer.click();
			endyear(year).click();
		}
		
		public static void selectCountry(String country) {
			countryDropdown.click();
			selectCounrty(country).click();
		}
		
		public static void enterInstitution(String institutionName) {
			institution.setText(institutionName);
		}
		
		public static void verifyUkIntitutionDropIsDisplayed() {
			dropDownInststitutionForUK.verifyDisplayed();
		}
		
		public static void enterCity(String cityName) {
			city.setText(cityName);
		}
		
		public static void clickAddCourse() {
			addCourseBtn.click();
		}
		
		public static void clickEvidenceTab() {
			evidenceTab.click();
		}
		
		public static void clickSave() {
			saveBtn.click();
		}
	}
}
