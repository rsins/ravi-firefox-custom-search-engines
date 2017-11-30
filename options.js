// Does not always match to the number of rows in preference table.
// This is to help with id tags of elements.
let preferenceRowCount = 0;

function saveOptions(e) {
  e.preventDefault();
  deletePreferenceRow();

  var inputError = {
  	  hasAtLeastOneError: false,
      displayMessage: "Errors:<br>",
  	  hasMissingData: false,
  	  hasDuplicateKey: false,
  	  hasInvalidKey: false,
  	  hasInvalidUrlProtocol: false,
  	  hasInvalidUrlSearchParam: false
  };
  var prefJson = {};
  // Prepare data for saving and also do validations.
  for (var count = 1; count <= preferenceRowCount; count++) {
    var c1 = document.querySelector("#F" + count + "1");
    var c2 = document.querySelector("#F" + count + "2");
    var c3 = document.querySelector("#F" + count + "3");
    var c4 = document.querySelector("#F" + count + "4");

	if (c1 == null || c2 == null || c3 == null || c4 == null) continue;
    
	// Clear color highlights
    c1.style["background-color"] = "";
    c2.style["background-color"] = "";
    c3.style["background-color"] = "";
    c4.style["background-color"] = "";

    // Corner case
    if (preferenceRowCount == 1 && c1.value.trim() == "" || c2.value.trim() == "" || c3.value.trim() == "" || c4.value.trim() == "") {
       // Do nothing.
       console.log("One input row but no data to save.");
    }
    // Check empty fields.
    else if (c1.value.trim() == "" || c2.value.trim() == "" || c3.value.trim() == "") {
      c1.style["background-color"] = "#ffcccc";
      c2.style["background-color"] = "#ffcccc";
      c3.style["background-color"] = "#ffcccc";
      if (! inputError.hasMissingData) {
        inputError.hasAtLeastOneError = true;
        inputError.hasMissingData = true;
        inputError.displayMessage += "<span style='color: #ffcccc'>* All mandatory details should be provided.</span><br>";
      }

    }
    // Check invalid search keys
    else if (c1.value.trim().includes(" ")) {
      c1.style["background-color"] = "#42f4b9";
      if (! inputError.hasInvalidKey) {
        inputError.hasAtLeastOneError = true;
        inputError.hasInvalidKey = true;
        inputError.displayMessage += "<span style='color: #42f4b9'>* Search Key cannot include space.</span><br>";
      }
    }
    // Check duplicate search keys
    else if (prefJson.hasOwnProperty(c1.value.trim())) {
      c1.style["background-color"] = "#dbccff";
      if (! inputError.hasDuplicateKey) {
        inputError.hasAtLeastOneError = true;
        inputError.hasDuplicateKey = true;
        inputError.displayMessage += "<span style='color: #dbccff'>* Duplicate search key.</span><br>";
      }
    }
    // Check url protocol
    else if (! c3.value.trim().startsWith("http://") && ! c3.value.trim().startsWith("https://")) {
      c3.style["background-color"] = "#fbccff";
      if (! inputError.hasInvalidUrlProtocol) {
        inputError.hasAtLeastOneError = true;
        inputError.hasInvalidUrlProtocol = true;
        inputError.displayMessage += "<span style='color: #fbccff'>* URL should start with 'http://' or 'https://'.</span><br>";
      }
    }
    // Check url search parameter
    else if (! c3.value.trim().includes(SEARCH_TEXT_PLACEHOLDER)) {
      c3.style["background-color"] = "#ccd2ff";
      if (! inputError.hasInvalidUrlSearchParam) {
        inputError.hasAtLeastOneError = true;
        inputError.hasInvalidUrlSearchParam = true;
        inputError.displayMessage += "<span style='color: #ccd2ff'>* URL should have " + SEARCH_TEXT_PLACEHOLDER + " somewhere in the search url for query text placeholder.</span><br>";
      }
    }
    else {
      var key = c1.value.trim();
      var name = c2.value.trim();
      var url = c3.value.trim();
      var desc = c4.value.trim();
      prefJson[key] = {
      	  "name": name,
      	  "url": url,
      	  "description": desc
      };
    }
  }
  if (inputError.hasAtLeastOneError) {
    displayMessage(inputError.displayMessage, true);
    return;
  }

  var prefStorageObj = {};
  prefStorageObj[SEARCH_PREFERENCE_KEY] = prefJson;
  browser.storage.local.set(prefStorageObj);
 
  // Get to background.js and run the load data function for the updated data.
  let backgroundPage = browser.extension.getBackgroundPage();
  backgroundPage.pluginLoadData();

  restoreOptions();
  displayMessage("Preferences Saved!");
}

