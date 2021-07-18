package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.core.DriverHandler;
import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.TextBox;

public class Calendar {

	private static Element calendarHeader = new Element("Calendar",
			By.xpath("//app-calendar//span[contains(text(),'Calendar')]"));
	private static Button prevBtn = new Button("Previous", By.xpath("//app-calendar//button[@aria-label='prev']"));
	private static Button nextBtn = new Button("Next", By.xpath("//app-calendar//button[@aria-label='next']"));
	private static Element sessionType = new Element("Session type dropdown",
			By.xpath("//app-calendar//span[@aria-labelledby='select2-sessionType-container']"));

	private static Element sessionTypeDropdown(String Option) {
		return new Element(Option, By.xpath("//ul[@id='select2-sessionType-results']//li[text()='" + Option + "']"));
	}

	private static Element calendar = new Element("Calendar",
			By.xpath("//td[@class='fc-timegrid-slot fc-timegrid-slot-lane ' and @data-time='12:00:00']"));

	private static Element blockDate(String date, String title) {
		return new Element(date + "-" + title, By.xpath("//td[@data-date='" + date
				+ "]//div[contains(@class,'non-business tutor')]/div[text()='" + title + "']"));
	}

	public static Element sessionOnCalendar(String title) {
		return new Element(title + " on the calendar",
				By.xpath("//div[text()='" + title + "']/ancestor::div[@class='fc-event-main-frame']"));
	}

	public static Element sessionOnTheList(String title) {
		return new Element(title + " on the list", By.xpath("//ul//a[text()='" + title + "']//ancestor::li"));
	}
	
	public static void clickCalendar() {
		calendar.click();
	}

	public static void verifyCaendarModalIsDisplayed() {
		calendarHeader.verifyDisplayed();
	}

	public static void clickPrev() {
		prevBtn.click();
	}

	public static void clickNext() {
		nextBtn.click();
	}

	public static void selectSessionType(String session) {
		sessionType.click();
		sessionTypeDropdown(session).click();
	}

	public static void clickSesstionType() {
		sessionType.click();

	}

	public static void verifySessionTypeIsDisplayed(String session) {
		sessionTypeDropdown(session).verifyDisplayed();
	}

	// example: 2021-07-18
	public static void verifyblockDateIsDisplayed(String date, String title) {
		blockDate(date, title).verifyDisplayed();
	}

	public static class CreateEditBookingModal {

		private static Element projectIdDropdown = new Element("Project Id dropdown",
				By.xpath("//app-create-edit-booking//span[@id='select2-projectId-container']"));

		private static Element selectProjectIdOnDropdown(String projectId) {
			return new Element(projectId,
					By.xpath("//app-create-edit-booking//li[contains(@id,'projectId-result') and text()=' " + projectId
							+ " ']"));
		}

		private static TextBox titleTextBox = new TextBox("Title",
				By.xpath("//app-create-edit-booking//input[@id='title']"));
		private static TextBox startDate = new TextBox("Start Date",
				By.xpath("//app-create-edit-booking//input[@id='startTimeDate']"));
		private static TextBox endDate = new TextBox("End Date",
				By.xpath("//app-create-edit-booking//input[@id='endTimeDate']"));
		private static TextBox startTimeHour = new TextBox("Start time HH",
				By.xpath("//timepicker[@id='startTime']//input[@placeholder='HH']"));
		private static TextBox startTimeMinute = new TextBox("Start time MM",
				By.xpath("//timepicker[@id='startTime']//input[@placeholder='MM']"));
		private static TextBox endTimeHour = new TextBox("End time HH",
				By.xpath("//timepicker[@id='endTime']//input[@placeholder='MM']"));
		private static TextBox endTimeMinute = new TextBox("End time MM",
				By.xpath("//timepicker[@id='endTime']//input[@placeholder='HH']"));
		private static Element recurrenceDropdown = new Element("Recurrence dropdown",
				By.xpath("//app-create-edit-booking//span[@id='select2-recurrence-container']"));

