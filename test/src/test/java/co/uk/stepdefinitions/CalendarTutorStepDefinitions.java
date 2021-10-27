package co.uk.stepdefinitions;

import co.uk.core.DriverHandler;
import co.uk.pageobjects.CalendarStudent;
import co.uk.pageobjects.CalendarTutor;
import io.cucumber.java.en.Then;

public class CalendarTutorStepDefinitions {

	@Then("^the user is on the tutor calendar$")
	public void verifyUserIsOnTheTutorCalendar() {
		CalendarTutor.verifyCalendarHeaderIsDisplayed();
	}
	
	@Then("^the \"(.*)\" session is displayed on the tutor calendar$")
	public void verifySessionBlockIsDisplayedOnTheCalendar(String sessionName) {
		CalendarTutor.verifySessionBlockIsDisplayedOnTheCalendar(sessionName.replace("XXX", DriverHandler.timestamp));
	}
}
