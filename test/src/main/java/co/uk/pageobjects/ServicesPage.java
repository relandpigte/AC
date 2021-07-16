package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.TextBox;

public class ServicesPage {

	private static Element servicePage = new Element("Services page",By.xpath("//app-create-project//h1[contains(text(),'Create a New Project')]"));
	private static Button requestSupport = new Button("Request",By.xpath("//app-create-project//a[contains(text(),'Request Support')]"));
	
	public static void verifyServicePageisDisplayed() {
		servicePage.verifyDisplayed();
	}
	
	public static void clickRequestSupport() {
		requestSupport.click();
	}
	
	public static class Step1{
		
		private static Element services(String service) {
			return new Element(service+" Service",By.xpath("//label[contains(text(),'"+service+"')]/parent::div"));
		}
		private static Button continueBtn = new Button("Continue",By.xpath("//button[contains(text(),'Continue')]"));
		private static Button cancel = new Button("Cancel",By.xpath("//button[contains(text(),'Cancel')]"));
		
		public static void verifyServiceIsDisplayed(String service) {
			services(service).verifyDisplayed();
		}
		
		public static void clickService(String service) {
			services(service).click();
		}
		
		public static void clickContinue() {
			continueBtn.click();
		}
		
		public static void clickCancel() {
			cancel.click();
		}
	}
	
	public static class Steps2{
		
		private static Element page2 = new Element("Page 2",By.xpath("//div[contains(@class,'justify-content-between')]//p[contains(text(),'Step 2 Of 4')]"));
		private static Element serviceLevel(String level) {
			return new Element(level+" level",By.xpath("//label[text()='"+level+"']/parent::div"));
		}
		
		private static Button continueBtn = new Button("Continue",By.xpath("//button[contains(text(),'Continue')]"));
		private static Button backBtn = new Button("Cancel",By.xpath("//button[contains(text(),'Back')]"));
		
		public static void verifyServiceIsDisplayed(String level) {
			serviceLevel(level).verifyDisplayed();
		}
		
		public static void clickServiceLevel(String level) {
			serviceLevel(level).click();
		}
		
		public static void clickContinue() {
			continueBtn.click();
		}
		
		public static void clickBack() {
			backBtn.click();
		}
		
		public static void verifyPage2IsDisplayed() {
			page2.verifyDisplayed();
		}
	}
	
	public static class Step3{
		
		private static Element page3 = new Element("Page 3",By.xpath("//div[contains(@class,'justify-content-between')]//p[contains(text(),'Step 3 Of 4')]"));
		private static Element service(String service) {
			return new Element(service,By.xpath("//label/h3[text()='"+service+"']"));
		}
		private static Button continueBtn = new Button("Continue",By.xpath("//button[contains(text(),'Continue')]"));
		private static Button backBtn = new Button("Cancel",By.xpath("//button[contains(text(),'Back')]"));
		
		public static void clickContinue() {
			continueBtn.click();
		}
		
		public static void clickBack() {
			backBtn.click();
		}
		public static void clickService(String serviceOption) {
			service(serviceOption).click();
		}
		
		public static void VerifyServiceIsDisplayed(String serviceOption) {
			service(serviceOption).verifyDisplayed();
		}
		
		public static void verifyPage3IsDisplayed() {
			page3.verifyDisplayed();
		}
		
	}
	
	public static class Step4{
		
		private static Element page4 = new Element("Page 4",By.xpath("//div[contains(@class,'justify-content-between')]//p[contains(text(),'Step 4 Of 4')]"));
		private static TextBox projectName = new TextBox("Project name",By.xpath("//input[@id='ProjectName']"));
		private static Button createBtn = new Button("Continue",By.xpath("//button[contains(text(),'Create')]"));
		private static Button backBtn = new Button("Cancel",By.xpath("//button[contains(text(),'Back')]"));
		
		public static void clickCreate() {
			createBtn.click();
		}
		
		public static void clickBack() {
			backBtn.click();
		}
		public static void verifyPrjectNameTextBoxIsDisplayed() {
			projectName.verifyDisplayed();
		}
		
		public static void enterProjectName(String project) {
			projectName.setText(project);
		}
		public static void verifyPage4IsDisplayed() {
			page4.verifyDisplayed();
		}
	}
}
