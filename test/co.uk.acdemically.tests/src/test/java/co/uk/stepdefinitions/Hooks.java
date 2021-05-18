package co.uk.stepdefinitions;

import co.uk.core.DriverHandler;
import co.uk.core.Screenshot;
import cucumber.api.Scenario;
import cucumber.api.java.After;
import cucumber.api.java.Before;

public class Hooks {

	@Before
	public void startTest(Scenario scenario) throws Exception {
		DriverHandler.scenario.set(scenario);
	}

	@After
	public void endTest(Scenario scenario) throws Exception {
//		if (scenario.isFailed() && DriverHandler.isDriverPresent()) {
		if (DriverHandler.isDriverPresent()) {
			Screenshot.capture(scenario.getName().replaceAll(" ", "_"));
		}
		DriverHandler.closeBrowser();
	}

}
