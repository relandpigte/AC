package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Element;

public class AdminServiceSubjectsPage {

	private static Element titleHeader = new Element("Approve or Reject Suggestion page",By.xpath("//h1[text()='Approve or Reject Suggestions']"));
	
	public static void verifyApproveorRejectSuggestionPageIsDisplayed() {
		titleHeader.verifyDisplayed();
	}
	
}
