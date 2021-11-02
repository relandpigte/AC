package co.uk.stepdefinitions;

import co.uk.core.DriverHandler;
import co.uk.pageobjects.CalendarStudent;
import io.cucumber.java.en.Then;

public class CalendarStudentStepDefinitions {

	@Then("^the user is on the student calendar$")
	public void verifyUserIsOnTheStudentCalendar() {
		CalendarStudent.verifyCalendarHeaderIsDisplayed();
	}
	
	@Then("^the \"(.*)\" session is displayed on the student calendar$")
	public void verifySessionBlockIsDisplayedOnTheCalendar(String sessionName) {
		CalendarStudent.verifySessionBlockIsDisplayedOnTheCalendar(sessionName.replace("XXX", DriverHandler.timestamp));
	}
}
