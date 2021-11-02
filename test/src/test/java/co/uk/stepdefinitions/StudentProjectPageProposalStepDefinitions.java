package co.uk.stepdefinitions;

import java.util.List;
import java.util.Map;
import co.uk.core.DriverHandler;
import co.uk.pageobjects.StudentProjectPageProposal;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class StudentProjectPageProposalStepDefinitions {
		     
	@Then("^user is in proposal screen$")
	public void verifyProposalTabIsActive() {
		StudentProjectPageProposal.verifyProposalTabIsActive();
	}
	
	@Then("^\"(.*)\" offer is displayed$")
	public void verifyTutorNameIsDisplayed(String name) {
		StudentProjectPageProposal.verifyTutorNameIsDisplayed(name);
	}
	
	@When("^the user views the full details of \"(.*)\" offer$")
	public void viewFullDetailsOfTutorOffer(String tutorName) {
		StudentProjectPageProposal.clickFullDetails(tutorName);
	}
	
	@Then("^the user has successfully viewed the tutor offer$")
	public void verifyTutorOfferModalIsDisplayed() {
		StudentProjectPageProposal.FullDetailsModal.verifyFullDetailModalIsDisplayed();
	}
	
	@When("^user proceed to book session tab$")
	public void proceedToBookSeassionTab() {
		StudentProjectPageProposal.FullDetailsModal.clickBookSessionTab();
	}
	
	@When("^user add book session on payment page$")
	public void addBookSession() {
		StudentProjectPageProposal.FullDetailsModal.clickAddSession();
	}
	
	@Then("^Add booking modal is displayed on payment page$")
	public void addBookingModalIsDiplsyed() {
		StudentProjectPageProposal.FullDetailsModal.BookingModal.verifyBookingModalIsDisplayed();
	}
	
	@When("^user enter booking details on payment page$")
	public void enterBookingDetails(DataTable userDetails) {
		 List<Map<String, String>> data = userDetails.asMaps(String.class, String.class);
	        String projectId = data.get(0).get("Project id");
	        String title = data.get(0).get("Title");
	        String startDate = data.get(0).get("Start date");
	        String endDate = data.get(0).get("End date");
	        String interval = data.get(0).get("Start Interval");
	        String startHour = data.get(0).get("Start hour");
	        String startMinute = data.get(0).get("Start minute");
	        String startMeridiem = data.get(0).get("Start meridiem");
	        String sessionHours = data.get(0).get("Session hour");
	        String endHour = data.get(0).get("End hour");
	        String endMinute = data.get(0).get("End minute");
	        String endMeridiem = data.get(0).get("End meridiem");	        
	        String recurrence = data.get(0).get("Recurrence");
	        
	        if(!projectId.equals("null")) {
	        	StudentProjectPageProposal.FullDetailsModal.BookingModal.selectProjectId(projectId);
	        }
	        if(!title.equals("null")) {
	        	StudentProjectPageProposal.FullDetailsModal.BookingModal.enterTitle(title.replace("XXX", DriverHandler.timestamp));
	        }
	      
	        if(startDate.equals("Tommorow except weekends")) {
	        	StudentProjectPageProposal.FullDetailsModal.BookingModal.incrementTheCurrentDateExceptWeekendsStartDate();
	        }
	        
	        if(startDate.equals("now")) {
	        	StudentProjectPageProposal.FullDetailsModal.BookingModal.enterStartDate(startDate);
	        }

	        if(endDate.equals("Tommorow except weekends")) {
	        	StudentProjectPageProposal.FullDetailsModal.BookingModal.incrementTheCurrentDateExceptWeekendsEndDate();
	        }
	        
	        if(endDate.equals("now")) {
	        	StudentProjectPageProposal.FullDetailsModal.BookingModal.enterEndDate(endDate);
	        }
	        
	        if(!startHour.equals("null")) {
	        	StudentProjectPageProposal.FullDetailsModal.BookingModal.enterStartTimeHour(startHour);
	        }
	        if(!startMinute.equals("null")) {
	        	StudentProjectPageProposal.FullDetailsModal.BookingModal.enterStartTimeMinute(startMinute);
	        }
	        if(!startMeridiem.equals("null")) {
	        	if(startMeridiem.equals("PM")) {
	        		StudentProjectPageProposal.FullDetailsModal.BookingModal.clickStartTimeToPM();
	        	}
	        	else if (startMeridiem.equals("AM")){
	        		StudentProjectPageProposal.FullDetailsModal.BookingModal.clickStartTimeToAM();
	        	}
	        	DriverHandler.delay(2);
	        }

	        if(!endHour.equals("null")) {
	        	StudentProjectPageProposal.FullDetailsModal.BookingModal.enterEndHour(endHour);
	        }
	        if(!endMinute.equals("null")) {
	        	StudentProjectPageProposal.FullDetailsModal.BookingModal.enterEndMinute(endMinute);
	        }
	        
	        if(!endMeridiem.equals("null")) {
	        	if(endMeridiem.equals("PM")) {
	        		StudentProjectPageProposal.FullDetailsModal.BookingModal.clickEndTimeToPM();
	        	}
	        	else if (endMeridiem.equals("AM")){
	        		StudentProjectPageProposal.FullDetailsModal.BookingModal.clickEndTimeToAM();
	        	}
	        	DriverHandler.delay(2);
	        }
	        if(!interval.equals("null")) {
	        	StudentProjectPageProposal.FullDetailsModal.BookingModal.clickArrowUpStartTimeHour(interval);
	        }
	        if(!sessionHours.equals("null")) {
	        	StudentProjectPageProposal.FullDetailsModal.BookingModal.clickArrowUpEndTimeHour(sessionHours);
	        	 
	        }
	        if(!recurrence.equals("null")) {
	        	StudentProjectPageProposal.FullDetailsModal.BookingModal.selectRecurrence(recurrence);
	        }
	        StudentProjectPageProposal.FullDetailsModal.BookingModal.clickAdd();
	     
	}
			
	@When("^the user pays for the session$")
	public void clickPayButton() {
		StudentProjectPageProposal.FullDetailsModal.clickPay();
	}
	
	@When("^user deletes this project$")
	public void clickDeleteButton() {
		StudentProjectPageProposal.clickDelete();
		StudentProjectPageProposal.DeleteConfirmationModal.clickYesButton();
		
	}
	
	
}
