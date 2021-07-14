package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.Element;

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
		private static Element serviceLevel(String service) {
			return new Element(service+" Service",By.xpath("//label[text()='"+service+"']/parent::div"));
		}
		
		private static Button continueBtn = new Button("Continue",By.xpath("//button[contains(text(),'Continue')]"));
		private static Button backBtn = new Button("Cancel",By.xpath("//button[contains(text(),'Back')]"));
		public static void clickServiceLevel(String service) {
			serviceLevel(service).click();
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
		
		private static Element page3 = new Element("Page 2",By.xpath("//div[contains(@class,'justify-content-between')]//p[contains(text(),'Step 2 Of 4')]"));
		
		public static void verifyPage3IsDisplayed() {
			page3.verifyDisplayed();
		}
		
	}
	
}