		private static Element selectRecurrenceOnDropdown(String recurrence) {
			return new Element(recurrence,
					By.xpath("//ul[@id='select2-recurrence-results']/li[text()=' " + recurrence + " ']"));
		}

		private static Button bookAsession = new Button("Book a session",
				By.xpath("//app-create-edit-booking//button[text()=' Book session ']"));

		public static void selectProjectId(String project) {
			projectIdDropdown.click();
			DriverHandler.delay(1);
			selectProjectIdOnDropdown(project).click();
		}

		public static void enterTitle(String title) {
			titleTextBox.setText(title);
		}

		public static void enterStartDate(String date) {
			startDate.setValueWithJavascript(date);
		}

		public static void enterEndDate(String date) {
			endDate.setValueWithJavascript(date);
		}

		public static void enterStartTime(String hour, String minute) {
			startTimeHour.setValueWithJavascript(hour);
			startTimeMinute.setValueWithJavascript(minute);
		}

		public static void enterEndTime(String hour, String minute) {
			endTimeHour.setValueWithJavascript(hour);
			endTimeMinute.setValueWithJavascript(minute);
		}

		public static void selectRecurrence(String recurrence) {
			recurrenceDropdown.click();
			DriverHandler.delay(1);
			selectRecurrenceOnDropdown(recurrence).click();
		}

		public static void clickbookAsession() {
			bookAsession.click();
		}
	}

	public static class CreateEditBlockOutModal {

		private static TextBox titleTextBox = new TextBox("Title",
				By.xpath("//app-create-edit-block-out//input[@id='title']"));
		private static TextBox startDate = new TextBox("Start Date",
				By.xpath("//app-create-edit-block-out//input[@id='startTimeDate']"));
		private static TextBox endDate = new TextBox("End Date",
				By.xpath("//app-create-edit-block-out//input[@id='endTimeDate']"));
		private static TextBox startTimeHour = new TextBox("Start time HH",
				By.xpath("//timepicker[@id='startTime']//input[@placeholder='HH']"));
		private static TextBox startTimeMinute = new TextBox("Start time MM",
				By.xpath("//timepicker[@id='startTime']//input[@placeholder='MM']"));
		private static TextBox endTimeHour = new TextBox("End time HH",
				By.xpath("//timepicker[@id='endTime']//input[@placeholder='MM']"));
		private static TextBox endTimeMinute = new TextBox("End time MM",
				By.xpath("//timepicker[@id='endTime']//input[@placeholder='HH']"));
		private static Element recurrenceDropdown = new Element("Recurrence dropdown",
				By.xpath("//app-create-edit-block-out//span[@id='select2-recurrence-container']"));

		private static Element selectRecurrenceOnDropdown(String recurrence) {
			return new Element(recurrence,
					By.xpath("//ul[@id='select2-recurrence-results']/li[text()=' " + recurrence + " ']"));
		}

		private static Button save = new Button("save",
				By.xpath("//app-create-edit-block-out//button[text()=' Book session ']"));

		public static void enterTitle(String title) {
			titleTextBox.setText(title);
		}

		public static void enterStartDate(String date) {
			startDate.setValueWithJavascript(date);
		}

		public static void enterEndDate(String date) {
			endDate.setValueWithJavascript(date);
		}

		public static void enterStartTime(String hour, String minute) {
			startTimeHour.setValueWithJavascript(hour);
			startTimeMinute.setValueWithJavascript(minute);
		}

		public static void enterEndTime(String hour, String minute) {
			endTimeHour.setValueWithJavascript(hour);
			endTimeMinute.setValueWithJavascript(minute);
		}

		public static void selectRecurrence(String recurrence) {
			recurrenceDropdown.click();
			DriverHandler.delay(1);
			selectRecurrenceOnDropdown(recurrence).click();
		}

		public static void clickSave() {
			save.click();
		}
	}
}