function deletePreferenceRow() {
  for (var count = 1; count <= preferenceRowCount; count++) {
    var chkBox = document.querySelector("#F" + count + "0");
    if (chkBox && chkBox.checked) {
      var rowElement = chkBox.parentElement.parentElement;
      rowElement.parentElement.removeChild(rowElement);
    }
  }

  resetFields();
  displayMessage("Row(s) deleted.");

  // Check if there are any preference row existing or not.
  var hasRow = false;
  for (var count = 1; count <= preferenceRowCount && hasRow == false; count++) {
    var chkBox = document.querySelector("#F" + count + "0");
    if (chkBox) hasRow = true;
  }
  if (! hasRow) parseAndShowCurrentData({});
}

function addPreferenceRow() {
  resetFields();
  var tabRef = document.querySelector("#preftbody");
  var newRow = tabRef.insertRow(tabRef.rows.length);
  preferenceRowCount += 1;
  newRow.innerHTML = "<td><input id='F" + preferenceRowCount + "0' type='checkbox'/></td><td><input type='text' id='F" + preferenceRowCount + "1'/></td><td><input type='text' id='F" + preferenceRowCount + "2'/></td><td><input type='text' id='F" + preferenceRowCount + "3'/></td><td><input type='text' id='F" + preferenceRowCount + "4'/></td>";
}

function parseAndShowCurrentData(result) {
  let rowNum = 0;
  let htmlTable = "<table id='preftable'><tbody id='preftbody'><tr><th><input id='F00' type='checkbox'/> Delete</th><th>Key<span style='color:red'>*</span></th><th>Search Engine Name<span style='color:red'>*</span></th><th>Url<span style='color:red'>*</span></th><th>Description</th></tr>";
  if (result.hasOwnProperty(SEARCH_PREFERENCE_KEY)) {
    let preferences = result[SEARCH_PREFERENCE_KEY];
    for (var key in preferences) {
      let curSearchObj = preferences[key];
      rowNum += 1;
      htmlTable += "<tr><td><input id='F" + rowNum + "0' type='checkbox'/></td><td><input type='text' id='F" + rowNum + "1' value='" + key + "'/></td><td><input type='text' id='F" + rowNum + "2' value='" + curSearchObj.name + "'/></td><td><input type='text' id='F" + rowNum + "3' value='" + curSearchObj.url + "'/></td><td><input type='text' id='F" + rowNum + "4' value='" + curSearchObj.description + "'/></td></tr>";
    }
  }
  if (rowNum == 0) {
      rowNum += 1;
      htmlTable += "<tr><td><input id='F" + rowNum + "0' type='checkbox'/></td><td><input type='text' id='F" + rowNum + "1' value=''/></td><td><input type='text' id='F" + rowNum + "2' value=''/></td><td><input type='text' id='F" + rowNum + "3' value=''/></td><td><input type='text' id='F" + rowNum + "4' value=''/></td></tr>";
  }
  htmlTable += "</tbody></table>";
  document.querySelector("#preferences").innerHTML = htmlTable;

  preferenceRowCount = rowNum;
  document.querySelector("#F00").addEventListener("click", selectAllDeletePreferenceRow);
}

function restoreOptions() {

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get(SEARCH_PREFERENCE_KEY);
  getting.then(parseAndShowCurrentData, onError);
}

function selectAllDeletePreferenceRow() {
  var chkBoxMain = document.querySelector("#F00");
  for (var count = 1; count <= preferenceRowCount; count++) {
    var chkBox = document.querySelector("#F" + count + "0");
    if (chkBox) chkBox.checked = chkBoxMain.checked;
  }
}

