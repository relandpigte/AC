package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.CheckBox;
import co.uk.webelements.Element;
import co.uk.webelements.Tab;
import co.uk.webelements.TextBox;

public class TutorProjectsPageFindWork {

	private static Tab findWorkTabIsActive = new Tab ("Find Work",By.xpath("//a[@class='nav-link active' and contains(text(),'Find Work')]"));
	private static Element projectName(String projectName){
		return new Element(projectName,By.xpath("//app-service-category//a[text()='"+projectName+"']"));
	}
	private static Button fullviewDetailsBtn(String projectname) {
		return new Button(projectname,By.xpath("//app-service-category//a[text()='"+projectname+"']/following::button[contains(text(),'Full details')][1]"));
	}
	
	public static void clickFullViewDetails(String project) {
		fullviewDetailsBtn(project).click();
	}
	
	public static void verifyFindWorkTabIsActive() {
		findWorkTabIsActive.verifyDisplayed();
	}
	
	public static void verifyProjectNameIsDisplayed(String project) {
		projectName(project).verifyDisplayed();
	}
	
	public static class ProjectDetails{
		
		private static Element projectDetailsModal = new Element("Project details modal",By.xpath("//app-view-project//h4[text()=' Project Details ']"));
		private static Element projectName(String project) {
			return new Element(project,By.xpath("//app-view-project//h2[text()=' "+project+" ']"));
		}
		private static Button alreadySentBtn = new Button("Proposal already sent",By.xpath("//button[text()=' Proposal already sent ']"));
		private static Button makeAnOfferBtn = new Button("Make an Offer",By.xpath("//app-view-project//button[text()=' Make an offer ']"));
		private static Button closeBtn = new Button("Close",By.xpath("//app-view-project//button[text()=' Close ']"));
		
		public static void verifyProposalalreadySentButtonIsDisplayed() {
			alreadySentBtn.verifyDisplayed();
		}
		
		public static void verifyProjectDetailsModalIsDisplayed() {
			projectDetailsModal.verifyDisplayed();
		}
		
		public static void verifyMakeAnOfferButtonIsDisplayed() {
			makeAnOfferBtn.verifyDisplayed();
		}
		
		public static void clickMakeAnOffer() {
			makeAnOfferBtn.click();
		}
		
		public static void verifyProjectNameIsDisplayed(String project) {
			projectName(project).verifyDisplayed();
		}
		
		public static void clickClose() {
			closeBtn.click();
		}
		
		public static class OfferModal{
			
			private static CheckBox pricePerHourToggle = new CheckBox("Price per hour toggle",By.xpath("//input[@id='IsPricedPerHour']"));
			private static CheckBox discountedHourToggle = new CheckBox("Discounted hour toggle",By.xpath("//input[@id='HasDiscountedHours']"));
			private static TextBox pricePerHour = new TextBox("Price per hour",By.xpath("//input[@id='PricePerHour']"));
			private static TextBox DiscountednumberOfHours = new TextBox("Number of hours",By.xpath("//input[@id='NumberOfHours']"));
			private static TextBox DiscountedpricePerHour = new TextBox("Price per hour",By.xpath("//input[@id='DiscountedPricePerHour']"));
			private static CheckBox freeInterviewToggle = new CheckBox("Free interview",By.xpath("//input[@id='IsFreeInterview']"));
			private static Button confirmBtn = new Button("Confirm",By.xpath("//button[text()=' Confirm ']"));
			private static Button closeBtn = new Button("Close",By.xpath("//button[text()=' Close ']"));
			
			public static void clickClose() {
				closeBtn.click();
			}
			
			public static void enablePricePerHour() {
				if(!pricePerHourToggle.isSelected()){
					pricePerHourToggle.click();
				}
			}
			
			public static void disablePricePerHour() {
				if(pricePerHourToggle.isSelected()){
					pricePerHourToggle.click();
				}
			}
			
			public static void enableDiscountedHour() {
				if(!discountedHourToggle.isSelected()) {
					discountedHourToggle.click();
				}
			}
			
			public static void disableDiscountedHour() {
				if(discountedHourToggle.isSelected()) {
					discountedHourToggle.click();
				}
			}
			
			public static void enableFreeInterview() {
				if(!freeInterviewToggle.isSelected()) {
					freeInterviewToggle.click();
				}
			}
			
			public static void disableFreeInteview() {
				if(freeInterviewToggle.isSelected()) {
					freeInterviewToggle.click();
				}
			}
			
			public static void enterPricePerHour(String priceperHour) {
				pricePerHour.setText(priceperHour);
			}
			
			public static void enterDiscountedPricePerHour(String priceperHour) {
				DiscountedpricePerHour.setText(priceperHour);
			}
			
			public static void enterDiscountedNumberOfHours(String numberOfHours) {
				DiscountednumberOfHours.setText(numberOfHours);
			}
			
			public static void clickConfirm() {
				confirmBtn.click();
			}
			
		}
		
		
	}
}
