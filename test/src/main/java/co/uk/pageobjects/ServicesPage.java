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
			return new Element(service+" Service",By.xpath("//label[contains(text(),'Academic English Coaching')]/parent::div"));
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
}
