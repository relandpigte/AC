package co.uk.pageobjects;

import java.text.SimpleDateFormat;
import java.util.Calendar;

import org.openqa.selenium.By;

import co.uk.core.DriverHandler;
import co.uk.webelements.Button;
import co.uk.webelements.CheckBox;
import co.uk.webelements.Element;
import co.uk.webelements.TextBox;

public class StudentProjectCreationPage {

	private static Element servicePage = new Element("Services page",By.xpath("//app-create-project//h1[contains(text(),'Create a New Project')]"));
	private static Button requestSupport = new Button("Request",By.xpath("//app-create-project//a[contains(text(),'Request Support')]"));
	
	public static void verifyServicePageisDisplayed() {
		servicePage.verifyDisplayed();
	}
	
	public static void clickRequestSupport() {
		requestSupport.click();
	}
	
	public static class Step1{
		
		private static Element services(String service) {
			return new Element(service+" Service",By.xpath("//label[contains(text(),'"+service+"')]/parent::div"));
		}
		private static Button continueBtn = new Button("Continue",By.xpath("//button[contains(text(),'Continue')]"));
		private static Button cancel = new Button("Cancel",By.xpath("//button[contains(text(),'Cancel')]"));
		
		public static void verifyServiceIsDisplayed(String service) {
			services(service).verifyDisplayed();
		}
		
		public static void clickService(String service) {
			services(service).click();
		}
		
		public static void clickContinue() {
			continueBtn.click();
		}
		
		public static void clickCancel() {
			cancel.click();
		}
	}
	
	public static class Steps2{
		
		private static Element page2 = new Element("Page 2",By.xpath("//div[contains(@class,'justify-content-between')]//p[contains(text(),'Step 2 Of 4')]"));
		private static Element serviceLevel(String level) {
			return new Element(level+" level",By.xpath("//label[text()='"+level+"']/parent::div"));
		}
		
		private static Button continueBtn = new Button("Continue",By.xpath("//button[contains(text(),'Continue')]"));
		private static Button backBtn = new Button("Cancel",By.xpath("//button[contains(text(),'Back')]"));
		
		public static void verifyServiceIsDisplayed(String level) {
			serviceLevel(level).verifyDisplayed();
		}
		
		public static void clickServiceLevel(String level) {
			serviceLevel(level).click();
		}
		
		public static void clickContinue() {
			continueBtn.click();
		}
		
		public static void clickBack() {
			backBtn.click();
		}
		
		public static void verifyPage2IsDisplayed() {
			page2.verifyDisplayed();
		}
	}
	
	public static class Step3{
		
		private static Element page3 = new Element("Page 3",By.xpath("//div[contains(@class,'justify-content-between')]//p[contains(text(),'Step 3 Of 4')]"));
		private static Element service(String service) {
			return new Element(service,By.xpath("//label/h3[text()='"+service+"']"));
		}
		private static Button continueBtn = new Button("Continue",By.xpath("//button[contains(text(),'Continue')]"));
		private static Button backBtn = new Button("Cancel",By.xpath("//button[contains(text(),'Back')]"));
		
		public static void clickContinue() {
			continueBtn.click();
		}
		
		public static void clickBack() {
			backBtn.click();
		}
		public static void clickService(String serviceOption) {
			service(serviceOption).click();
		}
		
		public static void VerifyServiceIsDisplayed(String serviceOption) {
			service(serviceOption).verifyDisplayed();
		}
		
		public static void verifyPage3IsDisplayed() {
			page3.verifyDisplayed();
		}
		
	}
	
	public static class Step4{
		
