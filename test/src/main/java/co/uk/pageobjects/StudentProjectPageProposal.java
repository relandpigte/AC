package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.core.DriverHandler;
import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.Tab;
import co.uk.webelements.TextBox;

public class StudentProjectPageProposal {

	private static Tab proposalTabIsActive = new Tab("Proposal",
			By.xpath("//a[@class='nav-link ng-star-inserted active' and contains(text(),'Proposals')]"));
	private static Button fullDetails = new Button("Full details", By.xpath("//button[text()= ' View offer ']"));

	public static void verifyProposalTabIsActive() {
		proposalTabIsActive.verifyDisplayed();
	}

	public static void clickFullDetails() {
		fullDetails.click();
	}

	public static class FullDetailsModal {

		private static Element fulldetailsModal = new Element("Full detail modal",
				By.xpath("//h4[contains(text(),'Offer')]"));
		private static Tab overview = new Tab("Overview", By.xpath("//a[@id='overview-tab']"));
		private static Tab bookSession = new Tab("Book session", By.xpath("//a[@id='book-session-tab']"));
		private static Button addSession = new Button("Add session",
				By.xpath("//div[@id='bookSession']//button[text()=' Add ']"));
		private static Button pay = new Button("Pay",By.xpath("//button[text()=' Pay ']"));
		
		public static void verifyFullDetailModalIsDisplayed() {
			fulldetailsModal.verifyDisplayed();
		}

		public static void clickOverViewTab() {
			overview.click();
		}

		public static void clickBookSessionTab() {
			bookSession.click();
		}

		public static void clickAddSession() {
			addSession.click();
		}
		
		public static void clickPay() {
			pay.click();
		}

		public static class BookingModal {
			private static Element projectIdDropdown = new Element("Project Id dropdown",
					By.xpath("//app-create-edit-booking//span[@id='select2-projectId-container']"));

			private static Element selectProjectIdOnDropdown(String projectId) {
				return new Element(projectId,
						By.xpath("//app-create-edit-booking//li[contains(@id,'projectId-result') and text()=' "
								+ projectId + " ']"));
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

			private static Button add = new Button("add",
					By.xpath("//app-create-edit-booking//button[text()=' Add ']"));

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

			public static void clickAdd() {
				add.click();
			}
		}
	}
}
