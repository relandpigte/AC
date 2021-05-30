package co.uk.testrunner;

import org.testng.annotations.DataProvider;

import io.cucumber.testng.CucumberOptions;

@CucumberOptions(features = "src/test/java/co/uk/features", plugin = { "pretty", "html:target/cucumberHtmlReport", "html:target/cucumberHtmlReport",
        "pretty:target/cucumber-json-report.json",
        "com.aventstack.extentreports.cucumber.adapter.ExtentCucumberAdapter:" }, monochrome = true, glue = { "co.uk.stepdefinitions" }, tags = "@UI")

public class RegressionTestRunner extends BaseTestRunner {

    @DataProvider(parallel = true)
    @Override
    public Object[][] scenarios() {
        return super.scenarios();
    }

}