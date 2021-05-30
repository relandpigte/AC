package co.uk.pageobjects.student;

import java.nio.file.Path;

import org.openqa.selenium.By;

import co.uk.core.DriverHandler;
import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.TextBox;

public class UserProfilePageIntroduction {
		
	public static class About{
		
		private static Button edit = new Button("Edit",By.xpath("//app-about//button[contains(text(),'Edit')]"));
		private static Button save = new Button("Save",By.xpath("//app-about//span[contains(text(),'Save')]"));
		private static TextBox editor = new TextBox("Editor",By.xpath("//app-about//div[@class='ql-editor']"));
		private static TextBox aboutMessage = new TextBox("About message",By.xpath("//app-about//div[@class='ql-editor']/p"));
		
		public static void clickEdit() {
			edit.click();
		}
		
		public static void clickSave() {
			save.click();
		}
		
		public static void enterMessage(String message) {
			editor.setText(message);
		}
		
		public static void verifyAboutMessageIsEqual(String message) {
			aboutMessage.verifyTextEquals(message);
		}
	}	
}
