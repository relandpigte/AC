package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.Tab;

public class Homepage {

	private static Tab overviewTab = new Tab("Overview",By.xpath("//a[@id='overview-tab']"));
	private static Tab	projectTab = new Tab("My projects",By.xpath("//a[@id='projects-tab']"));
	private static Tab usageTab = new Tab("Usage",By.xpath("//a[@id='usage-tab']"));
	private static Element dashboardHeader = new Element("Dashboard",By.xpath("//h6[contains(text(),'Dashboard')]"));
	private static Element profileSummaryWidget = new Element("Profile widget",By.xpath("//app-profile-summary//div[@class='card']"));
	private static Element verificationWidget = new Element("Verification widget",By.xpath("//app-verifications//div[@class='card']"));
	private static Element verifyPhone = new Element("Verify phone",By.xpath("//app-verifications//h5[text()='Phone']//following::a[text()='Verify']"));
	private static Element phone = new Element("Verification Phone",By.xpath("//app-verifications//h5[text()='Phone']"));
	private static Element email = new Element("Verification email",By.xpath("//app-verifications//h5[text()='Email']"));
	private static Button createNewProject = new Button("Create new project",By.xpath("//a[contains(text(),'Create New Project')]"));
	private static Element recentProjectTitle = new Element("Recent project",By.xpath("//app-recent-projects//h4[text()='Recent Projects']"));
	private static Element recentActivityTitle = new Element("Recent activity",By.xpath("//app-recent-activity//h4[contains(text(),'Recent Activity')]"));
	
	public static void verifyVerificationWidgetIsDisplayed() {
		verificationWidget.verifyDisplayed();
	}
	
	public static void verifyEmailIsDisplayed() {
		email.verifyDisplayed();
	}
	
	public static void verifyPhoneIsDisplayed() {
		phone.verifyDisplayed();
	}
	
	public static void clickVerifyPhone() {
		verifyPhone.click();
	}
	
	public static void verifyRecentProjectIsDisplayed() {
		recentProjectTitle.verifyDisplayed();
	}
	
	public static void verifyProfileWidgetIsDisplayed() {
		profileSummaryWidget.verifyDisplayed();
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
	
	public static void clickCreateNewProject() {
		createNewProject.click();	
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
	
	public static class MyProject{
		
		private static Element projects = new Element("Project table",By.xpath("//app-dashboard-projects//h4[text()='Projects']"));
		
		public static void verifyProjectTableIsDisplayed() {
			projects.verifyDisplayed();
		}
		
	}
	
	public static class Metric{
		
		private static Element totalHour = new Element("Total hours",By.xpath("//app-metrics//h6[text()='Total Hours']"));
		private static Element academicLevel = new Element("Academic level",By.xpath("//app-metrics//h6[text()='Academic Level']"));
		private static Element userType = new Element("User type",By.xpath("//app-metrics//h6[text()='User Type']"));
		private static Element reviews = new Element("Reviews",By.xpath("//app-metrics//h6[contains(text(),'Reviews')]"));
	
		public static void verifyTotalHoursMetricIsDisplayed() {
			totalHour.verifyDisplayed();	
		}
		
		public static void verifyAcademicLevelMetricIsDisplayed() {
			academicLevel.verifyDisplayed();
		}
		
		public static void verifyUserTypeMetricIsDisplayed() {
			userType.verifyDisplayed();
		}
		
		public static void verifyReviewsMetricIsDisplayed() {
			reviews.verifyDisplayed();
		}
		
	}
	public static class ProfileWidget{
		
		private static Element profilePhoto = new Element("Profile photo",By.xpath("//div[@class='card']//img[@alt='profile']"));
		private static Element coverPhoto = new Element("Cover photo",By.xpath("//div[@class='card']//img[@class='card-img-top']"));
		private static Element schoolName(String schoolName) {
			return new Element(schoolName,By.xpath("//app-profile-summary//p[contains(text(),'"+schoolName+"')]"));
		}
		private static Element badgeStatus(String badge) {
			return new Element(badge+" Badge",By.xpath("//app-profile-summary//span[contains(@class,'badge')and contains(text(),'"+badge+"')]"));
		}
		
		private  static Button becomeTutor = new Button("Become a tutor",By.xpath("//app-profile-summary//button[contains(text(),'Become a Tutor')]"));
		
		public static void verifyBecomeTutorIsDisplayed() {
			becomeTutor.verifyDisplayed();
		}
		
		public static void clickBecomeTutor() {
			becomeTutor.click();
		}
		
		public static void verifyBadge(String badge) {
			badgeStatus(badge).verifyDisplayed();
		}
		
		
		public static void verifySchoolName(String school) {
			schoolName(school).verifyDisplayed();
		}
		
		public static void clickProfilePhoto() {
			profilePhoto.click();
		}
		
		public static void verifyProfilePhotoIsDisplayed() {
			profilePhoto.verifyDisplayed();
		}
		
		public static void verifyCoverPhotoIsDisplayed() {
			coverPhoto.verifyDisplayed();
		}
	}
	public static class Usage{
		
		private static Tab usageIsActive = new Tab("Usage",By.xpath("//a[@id='usage-tab' and contains(@class,'active')]"));
		private static Element totalHours = new Element("Total Hours",By.xpath("//a[@id='usage-tab' and contains(@class,'active')]/following::h6[text()='Total Hours']"));
		private static Element totalProject = new Element("Total project",By.xpath("//a[@id='usage-tab' and contains(@class,'active')]/following::h6[text()='Total Projects']"));
		private static Element chart = new Element ("Overvoew chart",By.xpath("//a[@id='usage-tab' and contains(@class,'active')]//following::canvas[contains(@class,'chartjs-render-monitor')]"));
	
		public static void verifyUsageTabIsActive() {
			usageIsActive.verifyDisplayed();
		}
		
		public static void verifyTotalHoursIsDisplayed() {
			totalHours.verifyDisplayed();
		}
		
		public static void veriftTotalProjectIsDisplayed() {
			totalProject.verifyDisplayed();
		}
		
		public static void verifyChart() {
			chart.verifyDisplayed();
		}
	}
	
}
