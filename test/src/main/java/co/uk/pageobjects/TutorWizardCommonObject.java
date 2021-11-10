package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.Tab;

public class TutorWizardCommonObject {

	private static Element tutorWizard = new Element("Tutor wizard",By.xpath("//app-tutor-wizard//h1[text()='Tutor Wizard']"));
	private static Element successfulyDeletedMesssage = new Element("Successfuly deleted message",By.xpath("//span[text()='Successfully Deleted']"));
	
	public static void verifySuccesfulyDeletedMessageIsDisplayed() {
		successfulyDeletedMesssage.verifyDisplayed();
	}
	
	public static void verifyTutorWizardIsDisplayed() {
		tutorWizard.verifyDisplayed();
	}
	
    public static class ConfirmationModal {

        private static Element confirmationModalIsDisplayed = new Element("Confirmation modal",
                By.xpath("//div[@class='swal2-header']//h2[text()='Are you sure?']"));
        private static Button yes = new Button("Yes",
                By.xpath("//div[@class='swal2-header']//h2[text()='Are you sure?']//following::button[text()='Yes']"));
        private static Button cancel = new Button("Cancel",
                By.xpath("//div[@class='swal2-header']//h2[text()='Are you sure?']//following::button[text()='Cancel']"));

        public static void verifyConfirmationModalIsDisplayed() {
            confirmationModalIsDisplayed.verifyDisplayed();
        }

        public static void clickYes() {
            yes.click();
        }

        public static void clickCancel() {
            cancel.click();
        }
    }
    
}
