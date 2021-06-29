package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.core.DriverHandler;
import co.uk.webelements.Button;
import co.uk.webelements.CheckBox;
import co.uk.webelements.TextBox;

public class TutorWizardPageDBScheck {
	
	private static CheckBox dbsRequired = new CheckBox("DBS",By.xpath("//app-dbs-check//input[@id='isDbsRequired']"));
	private static Button skip = new Button("Skip",By.xpath("//button[contains(text(),'Skip')]"));
	private static Button next = new Button("Next",By.xpath("//button[contains(text(),'Next')]"));
	private static TextBox dbsNumberTextBox = new TextBox("DBS number",By.xpath("//app-dbs-check//input[@id='dbsNumber']"));
	private static TextBox dateOfIssue = new TextBox("Date of issue",By.xpath("//app-dbs-check//input[@id='dateOfIssue']"));
	private static CheckBox dbsAgree = new CheckBox("DBS aggre",By.xpath("//app-dbs-check//input[@id='isDbsCheckAgreed']"));
	private static TextBox documentuploader = new TextBox("File",By.xpath("//app-dbs-check//input[@id='DocumentUploader']"));
	
	public static void uploadProfilePhoto(String filePath) {
		documentuploader.uploadFile(filePath);
	    DriverHandler.delay(5);
	}
	
	public static void enterDBSnumber(String DBSnumber) {
		dbsNumberTextBox.setText(DBSnumber);
	}
	
	public static void enterDateOfIssue(String date) {
		dateOfIssue.setValueWithJavascript(date);
	}
	
	public static void enableDBSAgree() {
		if(!dbsAgree.isSelected()) {
			dbsAgree.click();
		}
	}
	
	public static void disableDBSAgree() {
		if(dbsAgree.isSelected()) {
			dbsAgree.click();
		}
	}
	
	public static void enableDBS() {
		if(!dbsRequired.isSelected()) {
			dbsRequired.click();
		}
	}
	
	public static void disableDBS() {
		if(dbsRequired.isSelected()) {
			dbsRequired.click();
		}
	}
	
	public static void clickSkip() {
		skip.click();
	}
	
	public static void clickNext() {
		next.click();
	}
}
