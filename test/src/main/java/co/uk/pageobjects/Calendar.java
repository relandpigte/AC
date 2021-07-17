package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.TextBox;

public class Calendar {

	private static Element calendarHeader = new Element("Calendar",By.xpath("//app-calendar//span[contains(text(),'Calendar')]"));
	private static Button prevBtn = new Button("Previous",By.xpath("//app-calendar//button[@aria-label='prev']"));
	private static Button nextBtn = new Button("Next",By.xpath("//app-calendar//button[@aria-label='next']"));
	
	private static Element sessionType = new Element ("Session type dropdown",By.xpath("//app-calendar//span[@aria-labelledby='select2-sessionType-container']"));
	private static Element sessionTypeDropdown(String Option) {
		return new Element(Option,By.xpath("//ul[@id='select2-sessionType-results']//li[text()='"+Option+"']"));
	}
	private static Element calendar = new Element("Calendar",By.xpath("//td[@class='fc-timegrid-slot fc-timegrid-slot-lane ' and @data-time='12:00:00']"));
	
	public static class CreateEditBookingModal{
		
		private static Element projectIdDropdown = new Element("Project Id dropdown",By.xpath("//app-create-edit-booking//span[@id='select2-projectId-container']"));
		private static Element selectProjectIdOnDropdown(String projectId) {
			return new Element(projectId,By.xpath("//app-create-edit-booking//li[contains(@id,'projectId-result') and text()=' "+projectId+" ']"));
		}
		private static TextBox titleTextBox = new TextBox("Title",By.xpath("//app-create-edit-booking//input[@id='title']"));
		private static TextBox startDate = new TextBox("Start Date",By.xpath("//app-create-edit-booking//input[@id='startTimeDate']"));
		private static TextBox endDate = new TextBox("End Date",By.xpath("//app-create-edit-booking//input[@id='endTimeDate']"));
		
		private static TextBox startTimeHour = new TextBox("Start time HH",By.xpath("//timepicker[@id='startTime']//input[@placeholder='HH']"));
		private static TextBox startTimeMinute = new TextBox("Start time MM",By.xpath("//timepicker[@id='startTime']//input[@placeholder='MM']"));
		private static TextBox endTimeHour = new TextBox("End time HH",By.xpath("//timepicker[@id='endTime']//input[@placeholder='MM']"));
		private static TextBox endTimeMinute = new TextBox("End time MM",By.xpath("//timepicker[@id='endTime']//input[@placeholder='HH']"));
		private static Element recurrenceDropdown = new Element("Recurrence dropdown",By.xpath("//app-create-edit-booking//span[@id='select2-recurrence-container']"));
		private static Element selectRecurrenceOnDropdown(String recurrence) {
			return new Element(recurrence,By.xpath("//ul[@id='select2-recurrence-results']/li[text()=' "+recurrence+" ']"));
	}
	
	}
	
}
