package co.uk.pageobjects;

import org.openqa.selenium.By;
import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.RadioButton;
import co.uk.webelements.Tab;
import co.uk.webelements.TextBox;

public class TutorCoursePageDetailsTab {

	private static Tab detailTabIsActive = new Tab("Detail",
			By.xpath("//a[contains(@class,'active') and text()='Details']"));
	private static TextBox nameTxtBox = new TextBox("Name", By.xpath("//input[@id='name']"));
	private static TextBox subtitleTxtBox = new TextBox("Subtitle", By.xpath("//input[@id='subtitle']"));
	private static TextBox descriptionTxtBox = new TextBox("Description",
			By.xpath("//div[contains(@class,'ql-editor')]/p"));

	private static TextBox descriptionContains(String text) {
		return new TextBox("Description", By.xpath("//div[contains(@class,'ql-editor')]/p[text()='" + text + "']"));
	}

	private static TextBox categoriesTxtBox = new TextBox("Categories", By.xpath("//input[@id='categories']"));
	private static TextBox imageUploader = new TextBox("Image uploader", By.xpath("//input[@id='DocumentUploader']"));

	private static Element imageFileName(String fileName) {
		return new Element("Image filename " + fileName,
				By.xpath("//app-document-uploader//h4[contains(text(),'" + fileName + "')]"));
	}

	private static RadioButton chargeFeeRadioBtn = new RadioButton("Charge a fee",
			By.xpath("//label[text()='Charge a fee']"));
	private static TextBox priceTxtBox = new TextBox("Price", By.xpath("//input[@id='price']"));
	private static Button currency = new Button("Currency", By.xpath("//button[@data-toggle='dropdown']"));

	private static Element currencyOption(String currency) {
		return new Element("Currency " + currency,
				By.xpath("//div[@class='input-group-append show']//a[text()='" + currency + "']"));
	}

	private static RadioButton freeRadioBtn = new RadioButton("Free", By.xpath("//input[@id='free']"));

	private static Element selectedLanguage(String language) {
		return new Element(language,
				By.xpath("//span[@id='select2-language-container' and text()=' " + language + " ']"));
	}

	private static Element languageDrpdwn = new Element("Language dropdown",
			By.xpath("//span[@id='select2-language-container']"));

	private static Element languageOption(String option) {
		return new Element("Language: " + option,
				By.xpath("//ul[@id='select2-language-results']//li[text()=' " + option + " ']"));
	}

	private static Button save = new Button("Save", By.xpath("//button[text()=' Save ']"));

	public static void uploadAnImage(String filename) {
		imageUploader.uploadFile(filename);
	}

	public static void verifyImageFileNameIsDisplayed(String filename) {
		imageFileName(filename).verifyDisplayed();
	}

	public static void verifyDetailTabIsActive() {
		detailTabIsActive.verifyDisplayed();
	}

	public static void enterName(String name) {
		nameTxtBox.setText(name);
	}

	public static void enterSubtitle(String subtitle) {
		subtitleTxtBox.setText(subtitle);
	}

	public static void enterDescription(String description) {
		descriptionTxtBox.setText(description);
	}

	public static void enterCategories(String category) {
		categoriesTxtBox.setText(category);
	}

	public static void verifyCategoriesTextboxIsDisplayed() {
		categoriesTxtBox.verifyDisplayed();
	}

	public static void enterPricing(String price) {
		chargeFeeRadioBtn.click();
		priceTxtBox.setText(price);
	}

	public static void selectCurrency(String option) {
		currency.click();
		currencyOption(option).click();
	}

	public static void clickFree() {
		freeRadioBtn.click();
	}

	public static void selectLanguage(String language) {
		languageDrpdwn.click();
		if (!languageOption(language).isDisplayed()) {
			languageDrpdwn.click();
		}
		languageOption(language).click();
		if (!selectedLanguage(language).isDisplayed()) {
			languageOption(language).click();
		}

	}

	public static void verifySelectedLanguageIsDisplayed(String language) {
		selectedLanguage(language).verifyDisplayed();
	}

	public static void clickSave() {
		save.click();
	}

	public static void verifyNameIsCorrect(String name) {
		nameTxtBox.verifyAttributeEquals("value", name);
	}

	public static void verifySubtitleIsCorrect(String subtitle) {
		subtitleTxtBox.verifyAttributeEquals("value", subtitle);
	}

	public static void verifyDescriptionIsCorrect(String description) {
		descriptionContains(description).verifyDisplayed();
	}

	public static class CropImageModal {

		private static Button crop = new Button("Crop", By.xpath("//span[text()=' Crop ']/parent::button"));

		public static void clickCrop() {
			crop.click();
		}
	}

}
