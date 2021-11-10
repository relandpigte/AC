package co.uk.stepdefinitions;

import co.uk.core.DriverHandler;
import co.uk.pageobjects.CalendarStudent;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class CalendarStudentStepDefinitions {

	@Then("^user is on the student calendar$")
	public void verifyUserIsOnTheStudentCalendar() {
		CalendarStudent.verifyCalendarHeaderIsDisplayed();
	}
	
	@Then("^the \"(.*)\" session is displayed on the student calendar$")
	public void verifySessionBlockIsDisplayedOnTheCalendar(String sessionName) {
		CalendarStudent.verifySessionBlockIsDisplayedOnTheCalendar(sessionName.replace("XXX", DriverHandler.timestamp));
	}
	
	@Then("^the default is \"(.*)\" on student calendar$")
	public void verifySessionFilterIsDisplayed(String session) {
		CalendarStudent.verifySelectedSessionIsDisplayed(session);
	}
	
	@When("^user click session dropdown on student calendar$")
	public void clickSessionDropdown() {
		CalendarStudent.clickSesstionType();
	}
	
	@Then("^\"(.*)\" and \"(.*)\" are displayed$")
	public void verifySessionFilterOptionIsDisplayed(String past, String upcoming) {
		CalendarStudent.verifySessionTypeIsDisplayed(past);
		CalendarStudent.verifySessionTypeIsDisplayed(upcoming);
	}
}
