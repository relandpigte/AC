package co.uk.stepdefinitions;

import java.util.HashMap;
import java.util.Map;

import org.json.simple.JSONObject;

import co.uk.core.APIClient;
import co.uk.core.DriverHandler;
import co.uk.core.Screenshot;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;

public class Hooks {

    private static final int FAIL_STATE = 5;
    private static final int SUCCESS_STATE = 1;
    private static final String SUCCESS_COMMENT = "Automated test PASSED";
    private static final String FAILED_COMMENT = "Automated test FAILED";
    private static String runId = "";

    @Before
    public void startTest(Scenario scenario) throws Exception {
        DriverHandler.scenario.set(scenario);
    }

    @SuppressWarnings({ "unused", "unchecked", "rawtypes" })
    @After
    public void endTest(Scenario scenario) throws Exception {
        APIClient client = new APIClient("https://sourcecloud.testrail.io/");
        client.setUser("gil.matugas@sourcecloud.co.uk");
        client.setPassword("Freel@ncer_01");
        Map data = new HashMap();
        if (DriverHandler.isDriverPresent()) {
            Screenshot.capture(scenario.getName().replaceAll(" ", "_").replaceAll("-", "_").replaceAll("___", "_").replaceAll("__", "_"));
        }
        DriverHandler.closeBrowser();
        String caseId = "";
        for (String s : scenario.getSourceTagNames()) {
            if (s.contains("TestRail")) {
                String[] res = s.split("(\\(.*?)");
                caseId = res[1].substring(0, res[1].length() - 1); // Removing the last parenthesis
            }
            if (s.contains("UI")) {
                runId = DriverHandler.runId1;
            }
        }
        if (DriverHandler.updateTestRailStatus.equalsIgnoreCase("true")) {
            if (!scenario.isFailed()) {
                data.put("status_id", SUCCESS_STATE);
                data.put("comment", SUCCESS_COMMENT);
                JSONObject r = (JSONObject) client.sendPost("add_result_for_case/" + runId + "/" + caseId, data);

            } else {
                data.put("status_id", FAIL_STATE);
                data.put("comment", FAILED_COMMENT);
                JSONObject r = (JSONObject) client.sendPost("add_result_for_case/" + runId + "/" + caseId, data);
            }
        }
    }

}