		private static Element page4 = new Element("Page 4",By.xpath("//div[contains(@class,'justify-content-between')]//p[contains(text(),'Step 4 Of 4')]"));
		private static TextBox projectNameTxtBox = new TextBox("Project name",By.xpath("//input[@id='ProjectName']"));
		private static TextBox descriptionTxtBx = new TextBox("Description",By.xpath("//textarea[@id='Description']"));
		private static Element academicLevelDrpdwn = new Element("Academic level dropdown",By.xpath("//span[contains(@aria-labelledby,'AcademicLevel')]"));
		private static Element academicLevelOption(String level) {
			return new Element("Academic level: "+level,By.xpath("//ul[contains(@id,'AcademicLevel-results')]/li[text()=' "+level+" ']"));
		}
		private static Element qualificationDrpdwn = new Element("Qualification dropdown",By.xpath("//span[contains(@aria-labelledby,'Qualification')]"));
		private static Element qualificationOption(String qualification) {
			return new Element("Qualification: "+qualification,By.xpath("//ul[contains(@id,'Qualification-result')]/li[text()=' "+qualification+" ']"));
		}
		private static Element methodologyDrpdwn = new Element("Methodology dropdown",By.xpath("//span[@id='select2-Methodology-container']"));
		private static Element methodologyOption(String methodology) {
			return new Element ("Methodology: "+methodology,By.xpath("//ul[contains(@id,'Methodology-result')]/li[text()=' "+methodology+" ']"));
		}
		
		private static Element subjectAreaDrpdwn = new Element("Subject area",By.xpath("//span[contains(@aria-labelledby,'SubjectArea')]"));
		private static Element subjectAreaOption(String subjectArea) {
			return new Element ("Subject area: "+ subjectArea,By.xpath("//ul[contains(@id,'SubjectArea-result')]/li[text()=' "+subjectArea+" ']"));
		}
		private static TextBox subjectKeywordTxtBox = new TextBox("Subject keyword",By.xpath("//input[@id='SubjectKeywords']"));
		private static Element urgencyDrpdwn = new Element("Urgency",By.xpath("//span[contains(@aria-labelledby,'urgency')]"));
		private static Element urgencyOption(String urgency) {
			return new Element ("Urgency: "+ urgency,By.xpath("//ul[contains(@id,'urgencyLevel-result')]/li[text()=' "+urgency+" ']"));
		}
		
		private static TextBox deadlineTxtBox = new TextBox("Deadline",By.xpath("//input[@id='Deadline']"));
		
		private static Button addAvailability = new Button("Add availability",By.xpath("//h4[text()='Availability']/following::a[text()=' Add ']"));
		
		private static Element availabilityTime(String day,String time) {
			return new Element(day+": "+time,By.xpath("//time[contains(text(),'"+time+"')]/preceding::th[text()='"+day+"']"));
		}
		//th[text()='"+day+"']/following::time[text()=' "+time+" '][1]
		////time[text()=' 06:00 AM - 11:00 AM ']/preceding::tr/th[text()='Monday']
		private static Button createBtn = new Button("Continue",By.xpath("//button[contains(text(),'Create')]"));
		private static Button backBtn = new Button("Cancel",By.xpath("//button[contains(text(),'Back')]"));
		private static Element availabilityModal = new Element("Availability modal",By.xpath("//app-create-edit-availability"));
		
		public static void verifyAvailabilityIsCorrect(String day,String time) {
			DriverHandler.delay(4);
			availabilityTime(day,time).verifyDisplayed();
		}
		
		public static void clickAddAvailability() {
			addAvailability.click();
			if(!availabilityModal.isDisplayed()) {
				addAvailability.click();
			}
		}
		
		public static void clickCreate() {
			createBtn.click();
		}
		public static void main(String[] args) {
	//		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
	//		Calendar cal = Calendar.getInstance();
	//		System.out.println("Current Date: "+sdf.format(cal.getTime()));
	//		if (cal.get(Calendar.DAY_OF_WEEK) == Calendar.FRIDAY) {
	//	        cal.add(Calendar.DATE, 3);
	//	    } else if(cal.get(Calendar.DAY_OF_WEEK) == Calendar.SATURDAY) {
	//	    	 cal.add(Calendar.DATE, 2);
	//	    }
	//		else {
	//	        cal.add(Calendar.DATE, 1);
	//	    }
	//		
	//	
	//		String date = sdf.format(cal.getTime());
	//		System.out.println("Selected Date: "+ date);
			dateExceptWeekends();
		}
		
