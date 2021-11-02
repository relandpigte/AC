package co.uk.pageobjects;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.openqa.selenium.By;

import co.uk.core.DriverHandler;
import co.uk.webelements.Button;
import co.uk.webelements.CheckBox;
import co.uk.webelements.Element;
import co.uk.webelements.Link;
import co.uk.webelements.Tab;
import co.uk.webelements.TextBox;

public class StudentProjectPageProposal {
	
	public static void main(String[] args) {
		    SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
			Calendar cal = Calendar.getInstance();
			System.out.println("Current Date: "+sdf.format(cal.getTime()));
			if (cal.get(Calendar.DAY_OF_WEEK) == Calendar.FRIDAY) {
		        cal.add(Calendar.DATE, 3);
		    } else if(cal.get(Calendar.DAY_OF_WEEK) == Calendar.SATURDAY) {
		    	 cal.add(Calendar.DATE, 2);
		    }
			else {
		        cal.add(Calendar.DATE, 1);
		    }
			//Date after adding one day to the current date
			String newDate = sdf.format(cal.getTime());  
			//Displaying the new Date after addition of 1 Day
			System.out.println("Incremnted current date by one: "+newDate);
		 
		// System.out.println(currentDateString);
	}
	
	private static Tab proposalTabIsActive = new Tab("Proposal",
			By.xpath("//a[@class='nav-link ng-star-inserted active' and contains(text(),'Proposals')]"));
	private static Button delete = new Button ("Delete",By.xpath("//button[text()=' Delete ']"));
	private static Button fullDetails(String tutorName) {
		return new Button("Full details", By.xpath("//a[contains(text(),'"+tutorName+"')]/following::button[text()=' View offer '][1]"));
	}
	private static Element tutorName(String name) {
		return new Element(name,By.xpath("//a[contains(text(),'"+name+"')]"));
	}
	
	public static void clickDelete() {
		delete.click();
	}
	
	public static void verifyTutorNameIsDisplayed(String name) {
		tutorName(name).verifyDisplayed();
	}
	
	public static void verifyProposalTabIsActive() {
		proposalTabIsActive.verifyDisplayed();
	}

	public static void clickFullDetails(String tutorName) {
		fullDetails(tutorName).click();
	}
	
	public static class DeleteConfirmationModal{
		private static Button yes = new Button("Yes",By.xpath("//button[text()='Yes']"));
		private static Button cancel = new Button("Cancel",By.xpath("//button[text()='Cancel']"));
		
		public static void clickYesButton() {
			yes.click();
		}
		
		public static void clickCancelButton() {
			cancel.click();
		}
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
			private static Element bookingModal = new Element("Booking modal",By.xpath("//app-create-edit-booking"));
			private static Element projectIdDropdown = new Element("Project Id dropdown",
					By.xpath("//app-create-edit-booking//span[@id='select2-projectId-container']"));

			private static Element selectProjectIdOnDropdown(String projectId) {
				return new Element(projectId,
						By.xpath("//app-create-edit-booking//li[contains(@id,'projectId-result') and text()=' "
								+ projectId + " ']"));
			}
			
			private static TextBox titleTextBox = new TextBox("Title",
					By.xpath("//app-create-edit-booking//input[@id='title']"));
			private static Element calendarDate(String date) {
				return new Element(date,By.xpath("//div[contains(@class,'bs-datepicker-container')]//span[@class='ng-star-inserted' and text()='"+date+"']/parent::td"));
			}
			private static Button calendarNext = new Button("Calendar next",By.xpath("//div[contains(@class,'bs-datepicker-container')]//button[@class='next']"));
			private static Button calendarCurrentMonth(String month) {
				return new Button("Month",By.xpath("//div[contains(@class,'bs-datepicker-container')]//button[@class='current ng-star-inserted']/span[text()='"+month+"']"));
			}
			private static TextBox startDate = new TextBox("Start Date",
					By.xpath("//app-create-edit-booking//input[@id='startTimeDate']"));
			private static Element startDateElement = new Element("Start Date",
					By.xpath("//app-create-edit-booking//input[@id='startTimeDate']"));
			private static TextBox endDate = new TextBox("End Date",
					By.xpath("//app-create-edit-booking//input[@id='endTimeDate']"));
			private static Element endDateElement = new Element("End Date",
					By.xpath("//app-create-edit-booking//input[@id='endTimeDate']"));
			private static TextBox startTimeHour = new TextBox("Start time HH",
					By.xpath("//timepicker[@id='startTime']//input[@placeholder='HH']"));
			
			private static Button startTimedayNight(String amORpm) {
				return new Button("Start time: "+amORpm,By.xpath("//timepicker[@id='startTime']//button[text()='"+amORpm+" ']"));
			}
			private static Button endTimedayNight(String amORpm) {
				return new Button("Start time: "+amORpm,By.xpath("//timepicker[@id='endTime']//button[text()='"+amORpm+" ']"));
			}
			private static TextBox startTimeMinute = new TextBox("Start time MM",
					By.xpath("//timepicker[@id='startTime']//input[@placeholder='MM']"));
		
