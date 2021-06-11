package co.uk.pageobjects.student;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.Tab;
import co.uk.webelements.TextBox;

public class UserProfilePageEducation {

	private static Tab educationTabIsActive = new Tab("Education",By.xpath("//a[@class='nav-link active' and contains(text(),'Education')]"));
	private static Button addEducationBtn = new Button("Add education",By.xpath("//app-educations//a[contains(text(),'Add')]"));
	
	public static class confirmationModal{
		private static Element message(String message) {
			return new Element(message,By.xpath("//h2[@class='swal2-title' and text()='"+message+"']"));
		}
		private static Button yesBtn = new Button("Yes",By.xpath("//div[@class='swal2-actions']/button[text()='Yes']"));
		private static Button cancelBtn = new Button("Cancel",By.xpath("//div[@class='swal2-actions']/button[text()='Yes']"));
		
	}
	
	public static class AddEditEducationModal{
		
		private static Element addEducation = new Element("Add education modal",By.xpath("//app-create-edit-education//h4[contains(text(),'Add Education')]"));
		private static Element editEducation = new Element("Edit education modal",By.xpath("//app-create-edit-education//h4[contains(text(),'Edit Education')]"));
		private static Element countryDropdown = new Element("Country dropdown",By.xpath("//span[@id='select2-CountryCode-container']"));
		private static Element selectCounrty(String country) {
			return new Element(country,By.xpath("//ul[@id='select2-CountryCode-results']/li[text()='"+country+"']"));
		}
		private static TextBox institution = new TextBox("Institution",By.xpath("//input[@id='UniversityName']"));
		private static Element dropDownInststitutionForUK = new Element("Institution Dropdwown",By.xpath("//typeahead-container[contains(@class,'dropdown')]"));
		private static TextBox city = new TextBox("City",By.xpath("//input[@id='City']"));
		private static Element startyear(String year) {
			return new Element("Start year: "+year,By.xpath("//ul[@id='select2-StartYear-results']//li[text()='"+year+"']"));
		}
		private static Element verifyStartYear(String year) {
			return new Element("Start year: "+year,By.xpath("//span[@id='select2-StartYear-container' and text()='"+year+"']"));
		}
		private static Element endyear(String year) {
			return new Element("End year: "+year,By.xpath("//ul[@id='select2-EndYear-results']//li[text()='"+year+"']"));
		}
		private static Element verifyEndYear(String year) {
			return new Element("End year: "+year,By.xpath("//span[@id='select2-EndYear-container' and text()='"+year+"']"));
		}
		private static Button addCourseBtn = new Button("Add Course",By.xpath("//app-education-levels//a[contains(text(),'Add')]"));
		private static Tab evidenceTab = new Tab("Evidence tab",By.xpath("//a[@id='evidences-tab']"));
		private static Button saveBtn = new Button("Save",By.xpath("//app-create-edit-education//button[@type='submit']"));
		
		public static void clickAddEducation() {
			addEducation.click();
		}
		
		public static void clickEditEducation() {
			editEducation.click();
		}
		
		public static void selectCountry(String country) {
			countryDropdown.click();
			selectCounrty(country).click();
		}
		
		public static void enterInstitution(String institutionName) {
			institution.setText(institutionName);
		}
		
		public static void enterCity(String cityName) {
			city.setText(cityName);
		}
		
		private static class CourseModal {
			
			private static Element header(String header) {
				return new Element(header+" Modal",By.xpath("//abp-modal-header//h4[contains(text(),'"+header+"')]"));
			}
			private static Element coursetitleDropdown = new Element("Course title dropdown",By.xpath("//span[@id='select2-EducationLevel-container']"));
			private static Element selectCoursetitleDropdown(String title) {
				return new Element(title,By.xpath("//ul[@id='select2-EducationLevel-results']//li[contains(text(),'"+title+"')]"));
			}
			private static TextBox academicLevelTextBox = new TextBox("Academic level",By.xpath("//input[@id='Degree']"));
			private static TextBox gradeTextbox = new TextBox("Grade",By.xpath("//input[@id='Grade']"));
			private static Button addBtn = new Button("Add",By.xpath("//app-create-edit-education-level//button[@type='submit']"));
			private static Button editCourseBtn = new Button("Edit course",By.xpath("//app-education-levels//span[contains(@class,'edit')]//parent::button"));
			private static Button removeCourseBtn = new Button("Remove course",By.xpath("//app-education-levels//span[contains(@class,'trash')]//parent::button"));
			private static TextBox documentUploader = new TextBox("Upload evidence",By.xpath("//input[@id='DocumentUploader']"));
			
			public static void uploadEvidence(String file) {
				documentUploader.setText(file);
			}
			
			public static void verifyHeader(String headerTitle) {
				header(headerTitle).verifyDisplayed();
			}
			
			public static void selectCourseTitle(String course) {
				coursetitleDropdown.click();
				selectCoursetitleDropdown(course).click();
			}
			
			public static void enterAcademicLevel(String academicLevel) {
				academicLevelTextBox.setText(academicLevel);
			}
			
			public static void enterGrade(String grade) {
				gradeTextbox.setText(grade);
			}
			
			public static void clickAddCourse() {
				addBtn.click();
			}
			
			public static void clickEditCourse() {
				editCourseBtn.click();
			}
			
			public static void clickRemoveCourse() {
				removeCourseBtn.click();
			}
		}
	}
}
