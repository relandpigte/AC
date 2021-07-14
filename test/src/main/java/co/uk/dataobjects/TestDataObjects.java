package co.uk.dataobjects;

import java.io.IOException;
import java.nio.file.Path;

import org.json.JSONException;
import org.json.JSONObject;

import co.uk.core.DriverHandler;
import co.uk.core.FileHandler;

public class TestDataObjects {

	private static Path jsonFile = Path.of(System.getProperty("user.dir").replace("\\", "/")
			+ "/src/main/resources/Data/" + DriverHandler.environment + "/TestData.json");

	private static JSONObject getObject() throws JSONException, InterruptedException, IOException {
		return new JSONObject(FileHandler.readFileContent(jsonFile));
	}

	public static String getUrl(String urlType) throws JSONException, InterruptedException, IOException {
		return getObject().getJSONObject("urls").getString(urlType);
	}

	public static String getUsername(String credentialType) throws JSONException, InterruptedException, IOException {
		return getObject().getJSONObject("credentials").getJSONObject(credentialType).getString("email");
	}

	public static String getPassword(String credentialType) throws JSONException, InterruptedException, IOException {
		return getObject().getJSONObject("credentials").getJSONObject(credentialType).getString("password");
	}
	
	public static String getphoneNumber(String data) throws JSONException, InterruptedException, IOException {
		return getObject().getJSONObject("phone").getString(data);
		
	}
	
}