		public static String dateExceptWeekends() {
			SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
			Calendar cal = Calendar.getInstance();
			if (cal.get(Calendar.DAY_OF_WEEK) == Calendar.FRIDAY) {
		        cal.add(Calendar.DATE, 3);
		    } else if(cal.get(Calendar.DAY_OF_WEEK) == Calendar.SATURDAY) {
		    	 cal.add(Calendar.DATE, 2);
		    }
			else {
		        cal.add(Calendar.DATE, 1);
		    }
			
			String date = sdf.format(cal.getTime());
			return date;
		}

		public static void selectDeadlineDateExceptWeekends() {
			deadlineTxtBox.setTextAndEnter(dateExceptWeekends());
		}
		
		public static void enterDeadline(String deadline) {
			deadlineTxtBox.setTextAndEnter(deadline);
		}
		
		public static void enterDescription(String description) {
			descriptionTxtBx.setText(description);
		}
		
		public static void selectAcademicLevel(String academicLevel) {
			academicLevelDrpdwn.click();
			academicLevelOption(academicLevel).click();
		}
		
		public static void selectMethodology(String methodology) {
			methodologyDrpdwn.click();
			if(!methodologyOption(methodology).isDisplayed()) {
				methodologyDrpdwn.click();
			}
			methodologyOption(methodology).clickFromHover();		
		}
		
		public static void selectQualification(String qualification) {
			qualificationDrpdwn.click();
			DriverHandler.delay(1);
			qualificationOption(qualification).click();
		}
		
		public static void selectUrgencyLevel(String urgencyLevel) {
			urgencyDrpdwn.click();
			if(!urgencyOption(urgencyLevel).isDisplayed()) {
				urgencyDrpdwn.click();
			}
			urgencyOption(urgencyLevel).click();
		}
		
		public static void selectSubjectArea(String subjectArea) {
			subjectAreaDrpdwn.click();
			if(!subjectAreaOption(subjectArea).isDisplayed()) {
				subjectAreaDrpdwn.click();
			}
			subjectAreaOption(subjectArea).click();	
		}
		
		public static void enterSubjectKeyword(String subjectKeyword) {
			subjectKeywordTxtBox.setTextAndEnter(subjectKeyword);
		}
		
		public static void clickBack() {
			backBtn.click();
		}
		
		public static void verifyPrjectNameTextBoxIsDisplayed() {
			projectNameTxtBox.verifyDisplayed();
		}
		
		public static void enterProjectName(String project) {
			projectNameTxtBox.setText(project);
		}
		
		public static void verifyPage4IsDisplayed() {
			page4.verifyDisplayed();
		}
		
		public static class AvailabilityModal{
			private static Element availabilityOption(String option) {
				return new Element(option,By.xpath("//label[text()=' "+option+" ']/parent::div"));
			}
			private static CheckBox day(String day) {
				return new CheckBox(day,By.xpath("//label[text()='"+day+"']/preceding::input[@class='form-check-input']"));
			}
			private static TextBox startTimeHour = new TextBox("Start time hour",By.xpath("//timepicker[@id='startTime']//input[@placeholder='HH']"));
			private static TextBox startTimeMinute = new TextBox("Start time minute",By.xpath("//timepicker[@id='startTime']//input[@placeholder='MM']"));
			private static Button startTimeMeridiem(String AmOrPM) {
				return new Button("Start meridiem: "+AmOrPM,By.xpath("//timepicker[@id='startTime']//button[text()='"+AmOrPM+" ']"));
			}
			private static TextBox endTimeHour = new TextBox("End time hour",By.xpath("//timepicker[@id='endTime']//input[@placeholder='HH']"));
			private static TextBox endTimeMinute = new TextBox("End time minute",By.xpath("//timepicker[@id='endTime']//input[@placeholder='MM']"));
			private static Button endTimeMeridiem(String AmOrPM) {
				return new Button("Start meridiem: "+AmOrPM,By.xpath("//timepicker[@id='endTime']//button[text()='"+AmOrPM+" ']"));
			}
			private static Button saveBtn = new Button ("Save",By.xpath("//button[text()=' Save ']"));
			public static void verifyAvailabilityModalIsDisplayed() {
				availabilityModal.verifyDisplayed();
			}
			public static void clickAvailability(String option) {
				availabilityOption(option).click();
			}

			public static void clickSave() {
				saveBtn.click();
			}	
		}
	}
}
