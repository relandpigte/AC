package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.RadioButton;
import co.uk.webelements.Tab;

public class TutorCoursePageSettingsTab {
	
	private static Tab settingsTabIsActive = new Tab("Settings",By.xpath("//a[contains(@class,'active') and text()='Settings']"));
	private static RadioButton standard = new RadioButton("Standard",By.xpath("//input[@id='standard']"));
	private static Button create = new Button("Create",By.xpath("//button[text()=' Create ']"));
	private static Element courseProgressSection = new Element("Course progress section",By.xpath("//div[@class='card']//h4[text()=' Course progress ']"));
	private static Element commentSection = new Element("Comment section",By.xpath("//div[@class='card']//h4[text()=' Comments ']"));
	private static Element customCourseURLSection = new Element("Custom course URL section",By.xpath("//div[@class='card']//h4[text()=' Custom course URL ']"));
	private static Element courseVisibilitySection = new Element("Course visibility section",By.xpath("//div[@class='card']//h4[text()=' Course visibility ']"));
	private static Element courseAccessSection = new Element("Course access section",By.xpath("//div[@class='card']//h4[text()=' Course access ']"));
	private static Element autoplaySection = new Element("Autoplay section",By.xpath("//div[@class='card']//h4[text()=' Autoplay ']"));
	
	public static void verifyCourseProgressSectionIsDisplayed() {
		courseProgressSection.verifyDisplayed();
	}
	
	public static void verifyCommentSectionIsDisplayed() {
		commentSection.verifyDisplayed();
	}
	
	public static void verifyCustomCourseURLsectionIsDisplayed() {
		customCourseURLSection.verifyDisplayed();
	}
	
	public static void verifyCourseVisibilitySectionIsDisplayed() {
		courseVisibilitySection.verifyDisplayed();
	}
	
	public static void verifyCourseAccessSectionIsDisplayed() {
		courseAccessSection.verifyDisplayed();
	}
	
	public static void verifyAutoplaySectionIsDisplayed() {
		autoplaySection.verifyDisplayed();
	}
	
	public static void clickCreate() {
		create.click();
	}
	
	public static void verifySettingsTabIsActive() {
		settingsTabIsActive.verifyDisplayed();
	}
	
	public static void clickStandartType() {
		standard.click();
	}
	
}