function resetPreferences() {
  resetFields();
  restoreOptions();
  displayMessage("Preferences Reset!");
}

function displayMessage(text, isError = false) {
  var msgField = document.querySelector("#message");
  msgField.style.color = (isError ? "red" : "green");
  if (! text || text.length == 0) {
    msgField.innerHTML = "<br>";
  }
  else {
    msgField.innerHTML = text;
  }
}

function loadPreferencesFromFile() {
  var inputPrefFile = document.querySelector("#inputPrefFileButton");
  var curFile = inputPrefFile.files[0];
  resetFields();
  if (curFile) {
    var reader = new FileReader();
    reader.onload = function() {
      try {
        var prefText = reader.result;
        var filePrefObj = JSON.parse(prefText);
        loadPreferencesFromDataObj(filePrefObj);
      }
      catch (err) {
        console.log(err.message);
        displayMessage(`Error while loading data - ${err.message}`, true);
        return;
      }
    };
    reader.readAsText(curFile);
  }
  else {
  	displayMessage("Please select a file to load preference data.", true);
  }
}

function loadPreferencesFromDataObj(filePrefObj) {
  if (! filePrefObj.hasOwnProperty(PREFERENCE_FILE_VERSION_TAG) || ! filePrefObj.hasOwnProperty(PREFERENCE_FILE_PREF_TAG)) {
    displayMessage("Invalid input file format.");
    return;
  }
  var fileVersion = parseFloat(filePrefObj[PREFERENCE_FILE_VERSION_TAG]);
  var minFileVersionSupported = parseFloat(PREFERENCE_FILE_VERSION_MIN);
  if (fileVersion < minFileVersionSupported) {
    displayMessage("Invalid file version - " + fileVersion + ", this format is not supported currently.");
    return;
  }
  parseAndShowCurrentData(filePrefObj[PREFERENCE_FILE_PREF_TAG]);
  displayMessage("Preferences Loaded from File. Please review & click on 'Save Preferences' to save it.");
}

function showPreferencesPlainText() {
  var outputArea = document.querySelector("#outputPrefFile");

  function loadData(result) {
    if (result) {
      var filePref = {};
      filePref[PREFERENCE_FILE_VERSION_TAG] = PREFERENCE_FILE_VERSION_CUR;
      filePref[PREFERENCE_FILE_PREF_TAG] = result;
      outputArea.value = JSON.stringify(filePref, null, 2);
    }
    else {
      outputArea.value = "** No Preferences Stored **";
    }
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  resetFields();
  document.querySelector("#outputPrefFileBlock").style["display"] = "block";
  var getting = browser.storage.local.get(SEARCH_PREFERENCE_KEY);
  getting.then(loadData, onError);
}

function resetFields() {
  displayMessage("");
  document.querySelector("#outputPrefFileBlock").style["display"] = "none";
  document.querySelector("#inputPrefFileButton").value = "";
  var chkBoxMain = document.querySelector("#F00");
  if (chkBoxMain) {
    chkBoxMain.checked = false;
    selectAllDeletePreferenceRow();
  }
}

// Load from remote url a default preference data.
function loadPopularSearchEngines() {
  getPopularSearchEngineData()
  .then(function(prefText) {
    try {
      var filePrefObj = JSON.parse(prefText);
      loadPreferencesFromDataObj(filePrefObj);
    }
    catch (err) {
      console.log(err.message);
      displayMessage(`Error while loading data - ${err.message}`, true);
      return;
    }
  });
}

resetFields();
document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#delete").addEventListener("click", deletePreferenceRow);
document.querySelector("#add").addEventListener("click", addPreferenceRow);
document.querySelector("#reset").addEventListener("click", resetPreferences);
document.querySelector("#loadInputPrefFileButton").addEventListener("click", loadPreferencesFromFile);
document.querySelector("#inputPrefFileButton").addEventListener("click", resetFields);
document.querySelector("#showPrefDataButton").addEventListener("click", showPreferencesPlainText);
document.querySelector("#loadPopular").addEventListener("click", loadPopularSearchEngines);
document.querySelector("form").addEventListener("submit", saveOptions);