			private static TextBox endTimeHour = new TextBox("End time HH",
					By.xpath("//timepicker[@id='endTime']//input[@placeholder='HH']"));
			
			private static Button arrowUpStartTimeHour = new Button("Arrow up start time",By.xpath("//timepicker[@id='startTime']//tr[1]/td[1]/a"));
			private static Button arrowUpEndTimeHour = new Button("Arrow up end time",By.xpath("//timepicker[@id='endTime']//tr[1]/td[1]/a"));
			private static TextBox endTimeMinute = new TextBox("End time MM",
					By.xpath("//timepicker[@id='endTime']//input[@placeholder='MM']"));
			private static Element durationLabel = new Element("Duration label",By.xpath("//label[text()='Duration: ']"));
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
			
			public static void clickStartTimeToAM() {
				if(!startTimedayNight("AM").isDisplayed()) {
					startTimedayNight("PM").click();
				}
			}

			public static void clickStartTimeToPM() {
				if(!startTimedayNight("PM").isDisplayed()) {
					startTimedayNight("AM").click();
				}
			}
			
			public static void clickEndTimeToAM() {
				if(!endTimedayNight("AM").isDisplayed()) {
					endTimedayNight("PM").click();
				}
			}

			public static void clickEndTimeToPM() {
				if(!endTimedayNight("PM").isDisplayed()) {
					endTimedayNight("AM").click();
				}
			}
			
			public static void enterTitle(String title) {
				titleTextBox.setText(title);
			}

			public static void enterStartDate(String date) {
				startDate.setValueWithJavascript(date);
			}
			
			public static void selectDateExceptWeekends() {
				 //SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
				SimpleDateFormat monthFormat = new SimpleDateFormat("MMMM");
				SimpleDateFormat sdf = new SimpleDateFormat("dd");
				Calendar cal = Calendar.getInstance();
				String currentMonth = monthFormat.format(cal.getTime());

				System.out.println("Current Date: "+sdf.format(cal.getTime()));
				if (cal.get(Calendar.DAY_OF_WEEK) == Calendar.FRIDAY) {
			        cal.add(Calendar.DATE, 3);
			    } else if(cal.get(Calendar.DAY_OF_WEEK) == Calendar.SATURDAY) {
			    	 cal.add(Calendar.DATE, 2);
			    }
				else {
			        cal.add(Calendar.DATE, 1);
			    }
				
				String ThisMonth = monthFormat.format(cal.getTime()); 
				String date = sdf.format(cal.getTime());
				System.out.println("Selected Date: "+ date);
				if(!currentMonth.equals(ThisMonth)) {
					calendarNext.click();
					DriverHandler.delay(2);
					calendarDate(date).hoverElement();
					calendarDate(date).doubleClick();
				}else {
					DriverHandler.delay(2);
					calendarDate(date).hoverElement();
					calendarDate(date).doubleClick();
				}
			}
			
			public static void incrementTheCurrentDateExceptWeekendsStartDate() {
				//startDateElement.click();
				DriverHandler.delay(1);
				//calendarDate("21").hoverElement();
				startDate.setValueWithJavascript("21/11/2021");
				//selectDateExceptWeekends();
				DriverHandler.delay(2);
			}
			
			public static void incrementTheCurrentDateExceptWeekendsEndDate() {
				//endDateElement.click();
				DriverHandler.delay(1);
			
				//selectDateExceptWeekends();
				//calendarDate("21").clickFromHover();
				//calendarDate("21").clickJS();
				DriverHandler.delay(2);
			}
			

			public static void verifyBookingModalIsDisplayed() {
				bookingModal.verifyDisplayed();
			}
			
			public static void enterEndDate(String date) {
				endDate.setValueWithJavascript(date);
			}

			public static void enterStartTimeHour(String hour) {
				startTimeHour.setText(hour);
				durationLabel.click();
			}
			
			public static void enterStartTimeMinute(String minute) {
				startTimeMinute.setValueWithJavascript(minute);
				durationLabel.click();
			}
			
			public static void clickArrowUpStartTimeHour(String value) {
				int count = Integer.parseInt(value);  
				for (int i = 1; i <= count; i++) {
					arrowUpStartTimeHour.click();
					DriverHandler.delay(1);
					}			
			}
			
			public static void clickArrowUpEndTimeHour(String value) {
				int count = Integer.parseInt(value);  
				for (int i = 1; i <= count; i++) {
					arrowUpEndTimeHour.click();
					DriverHandler.delay(1);
					}		
			}
			
			public static void enterEndHour(String hour) {			
				endTimeHour.setText(hour);
				durationLabel.click();
			}
			
			public static void enterEndMinute(String minute) {
				endTimeMinute.setValueWithJavascript(minute);
				durationLabel.click();
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
