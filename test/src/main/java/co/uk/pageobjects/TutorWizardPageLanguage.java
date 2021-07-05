package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.ListBox;

public class TutorWizardPageLanguage {

	private static Button edit = new Button("Edit",By.xpath("//app-spoken-languages//i[contains(@class,'edit')]/parent::Button"));
	private static Button next = new Button("Next",By.xpath("//button[contains(text(),'Next')]"));
	private static Element languageAndProficiency(String language, String proficiency) {
		return new Element("Language: "+language+", Proficiency: "+proficiency,By.xpath("//app-spoken-languages//h5[contains(text(),'"+language+"')]/following::h6[contains(text(),'"+proficiency+"')]"));
	}
	public static void clickEdit() {
		edit.click();
	}
	
	public static void clickNext() {
		next.click();
	}
	
	public static void verifyLanguageAndProficiencyAreDisplayed(String language, String proficiency) {
		languageAndProficiency(language,proficiency).verifyDisplayed();
	}
	
	public static class LanguageModal{
		
		private static ListBox englishProficiency = new ListBox("English proficeieny",By.xpath("//select[@id='englishProficiency']"));
		private static Button addLanguage = new Button("Add language",By.xpath("//a[contains(text(),'Add Language')]"));
		private static Element otherlanguageAndProficieny(String language, String proficiency) {
			return new Element("Language: "+language+", Proficiency: "+proficiency,By.xpath("//td[text()='"+language+"']/following-sibling::td[contains(text(),'"+proficiency+"')]"));
		}
		private static Button save = new Button("Save",By.xpath("//app-edit-spoken-language-form//button[contains(text(),'Save')]"));
		private static Button editOtherLanguage(String language) {
			return new Button(language+" edit",By.xpath("//td[text()='"+language+"']/following::span[contains(@class,'edit')]/parent::button"));
		}
		private static Button removeOtherLanguage(String language) {
			return new Button(language+" edit",By.xpath("//td[text()='"+language+"']/following::span[contains(@class,'trash')]/parent::button"));
		}
		
		public static void clickEditOtherLanguage(String language) {
			editOtherLanguage(language).click();
		}
		
		public static void removeEditOtherLanguage(String language) {
			removeOtherLanguage(language).click();
		}
		
		public static void selectEnglishProficiency(String Proficiency) {
			englishProficiency.selectByVisibleText(Proficiency);
		}
		
		public static void clickAddLanguage() {
			addLanguage.click();	
		}
		
		public static void verifyOtherLanguageAndProficieny(String language, String proficiency) {
			otherlanguageAndProficieny(language,proficiency).verifyDisplayed();
		}
		
		public static void clickSave() {
			save.click();
		}
		
		public static class AddEditLanguageModal{
			
			private static ListBox languageDropdown = new ListBox("Language",By.xpath("//select[@id='newOtherSpokenLanguage']"));
			private static ListBox proficiencyDropdown = new ListBox("Proficiency",By.xpath("//select[@id='newProficiency']"));
			private static Button add = new Button("Add",By.xpath("//button[contains(text(),'Add')]"));
			private static Button update = new Button("Update",By.xpath("//button[contains(text(),'Update')]"));
			
			public static void clickUpdate() {
				update.click();
			}
			
			public static void selectLanguage(String language) {
				languageDropdown.selectByVisibleText(language);
			}
			
			public static void selectProficiency(String proficiency) {
				proficiencyDropdown.selectByVisibleText(proficiency);
			}
			
			public static void  clickAdd() {
				add.click();
			}
		}
	}
}
