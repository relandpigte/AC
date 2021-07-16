package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Tab;

public class StudentProjectPageProposal {

	private static Tab proposalTabIsActive = new Tab("Proposal",By.xpath("//a[@class='nav-link ng-star-inserted active' and contains(text(),'Proposals')]"));
	
	public static void verifyProposalTabIsActive() {
		proposalTabIsActive.verifyDisplayed();
	}
}
