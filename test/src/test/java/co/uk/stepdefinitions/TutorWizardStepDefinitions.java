package co.uk.stepdefinitions;

import java.util.List;
import java.util.Map;

import co.uk.core.DriverHandler;
import co.uk.pageobjects.RegisterPage;
import co.uk.pageobjects.TutorWizardCommonObject;
import co.uk.pageobjects.TutorWizardPageAboutYou;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class TutorWizardStepDefinitions {

	@Then("^user is in tutor wizard page$")
	public void verifyTutorWizardIsDisplayed() {
		TutorWizardCommonObject.verifyTutorWizardIsDisplayed();
	}

	@When("^user adds about information$")
	public void enterAboutInformation(DataTable accountDetails) {
		DriverHandler.delay(5);
		List<Map<String, String>> data = accountDetails.asMaps(String.class, String.class);
		String firstname = data.get(0).get("Firstname".replace("XXX", DriverHandler.timestamp));
		String lastname = data.get(0).get("Lastname");
		String overview = data.get(0).get("Overview");

		if (!firstname.equals("null")) {
			TutorWizardPageAboutYou.enterFirstname(firstname.replace("XXX", DriverHandler.timestamp));
		}

		if (!lastname.equals("null")) {
			TutorWizardPageAboutYou.enterLastName(lastname);
		}

		if (!overview.equals("null")) {
			TutorWizardPageAboutYou.enterProfessionalOverview(overview);
			DriverHandler.delay(2);
		}
	}

	@When("^user next to education$")
	public void nextToEducation() {
		TutorWizardPageAboutYou.clickNext();
	}
}


