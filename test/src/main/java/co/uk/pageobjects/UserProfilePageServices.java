package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.core.DriverHandler;
import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.ListBox;
import co.uk.webelements.TextBox;

public class UserProfilePageServices {
	
	private static Button addService = new Button("Add service",By.xpath("//app-services//Button[text()='Add Service']"));
	private static Button next = new Button("Next",By.xpath("//button[contains(text(),'Next')]"));
		
	public static void clickAddService() {
		addService.click();
	}
	
	public static void clickNext() {
		next.click();
	}
	
	public static class AddEditServicesModal{
		
		private static ListBox categoryDropdown = new ListBox("Category",By.xpath("//app-create-edit-service//Select[@id='categoryId']"));
		private static ListBox serviceDropdown = new ListBox("Service",By.xpath("//app-create-edit-service//Select[@id='serviceId']"));
		private static ListBox levelDropdown = new ListBox("Level",By.xpath("//app-create-edit-service//Select[@id='levelId']"));
		private static ListBox expertiseLevelDropdown = new ListBox("Expertise",By.xpath("//app-create-edit-service//Select[@id='expertiseLevel']"));
		private static TextBox subjectTextBox = new TextBox("Subject",By.xpath("//app-create-edit-service//input[@id='subject']"));
		private static Element subjectDropDown = new Element("Subject dropdown",By.xpath("//typeahead-container//button"));
		private static Button suggest = new Button("Suggest +",By.xpath("//app-create-edit-service//button[contains(text(),'Suggest')]"));
		
		private static TextBox titleTextBox = new TextBox("Title",By.xpath("//app-create-edit-service//input[@id='title']"));
		private static TextBox knowledgeBaseTextBox = new TextBox("Knowledge base",By.xpath("//app-create-edit-service//input[@id='DisciplineTaxonomies']"));
		private static Element knowlegeBaseDropDown = new Element("Knowledge dropdown",By.xpath("//typeahead-container//button"));
		private static TextBox descriptionTextBox = new TextBox("Description",By.xpath("//app-create-edit-service//div[contains(@class,'ql-editor')]/p"));
		private static Button save = new Button("Save",By.xpath("//app-create-edit-service//button[contains(text(),'Save')]"));
		
		public static void selectCategory(String category) {
			categoryDropdown.selectByVisibleText(category);
		}
		
		public static void selectService(String service) {
			serviceDropdown.selectByVisibleText(service);
		}
		
		public static void selectLevel(String level) {
			levelDropdown.selectByVisibleText(level);
		}
		
		public static void selectExpertiseLeve(String expertise) {
			expertiseLevelDropdown.selectByVisibleText(expertise);
		}
		
		public static void enterSubject(String subject) {
			subjectTextBox.setText(subject);
			DriverHandler.delay(1);
			subjectDropDown.click();
		}
		
		public static void clickSuggest() {
			suggest.click();
		}
		
		public static void enterTitle(String title) {
			titleTextBox.setText(title);
		}
		
		public static void enterKnowledgeBase(String knowledgeBase) {
			knowledgeBaseTextBox.setText(knowledgeBase);
			DriverHandler.delay(1);
			knowlegeBaseDropDown.click();
		}
		
		public static void enterDescription(String description) {
			descriptionTextBox.setText(description);
		}
		
		public static void clickSave() {
			save.click();
		}
		
		public static class SuggestSubjectModal{
			
			private static TextBox subject = new TextBox("Subject",By.xpath("//app-suggest-service-subject//input[@id='name']"));
			private static Button save = new Button("Save",By.xpath("//app-suggest-service-subject//button[contains(text(),'Save')]"));
			
			public static void enterSubject(String subjectName) {
				subject.setText(subjectName);
			}
			
			public static void clickSave() {
				save.click();
			}
		}
	}
}
