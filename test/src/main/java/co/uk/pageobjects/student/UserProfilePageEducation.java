package co.uk.pageobjects.student;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.Tab;
import co.uk.webelements.TextBox;

public class UserProfilePageEducation {

	private static Tab educationTabIsActive = new Tab("Education",By.xpath("//a[@class='nav-link active' and contains(text(),'Education')]"));
	private static Button addEducationBtn = new Button("Add education",By.xpath("//app-educations//a[contains(text(),'Add')]"));
	
	public static class AddEducationModal{
		
		private static Element addEducation = new Element("Add education modal",By.xpath("//app-create-edit-education//h4[contains(text(),'Add Education')]"));
		private static Element countryDropdown = new Element("Country dropdown",By.xpath("//span[@id='select2-CountryCode-container']"));
		private static Element selectCounrty(String country) {
			return new Element(country,By.xpath("//ul[@id='select2-CountryCode-results']/li[text()='"+country+"']"));
		}
		private static TextBox intstitution = new TextBox("Institution",By.xpath("//input[@id='UniversityName']"));
		private static TextBox city = new TextBox("City",By.xpath("//input[@id='City']"));
	}
}
