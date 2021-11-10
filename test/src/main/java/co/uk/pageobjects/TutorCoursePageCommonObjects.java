package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Tab;

public class TutorCoursePageCommonObjects {
	
	private static Tab detailsTab = new Tab("Details",By.xpath("//a[@id='details-tab']"));
	private static Tab curriculumTab = new Tab("Curriculum",By.xpath("//a[@id='curriculum-tab']"));
	private static Tab settingsTab = new Tab("Settings",By.xpath("//a[@id='settings-tab']"));
	
	public static void clickDetailsTab() {
		detailsTab.click();
	}
	
	public static void clickCurriculumTab() {
		curriculumTab.click();
	}
	
	public static void clickSettingsTab() {
		settingsTab.click();
	}
}
