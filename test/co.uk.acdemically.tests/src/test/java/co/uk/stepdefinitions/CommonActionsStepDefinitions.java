package co.uk.stepdefinitions;

import java.io.IOException;

import co.uk.core.DriverHandler;
import co.uk.core.JmeterExecutor;
import co.uk.core.Log;
import co.uk.dataobjects.TestDataObjects;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class CommonActionsStepDefinitions {

    // API

    @Given("^previous run result for API test: \"(.*)\" is deleted$")
    public void deletePreviousTestResult(String testName) throws Exception {
        JmeterExecutor.deleteFileFromFolder(testName + ".txt");
        JmeterExecutor.deleteFileFromFolder(testName + ".xml");
        Log.testStep("PASSED", "Previous test result for " + testName + " is deleted");
    }

    @When("^user execute API test: \"(.*)\"$")
    public void executeApiTests(String testName) throws IOException {
        JmeterExecutor.ExecuteJmeterScript(testName + ".jmx");
        Log.testStep("PASSED", "Executed Api test: " + testName);
    }

    @Then("^user verify API test: \"(.*)\" passed$")
    public void verifyApiTestsPassed(String testName) throws IOException {
        JmeterExecutor.CheckFailureResults(testName + ".txt");
        JmeterExecutor.VerifyApiTestResultFile(testName + ".txt");
    }

    // UI

    @Given("^User is in academically login page$")
    public void navigateAcademically() throws Exception {
        DriverHandler.openBrowser();
        DriverHandler.navigateUrl(TestDataObjects.getUrl("UI"));
        DriverHandler.delay(17);
    }
    
    @Given("^page is refreshed$")
    public void refreshPage() throws Exception {
        DriverHandler.refreshPage();
    }

}