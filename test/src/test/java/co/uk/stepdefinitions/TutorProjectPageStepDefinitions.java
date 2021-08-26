package co.uk.stepdefinitions;

import java.util.List;
import java.util.Map;

import co.uk.core.DriverHandler;
import co.uk.pageobjects.AdminManageUserPage;
import co.uk.pageobjects.TutorProjectsPageFindWork;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class TutorProjectPageStepDefinitions {

	@Then("^user in in find work screen$")
	public void verifyFindWorkTabIsActive() {
		TutorProjectsPageFindWork.verifyFindWorkTabIsActive();
	}
	
	@Then("^project name \"(.*)\" is displayed$")
	public void verifyProjectNameIsDisplayed(String projectName) {
		TutorProjectsPageFindWork.verifyProjectNameIsDisplayed(projectName.replace("XXX", DriverHandler.timestamp));
	}
	
	@When("^user view a full details of the project \"(.*)\"$")
	public void clickFullDetails(String projectName) {
		TutorProjectsPageFindWork.clickFullViewDetails(projectName.replace("XXX",DriverHandler.timestamp));
		DriverHandler.delay(4);
	}
	
	@Then("^project details modal is displayed$")
	public void verifyProjectDetailsModalIsDisplayed() {
		TutorProjectsPageFindWork.ProjectDetails.verifyProjectDetailsModalIsDisplayed();
	}
	
	@When("^tutor make an offer$")
	public void tutorOffer(DataTable userDetails) {
        List<Map<String, String>> data = userDetails.asMaps(String.class, String.class);
        String pricePerHour = data.get(0).get("Price per hour");
        String discountedNumberOfHours = data.get(0).get("Discounted number of hours");
        String discountedPricePerHour = data.get(0).get("Discounted price per hour");
        String freeInterview = data.get(0).get("Free interview");
        
        TutorProjectsPageFindWork.ProjectDetails.clickMakeAnOffer();
        
        if(!pricePerHour.equals("null")) {
        	TutorProjectsPageFindWork.ProjectDetails.OfferModal.enablePricePerHour();
        	TutorProjectsPageFindWork.ProjectDetails.OfferModal.enterPricePerHour(pricePerHour);
        }
        if(!discountedNumberOfHours.equals("null")) {
        	TutorProjectsPageFindWork.ProjectDetails.OfferModal.enableDiscountedHour();
        	TutorProjectsPageFindWork.ProjectDetails.OfferModal.enterDiscountedNumberOfHours(discountedNumberOfHours);
        }
        if(!discountedPricePerHour.equals("null")) {
        	TutorProjectsPageFindWork.ProjectDetails.OfferModal.enableDiscountedHour();
        	TutorProjectsPageFindWork.ProjectDetails.OfferModal.enterDiscountedPricePerHour(discountedPricePerHour);
        }
        if(freeInterview.equals("Yes")) {
        	TutorProjectsPageFindWork.ProjectDetails.OfferModal.enableFreeInterview();
        }
        if(freeInterview.equals("No")) {
        	TutorProjectsPageFindWork.ProjectDetails.OfferModal.disableFreeInteview();
        }
        TutorProjectsPageFindWork.ProjectDetails.OfferModal.clickConfirm();        
	}
        
    @Then("^proposal already sent button is displayed$")
    public void verfyPropoalAlreadySentButtonIsDisplayed(){
    	 TutorProjectsPageFindWork.ProjectDetails.verifyProposalalreadySentButtonIsDisplayed();
    }
    
    @When("^user close the offer modal$")
    public void closeTheOfferModal() {
    	TutorProjectsPageFindWork.ProjectDetails.OfferModal.clickClose();
    	DriverHandler.delay(2);
    }
}
