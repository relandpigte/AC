package co.uk.testrunner;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.HashMap;
import java.util.Map;

import org.json.simple.JSONObject;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeSuite;

import co.uk.core.APIClient;
import co.uk.core.APIException;
import co.uk.core.DateUtilities;
import co.uk.core.DriverHandler;
import io.cucumber.testng.AbstractTestNGCucumberTests;

public class BaseTestRunner extends AbstractTestNGCucumberTests {

    public static APIClient loginToTestRail() {
        APIClient client = new APIClient("https://sourcecloud.testrail.io/");
        client.setUser("gil.matugas@sourcecloud.co.uk");
        client.setPassword("Freel@ncer_01");
        return client;
    }

    @SuppressWarnings({ "rawtypes", "unchecked", "deprecation" })
    @BeforeSuite
    public static void beforeClass() throws MalformedURLException, IOException, APIException {
        DriverHandler.timestamp = DateUtilities.getTimeStamp();
        if (DriverHandler.updateTestRailStatus.equalsIgnoreCase("true")) {
            Map data = new HashMap();
            data.put("suite_id", new Integer(173));
            data.put("name", "Automated Tests " + DateUtilities.getCurrentDate("MM/dd/yyyy") + " : Build Number " + DriverHandler.buildNumber);
            data.put("description",
                    "Automated Test Executed at " + DateUtilities.getCurrentDate("MM/dd/yyyy") + " : Build Number " + DriverHandler.buildNumber);
            data.put("include_all", true);
            JSONObject r = (JSONObject) loginToTestRail().sendPost("add_run/14", data);
            DriverHandler.runId1 = r.get("id").toString();
        }
    }

    @AfterSuite
    public static void afterClass() throws MalformedURLException, IOException, APIException {
        DriverHandler.delay(30);
        if (DriverHandler.updateTestRailStatus.equalsIgnoreCase("true")) {
            JSONObject r = (JSONObject) loginToTestRail().sendPost("add_attachment_to_run/" + DriverHandler.runId1,
                    System.getProperty("user.dir").replace("\\", "/") + "/test-output/PdfReport/ExtentPdf.pdf");
        }
    }

}
