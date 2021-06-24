package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Tab;

public class AccountSettingsPageCommonObjects {

	private static Tab general = new Tab("General",By.xpath("//a[contains(@class,'nav-link') and contains(text(),'General')]"));
	private static Tab billing = new Tab("Billing",By.xpath("//a[contains(@class,'nav-link') and contains(text(),'Billing')]"));
	private static Tab security = new Tab("Security",By.xpath("//a[contains(@class,'nav-link') and contains(text(),'Security')]"));
	private static Tab notification = new Tab("Notification",By.xpath("//a[contains(@class,'nav-link') and contains(text(),'Notifications')]"));
	
	public static void clickGeneralTab() {
		general.click();
	}
	
	public static void clickBillingTab() {
		billing.click();
	}
	
	public static void clickSecurityTab() {
		security.click();
	}
	
	public static void clickNotificationTab() {
		notification.click();
	}
}
