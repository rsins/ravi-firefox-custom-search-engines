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
  	  hasDuplicate: false,
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

	// Clear color highlights
    c1.style["background-color"] = "";
    c2.style["background-color"] = "";
    c3.style["background-color"] = "";
    c4.style["background-color"] = "";

    // Check empty fields.
    if (c1 == null || c1.value.trim() == "" || c2 == null || c2.value.trim() == "" || c3 == null || c3.value.trim() == "") {
      c1.style["background-color"] = "#ffcccc";
      c2.style["background-color"] = "#ffcccc";
      c3.style["background-color"] = "#ffcccc";
      if (! inputError.hasMissingData) {
        inputError.hasAtLeastOneError = true;
        inputError.hasMissingData = true;
        inputError.displayMessage += "<span style='color: #ffcccc'>* All mandatory details should be provided.</span><br>";
      }

    }
    // Check duplicate search keys
    else if (prefJson.hasOwnProperty(c1.value.trim())) {
      c1.style["background-color"] = "#dbccff";
      if (! inputError.hasDuplicate) {
        inputError.hasAtLeastOneError = true;
        inputError.hasDuplicate = true;
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

  var prefJsonStr = JSON.stringify(prefJson);
  var prefStorageObj = {};
  prefStorageObj[SEARCH_PREFERENCE_KEY] = prefJsonStr;
  browser.storage.local.set(prefStorageObj);
 
  // Get to background.js and run the load data function for the updated data.
  let backgroundPage = browser.extension.getBackgroundPage();
  backgroundPage.pluginLoadData();

  restoreOptions();
  displayMessage("Preferences Saved!");
}

function deletePreferenceRow() {
  displayMessage("");
  for (var count = 1; count <= preferenceRowCount; count++) {
    var chkBox = document.querySelector("#F" + count + "0");
    if (chkBox && chkBox.checked) {
      var rowElement = chkBox.parentElement.parentElement;
      rowElement.parentElement.removeChild(rowElement);
    }
  }
}

function addPreferenceRow() {
  displayMessage("");
  var tabRef = document.querySelector("#preftbody");
  var newRow = tabRef.insertRow(tabRef.rows.length);
  preferenceRowCount += 1;
  newRow.innerHTML = "<td><input id='F" + preferenceRowCount + "0' type='checkbox'/></td><td><input type='text' id='F" + preferenceRowCount + "1'/></td><td><input type='text' id='F" + preferenceRowCount + "2'/></td><td><input type='text' id='F" + preferenceRowCount + "3'/></td><td><input type='text' id='F" + preferenceRowCount + "4'/></td>";
}

function restoreOptions() {

  function parseCurrentData(result) {
  	let rowNum = 0;
    let htmlTable = "<table id='preftable'><tbody id='preftbody'><tr><th>Delete</th><th>Key<span style='color:red'>*</span></th><th>Search Engine Name<span style='color:red'>*</span></th><th>Url<span style='color:red'>*</span></th><th>Description</th></tr>";
    if (result.hasOwnProperty(SEARCH_PREFERENCE_KEY)) {
      let preferences = JSON.parse(result[SEARCH_PREFERENCE_KEY]);
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
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get(SEARCH_PREFERENCE_KEY);
  getting.then(parseCurrentData, onError);
}

function resetPreferences() {
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

displayMessage("");
document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#delete").addEventListener("click", deletePreferenceRow);
document.querySelector("#add").addEventListener("click", addPreferenceRow);
document.querySelector("#reset").addEventListener("click", resetPreferences);
document.querySelector("form").addEventListener("submit", saveOptions);

