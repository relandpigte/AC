package co.uk.pageobjects.student;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.Tab;

public class Homepage {

	private static Tab overviewTab = new Tab("Overview",By.xpath("//a[@id='overview-tab']"));
	private static Tab	projectTab = new Tab("My projects",By.xpath("//a[@id='projects-tab']"));
	private static Tab usageTab = new Tab("Usage",By.xpath("//a[@id='usage-tab']"));
	private static Element dashboardHeader = new Element("Dashboard",By.xpath("//h6[contains(text(),'Dashboard')]"));
	private static Element profilePhoto = new Element("Profile photo",By.xpath("//div[@class='card']//img[@alt='profile']"));
	private static Element coverPhoto = new Element("Cover photo",By.xpath("//div[@class='card']//img[@class='card-img-top']"));
	private static Button createNewProject = new Button("Create new project",By.xpath("//a[contains(text(),'Create New Project')]"));
	private static Element recentProjectTitle = new Element("Recent project",By.xpath("//app-recent-projects//h4[text()='Recent Projects']"));
	private static Element recentActivityTitle = new Element("Recent activity",By.xpath("//app-recent-activity//h4[contains(text(),'Recent Activity')]"));
	
	public static void verifyRecentProjectIsDisplayed() {
		recentProjectTitle.verifyDisplayed();
	}
	
	public static void verifyRecentActivityIsDisplayed() {
		recentActivityTitle.verifyDisplayed();
	}
	
	public static void clickOverviewTab() {
		overviewTab.click();
	}
	
	public static void clickMyProjectTab() {
		projectTab.click();
	}
	
	public static void clickUsageTab() {
		usageTab.click();
	}
	
	public static void verifyCreateNewProjectIsDisplayed() {
		createNewProject.verifyDisplayed();
	}
	
	public static void verifyOverviewTabIsDisplayed() {
		overviewTab.verifyDisplayed();
	}
	
	public static void verifyMyProjectTabIsDisplayed() {
		projectTab.verifyDisplayed();
	}
	
	public static void verifyUsageTabIsDisplayed() {
		usageTab.verifyDisplayed();
	}
	
	public static void verifyDashBoardIsDisplayed() {
		dashboardHeader.verifyDisplayed();
	}
	
	public static void verifyProfilePhotoIsDisplayed() {
		profilePhoto.verifyDisplayed();
	}
	
	public static void verifyCoverPhotoIsDisplayed() {
		coverPhoto.verifyDisplayed();
	}
	
}
