package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.CheckBox;
import co.uk.webelements.Element;
import co.uk.webelements.ListBox;
import co.uk.webelements.TextBox;

public class AccountSettingsPageGeneral {

	private static TextBox firstname = new TextBox("Firstname",By.xpath("//input[@id='name']"));
	private static TextBox lastname = new TextBox("Lastname",By.xpath("//input[@id='surname']"));
	private static TextBox dateofBirth = new TextBox("Date of Birth",By.xpath("//input[@id='dateOfBirth']"));
	private static Element phoneCountry = new Element("",By.xpath(""));
	private static TextBox phoneNumber = new TextBox("Phone Number",By.xpath("//input[@id='phone']"));
	private static TextBox email = new TextBox("Email",By.xpath("//input[@id='emailAddress']"));
	private static TextBox address1 = new TextBox("Address 1",By.xpath("//input[@id='AddressLine1']"));
	private static TextBox address2 = new TextBox("Address 2",By.xpath("//input[@id='AddressLine2']"));
	private static TextBox city = new TextBox("City",By.xpath("//input[@id='City']"));
	private static TextBox postcode = new TextBox("Zip/Postcode",By.xpath("//input[@id='ZipOrPostCode']"));
	private static TextBox state = new TextBox("State/Province",By.xpath("//input[@id='StateOrProvince']"));
	private static ListBox timezone = new ListBox("Timezone",By.xpath("//select[@id='TimeZone']"));
	private static ListBox country = new ListBox("Country",By.xpath("//select[@id='country']"));
	private static CheckBox studentprofile =new CheckBox("Student profile",By.xpath("//input[@id='isPublic']"));
}
