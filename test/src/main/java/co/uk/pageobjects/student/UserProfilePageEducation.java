package co.uk.pageobjects.student;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.ListBox;
import co.uk.webelements.Tab;
import co.uk.webelements.TextBox;

public class UserProfilePageEducation {

	private static Tab educationTabIsActive = new Tab("Education",By.xpath("//a[@class='nav-link active' and contains(text(),'Education')]"));
	private static Button addEducationBtn = new Button("Add education",By.xpath("//app-educations//a[contains(text(),'Add')]"));
	private static Button addOtherCourse = new Button("Add other course",By.xpath("//app-qualifications//button[contains(text(),'Add')]"));
	private static Element courseName(String course) {
		return new Element(course,By.xpath("//td[contains(text(),'"+course+"')]"));
	}
	private static Button editOtherCourse(String course) {
		return new Button(course+" edit",By.xpath("//td[contains(text(),'"+course+"')]/following-sibling::td//span[contains(@class,'edit')]/parent::button"));
	}
	private static Button removeOtherCourse(String course) {
		return new Button(course+" remove",By.xpath("//td[contains(text(),'"+course+"')]/following-sibling::td//span[contains(@class,'trash')]/parent::button"));
	}
	private static Button folderOtherCourse(String course) {
		return new Button(course+" folder",By.xpath("//td[contains(text(),'"+course+"')]/following-sibling::td//span[contains(@class,'trash')]/parent::button"));
	}

	public static void clickEditCourse(String course) {
		editOtherCourse(course).click();
	}
	public static void verifyCourseIsDisplayed(String course) {
		courseName(course).verifyDisplayed();
	}
	
	public static void verifyCourseIsNotDisplayed(String course){
		courseName(course).verifyNotDisplayed();
	}
	
	public static void clickRemoveCourse(String course) {
		removeOtherCourse(course).click();
	}
	
	public static void clickFolderCourse(String course) {
		folderOtherCourse(course).click();
	}
	
	public static void verifyEducationTabIsActive() {
		educationTabIsActive.verifyDisplayed();
	}
	
	public static void clickAddEducation() {
		addEducationBtn.click();
	}
	
	public static void clickOtherCourse() {
		addOtherCourse.click();
	}
	
	public static class confirmationModal{
		private static Element title(String message) {
			return new Element(message,By.xpath("//h2[@class='swal2-title' and text()='"+message+"']"));
		}
		private static Button yesBtn = new Button("Yes",By.xpath("//div[@class='swal2-actions']/button[text()='Yes']"));
		private static Button cancelBtn = new Button("Cancel",By.xpath("//div[@class='swal2-actions']/button[text()='Yes']"));
		
		public static void verifyMessageIsDisplayed(String message) {
			title(message).verifyDisplayed();
		}
		
		public static void clickYes() {
			yesBtn.click();	
		}
		
		public static void clickCancel() {
			cancelBtn.click();
		}
	}
	
	public static class OtherCourse{
		
		private static Element motalTitle(String title) {
			return new Element(title+" modal",By.xpath("//app-create-edit-qualification//h4[contains(text(),'"+title+"')]"));
		}
		private static TextBox professionalCertificate = new TextBox("Professional Certificate Or Award",By.xpath("//input[@id='Certificate']"));
		private static TextBox organizationTextBox = new TextBox("Conferring Organization",By.xpath("//input[@id='Organization']"));
		private static TextBox gradeTextBox = new TextBox("Grade",By.xpath("//input[@id='Grade']"));
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
		
		private static ListBox selectCountry = new ListBox("Country",By.xpath("//select[@id='country']"));
		private static TextBox cityTextBox = new TextBox("City",By.xpath("//input[@id='City']"));
		private static TextBox summaryTextBox = new TextBox("Summary",By.xpath("//div[contains(@class,'ql-editor')]/p"));
		private static TextBox documentFile = new TextBox("Document file",By.xpath("//input[@id='DocumentUploader']"));
		private static Button saveBtn = new Button("Save",By.xpath("//app-create-edit-qualification//button[@type='submit']"));
		
		public static void verifyModalIsDisplayed(String title) {
			motalTitle(title).verifyDisplayed();
		}
		
		public static void enterProfessionalCertification(String certificate) {
			professionalCertificate.setText(certificate);
		}
		
		public static void enterOrganization(String organization) {
			organizationTextBox.setText(organization);
		}
		
		public static void enterGrade(String grade) {
			gradeTextBox.setText(grade);
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
			selectCountry.selectByVisibleText(country);
		}
		
		public static void enterCity(String city) {
			cityTextBox.setText(city);
		}
		
		public static void enterSummary(String summary) {
			summaryTextBox.setText(summary);
		}
		
		public static void uploadDocument(String pathfile) {
			documentFile.uploadFile(pathfile);
		}
		
		public static void clickSave() {
			saveBtn.click();
		}
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
			return new Element(name,By.xpath("//app-document-uploader//h4[contains(text(),'Sample1.jpg')]"));
		}
		
		private static TextBox evidenceCategory = new TextBox("Evidence category",By.xpath("//app-document-uploader//input[@id='Categiry_0']"));
		
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
		
		public static class CourseModal {
			
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
