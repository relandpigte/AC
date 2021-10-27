package co.uk.pageobjects;

import java.text.SimpleDateFormat;
import java.util.Calendar;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.Element;

public class CalendarCommonObjects {

	private static Element calendarDate(String date) {
		return new Element(date,By.xpath("//div[contains(@class,'bs-datepicker-container')]//span[@class='ng-star-inserted' and text()='"+date+"']"));
	}
	private static Button calendarNext = new Button("Calendar next",By.xpath("//div[contains(@class,'bs-datepicker-container')]//button[@class='next']"));
	private static Button calendarCurrentMonth(String month) {
		return new Button("Month",By.xpath("//div[contains(@class,'bs-datepicker-container')]//button[@class='current ng-star-inserted']/span[text()='"+month+"']"));
	}
	
	//div[contains(@class,'bs-datepicker-container')]//span[contains(@class,'selected')]//following::span[contains(@class,'is-other')]
		
	public static void selectDateOnModal(){
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
		//String incrementedDate = sdf.format(cal.getTime());
		//startDateElement.click();
		
		if(calendarCurrentMonth(currentMonth).equals(ThisMonth)) {
			calendarNext.click();
			calendarDate(date).click();
		}else if(calendarCurrentMonth(currentMonth).equals(ThisMonth)) {
			System.out.println(ThisMonth);
			calendarDate(date).click();
		}
		
	}
}
