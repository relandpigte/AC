package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.Tab;

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
		
		private static Button makeAnOfferBtn = new Button("Make an Offer",By.xpath("//app-view-project//button[text()=' Make an offer ']"));
		private static Button closeBtn = new Button("Close",By.xpath("//app-view-project//button[text()=' Close ']"));
		
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
	}
}
