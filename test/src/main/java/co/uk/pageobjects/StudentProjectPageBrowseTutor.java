package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Tab;
import co.uk.webelements.TextBox;

public class StudentProjectPageBrowseTutor {

	private static Tab browseTutorTabisActive = new Tab("Browse tutor",By.xpath("//a[@class='nav-link active' and text()=' Browse tutors ']"));
	private static TextBox searchTxtBox = new TextBox("Search",By.xpath("//input[@name='Search']"));
	
	public static void verifyBrowseTutorTabIsActive() {
		browseTutorTabisActive.verifyDisplayed();
	}
}
