package co.uk.testrunner;

import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;

import com.vimalselvam.cucumber.listener.Reporter;

import co.uk.core.DateUtilities;
import co.uk.core.DriverHandler;
import cucumber.api.CucumberOptions;
import cucumber.api.testng.AbstractTestNGCucumberTests;

@CucumberOptions(features = "src/test/java/co/uk/features", plugin = { "pretty", "html:target/cucumberHtmlReport",
		"html:target/cucumberHtmlReport", // html result
		"pretty:target/cucumber-json-report.json", // json result
		"com.vimalselvam.cucumber.listener.ExtentCucumberFormatter:target/extentreport/report.html" }, monochrome = true, glue = {
				"co.uk.stepdefinitions" }, tags = { "@Smoke" })

// tags = {"@Smoke"} - all @Smoke
// tags = {"@Regression"} - all @Regression
// tags = {"@Smoke,@Regression"} - all (@Smoke or @Regression)
// tags = {"@Smoke","@Regression"} - all (@Smoke and @Regression)
// tags = {"@Smoke","~@Regression"} - all (@Smoke but skip @Regression)
// tags = {"~@Smoke","~@Regression"} - all with no tags

public class SmokeTestRunner extends AbstractTestNGCucumberTests {

	@BeforeClass
	public static void beforeClass() {
		DriverHandler.timestamp = DateUtilities.getTimeStamp();
	}

	@AfterClass
	public static void afterClass() {
		// Reporter.loadXMLConfig(new
		// File(FileReaderManager.getInstance().getConfigReader().getReportConfigPath()));
		String reportConfigPath = System.getProperty("user.dir").replace("\\", "/")
				+ "/src/main/resources/Config/extent-config.xml";
		Reporter.loadXMLConfig(reportConfigPath);
		Reporter.setSystemInfo("User Name", System.getProperty("user.name"));
		Reporter.setSystemInfo("Time Zone", System.getProperty("user.timezone"));
	}

}