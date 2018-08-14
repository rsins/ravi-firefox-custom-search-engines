// Does not always match to the number of rows in preference table.
// This is to help with id tags of elements.
let preferenceRowCount = 0;

// Internal flag to disable search using multiple search engines
// It is set to false automatically if any of the custom search engine key has CHAR_SEPARATOR_FOR_MULTI_SEARCH as per definition in utils.js
let multiSearchDisabled = null

// To store sort order of table columns
let sortOrderOfPrefColById = {}

function getColorBlockForHtml(color) {
  return "<span style='background-color: " + color + "; display: inline-block; width: 12px; height: 12px; border-radius: 50%;'></span>";
}

function saveOptions(e) {
  e.preventDefault();
  deletePreferenceRow();

  var inputError = {
  	  hasAtLeastOneError: false,
      displayMessage: "Errors:<br>",
  	  hasMissingData: false,
  	  hasDuplicateKey: false,
  	  hasInvalidKey1: false,
      hasInvalidKey2: false,
      hasInvalidCategory1: false,
      hasInvalidCategory2: false,
  	  hasInvalidUrlProtocol: false,
  	  hasInvalidUrlSearchParam: false
  };
  multiSearchDisabled = false;
  var prefJson = {};
  // Prepare data for saving and also do validations.
  for (var count = 1; count <= preferenceRowCount; count++) {
    var c1 = document.querySelector("#F" + count + "1");
    var c2 = document.querySelector("#F" + count + "2");
    var c3 = document.querySelector("#F" + count + "3");
    var c4 = document.querySelector("#F" + count + "4");
    var c5 = document.querySelector("#F" + count + "5");

	  if (c1 == null || c2 == null || c3 == null || c4 == null || c5 == null) continue;

	  // Clear color highlights
    c1.style["background-color"] = "";
    c2.style["background-color"] = "";
    c3.style["background-color"] = "";
    c4.style["background-color"] = "";
    c5.style["background-color"] = "";

    // Corner case
    if (preferenceRowCount == 1 && c1.value.trim() == "" && c2.value.trim() == "" && c3.value.trim() == "" && c4.value.trim() == "" && c5.value.trim() == "") {
       // Do nothing.
       console.log("One input row but no data to save.");
    }
    // Check invalid search keys
    else if (c1.value.trim().includes(" ")) {
      c1.style["background-color"] = "#42f4b9";
      if (! inputError.hasInvalidKey1) {
        inputError.hasAtLeastOneError = true;
        inputError.hasInvalidKey1 = true;
        inputError.displayMessage += getColorBlockForHtml("#42f4b9") + " Search Key cannot include space.</span><br>";
      }
    }
    // Check invalid search keys
    else if (c1.value.trim().includes(CHAR_GROUP_NAME_START_IDENTIFIER)) {
      c1.style["background-color"] = "#9ba5ef";
      if (! inputError.hasInvalidKey2) {
        inputError.hasAtLeastOneError = true;
        inputError.hasInvalidKey2 = true;
        inputError.displayMessage += getColorBlockForHtml("#9ba5ef") + " Search Key cannot have '" + CHAR_GROUP_NAME_START_IDENTIFIER + "'.</span><br>";
      }
    }
    // Check invalid category
    else if (c5.value.trim().includes(CHAR_GROUP_NAME_START_IDENTIFIER)) {
      c5.style["background-color"] = "#fc6f8b";
      if (! inputError.hasInvalidCategory1) {
        inputError.hasAtLeastOneError = true;
        inputError.hasInvalidCategory1 = true;
        inputError.displayMessage += getColorBlockForHtml("#fc6f8b") + " Search category cannot have '" + CHAR_GROUP_NAME_START_IDENTIFIER + "'.</span><br>";
      }
    }
    // Check invalid category
    else if (c5.value.trim().includes(" ")) {
      c5.style["background-color"] = "#8f9fba";
      if (! inputError.hasInvalidCategory2) {
        inputError.hasAtLeastOneError = true;
        inputError.hasInvalidCategory2 = true;
        inputError.displayMessage += getColorBlockForHtml("#8f9fba") + " Search category cannot include space.</span><br>";
      }
    }
    // Check duplicate search keys
    else if (prefJson.hasOwnProperty(c1.value.trim())) {
      c1.style["background-color"] = "#dbccff";
      if (! inputError.hasDuplicateKey) {
        inputError.hasAtLeastOneError = true;
        inputError.hasDuplicateKey = true;
        inputError.displayMessage += getColorBlockForHtml("#dbccff") + " Duplicate search key.</span><br>";
      }
    }
    // Check empty fields.
    else if (c1.value.trim() == "" || c2.value.trim() == "" || c3.value.trim() == "") {
      c1.style["background-color"] = "#ffcccc";
      c2.style["background-color"] = "#ffcccc";
      c3.style["background-color"] = "#ffcccc";
      if (! inputError.hasMissingData) {
        inputError.hasAtLeastOneError = true;
        inputError.hasMissingData = true;
        inputError.displayMessage += getColorBlockForHtml("#ffcccc") + " All mandatory details should be provided.<br>";
      }
    }
    // Check url protocol
    else if (! c3.value.trim().startsWith("http://") && ! c3.value.trim().startsWith("https://")) {
      c3.style["background-color"] = "#fbccff";
      if (! inputError.hasInvalidUrlProtocol) {
        inputError.hasAtLeastOneError = true;
        inputError.hasInvalidUrlProtocol = true;
        inputError.displayMessage += getColorBlockForHtml("#fbccff") + " URL should start with 'http://' or 'https://'.</span><br>";
      }
    }
    // Check url search parameter, handle split word searches as well.
    else if (
    	    (! c3.value.trim().includes(SEARCH_TEXT_PLACEHOLDER  ) &&
    		 ! c3.value.trim().includes(SEARCH_TEXT_PLACEHOLDER_0) &&
    		 ! c3.value.trim().includes(SEARCH_TEXT_PLACEHOLDER_1) &&
    		 ! c3.value.trim().includes(SEARCH_TEXT_PLACEHOLDER_2) &&
    		 ! c3.value.trim().includes(SEARCH_TEXT_PLACEHOLDER_3) &&
    		 ! c3.value.trim().includes(SEARCH_TEXT_PLACEHOLDER_4) &&
    		 ! c3.value.trim().includes(SEARCH_TEXT_PLACEHOLDER_5) &&
    		 ! c3.value.trim().includes(SEARCH_TEXT_PLACEHOLDER_6) &&
    		 ! c3.value.trim().includes(SEARCH_TEXT_PLACEHOLDER_7) &&
    		 ! c3.value.trim().includes(SEARCH_TEXT_PLACEHOLDER_8) &&
    		 ! c3.value.trim().includes(SEARCH_TEXT_PLACEHOLDER_9) )
    	||
    	    (  c3.value.trim().includes(SEARCH_TEXT_PLACEHOLDER  ) &&
    		  (c3.value.trim().includes(SEARCH_TEXT_PLACEHOLDER_0) ||
    		   c3.value.trim().includes(SEARCH_TEXT_PLACEHOLDER_1) ||
    		   c3.value.trim().includes(SEARCH_TEXT_PLACEHOLDER_2) ||
    		   c3.value.trim().includes(SEARCH_TEXT_PLACEHOLDER_3) ||
    		   c3.value.trim().includes(SEARCH_TEXT_PLACEHOLDER_4) ||
    		   c3.value.trim().includes(SEARCH_TEXT_PLACEHOLDER_5) ||
    		   c3.value.trim().includes(SEARCH_TEXT_PLACEHOLDER_6) ||
    		   c3.value.trim().includes(SEARCH_TEXT_PLACEHOLDER_7) ||
    		   c3.value.trim().includes(SEARCH_TEXT_PLACEHOLDER_8) ||
    		   c3.value.trim().includes(SEARCH_TEXT_PLACEHOLDER_9) ))
    ) {
      c3.style["background-color"] = "#ccd2ff";
      if (! inputError.hasInvalidUrlSearchParam) {
        inputError.hasAtLeastOneError = true;
        inputError.hasInvalidUrlSearchParam = true;
        inputError.displayMessage += getColorBlockForHtml("#ccd2ff") + " URL must contain either {searchTerms} or {searchTerms[x]} where x can range from 0 to 9.</span><br>";
      }
    }
    else {
      var key = c1.value.trim();
      var name = c2.value.trim();
      var url = c3.value.trim();
      var desc = c4.value.trim();
      var cat = c5.value.trim();
      cat = cat.trimChars(CHAR_SEPARATOR_FOR_MULTI_SEARCH);
      cat = strReplaceAll(cat, CHAR_SEPARATOR_FOR_MULTI_SEARCH + CHAR_SEPARATOR_FOR_MULTI_SEARCH, CHAR_SEPARATOR_FOR_MULTI_SEARCH);
      let catSet = new Set(cat.split(CHAR_SEPARATOR_FOR_MULTI_SEARCH));
      cat = Array.from(catSet).join(CHAR_SEPARATOR_FOR_MULTI_SEARCH);
      prefJson[key] = {
      	  "name": name,
      	  "url": url,
          "category": cat,
      	  "description": desc
      };
      if (key.includes(CHAR_SEPARATOR_FOR_MULTI_SEARCH)) multiSearchDisabled = true;
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
  displayMessage("Preferences Saved!" + (multiSearchDisabled ? "<br><span style='color: brown'>Note: At least one key contains '" + CHAR_SEPARATOR_FOR_MULTI_SEARCH + "' so multi-search will be disabled.</span>" : ""));
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
  displayMessage("Row(s) deleted. Click on 'Save Preferences' to save.");

  // Check if there are any preference row existing or not.
  var hasRow = false;
  for (var count = 1; count <= preferenceRowCount && hasRow == false; count++) {
    var chkBox = document.querySelector("#F" + count + "0");
    if (chkBox) hasRow = true;
  }
  if (! hasRow) parseAndShowCurrentData({});
  
  oddEvenTableRowColoring("#preftable");
}

function addPreferenceRow() {
  resetFields();
  var tabRef = document.querySelector("#preftbody");
  var newRow = tabRef.insertRow(tabRef.rows.length);
  preferenceRowCount += 1;
  let rowHtml = "<td><input id='F" + preferenceRowCount + "0' type='checkbox'/></td>";
  rowHtml    += "<td><input type='text' id='F" + preferenceRowCount + "1'/></td>";
  rowHtml    += "<td><input type='text' id='F" + preferenceRowCount + "2'/></td>";
  rowHtml    += "<td><div class='autocomplete'><input type='text' id='F" + preferenceRowCount + "5'/></div></td>";
  rowHtml    += "<td><input type='text' id='F" + preferenceRowCount + "3'/></td>";
  rowHtml    += "<td><input type='text' id='F" + preferenceRowCount + "4'/></td>";
  newRow.innerHTML = rowHtml;

  let c5 = document.querySelector("#F" + preferenceRowCount + "5");
	if (c5 != null) autocomplete(c5, listCurrentCategoriesFunction);

  oddEvenTableRowColoring("#preftable");
}

function parseAndShowCurrentData(result) {
  let rowNum = 0;
  let htmlTable = "<table id='preftable'><tbody id='preftbody'><tr>";
  htmlTable    += "<th style='width:80px; min-width:80px'><input id='F00' type='checkbox'/> Delete</th>";
  htmlTable    += "<th id='F01' class='clickable' style='width:100px; min-width:100px;'>Key<span style='color:red'>*</span></th>";
  htmlTable    += "<th id='F02' class='clickable' style='width:200px; min-width:200px;'>Search Engine Name<span style='color:red'>*</span></th>";
  htmlTable    += "<th id='F05' class='clickable' style='width:100px; min-width:100px;'>Category</th>";
  htmlTable    += "<th id='F03' class='clickable' style='min-width:300px'>Url<span style='color:red'>*</span></th>";
  htmlTable    += "<th id='F04' class='clickable' style='width:200px; min-width:200px'>Description</th>";
  htmlTable    += "</tr>";
  if (result.hasOwnProperty(SEARCH_PREFERENCE_KEY)) {
    let preferences = result[SEARCH_PREFERENCE_KEY];
    for (var key in preferences) {
      let curSearchObj = preferences[key];
      rowNum += 1;
      htmlTable += "<tr><td><input id='F" + rowNum + "0' type='checkbox'/></td>";
      htmlTable += "<td><input type='text' id='F" + rowNum + "1' value='" + key + "'/></td>";
      htmlTable += "<td><input type='text' id='F" + rowNum + "2' value='" + resolveValue(curSearchObj, "name") + "'/></td>";
      htmlTable += "<td><div class='autocomplete'><input type='text' id='F" + rowNum + "5' value='" + resolveValue(curSearchObj, "category") + "'/></div></td>";
      htmlTable += "<td><input type='text' id='F" + rowNum + "3' value='" + resolveValue(curSearchObj, "url") + "'/></td>";
      htmlTable += "<td><input type='text' id='F" + rowNum + "4' value='" + resolveValue(curSearchObj, "description") + "'/></td>";
      htmlTable += "</tr>";
    }
  }
  if (rowNum == 0) {
      rowNum += 1;
      htmlTable += "<tr>";
      htmlTable += "<td><input id='F" + rowNum + "0' type='checkbox'/></td>";
      htmlTable += "<td><input type='text' id='F" + rowNum + "1' value=''/></td>";
      htmlTable += "<td><input type='text' id='F" + rowNum + "2' value=''/></td>";
      htmlTable += "<td><div class='autocomplete'><input type='text' id='F" + rowNum + "5' value=''/></div></td>";
      htmlTable += "<td><input type='text' id='F" + rowNum + "3' value=''/></td>";
      htmlTable += "<td><input type='text' id='F" + rowNum + "4' value=''/></td>";
      htmlTable += "</tr>";
  }
  htmlTable += "</tbody></table>";
  document.querySelector("#preferences").innerHTML = htmlTable;

  preferenceRowCount = rowNum;
  document.querySelector("#F00").addEventListener("click", selectAllDeletePreferenceRow);

  // Comparator for preference table
  function getClickSortFunction(objId, propName) {
    return function() {
      var ascOrder = (objId in sortOrderOfPrefColById) ? sortOrderOfPrefColById[objId] : true;
      sortPrefsOnProperty(propName, ascOrder);
      sortOrderOfPrefColById[objId] = !ascOrder;
    };
  }
  document.querySelector("#F01").addEventListener("click", getClickSortFunction("#F01", "key"));
  document.querySelector("#F02").addEventListener("click", getClickSortFunction("#F02", "name"));
  document.querySelector("#F03").addEventListener("click", getClickSortFunction("#F03", "url"));
  document.querySelector("#F04").addEventListener("click", getClickSortFunction("#F04", "description"));
  document.querySelector("#F05").addEventListener("click", getClickSortFunction("#F05", "category"));

  // Autocomplete feature on category
  for (var count = 1; count <= preferenceRowCount; count++) {
    var c5 = document.querySelector("#F" + count + "5");
	  if (c5 == null) continue;
    autocomplete(c5, listCurrentCategoriesFunction);
  }

  oddEvenTableRowColoring("#preftable");
}

// Get all the current values of categories for autocomplete
function listCurrentCategoriesFunction(inp) {
  let catSet = new Set();
  for (var count = 1; count <= preferenceRowCount; count++) {
    var c5 = document.querySelector("#F" + count + "5");
	  if (c5 == null || c5 == inp) continue;
    let curCategories = new Set(c5.value.trim().split(CHAR_SEPARATOR_FOR_MULTI_SEARCH));
    curCategories.forEach(catSet.add, catSet);
  }
  return Array.from(catSet);
}

function restoreOptions() {

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get(SEARCH_PREFERENCE_KEY);
  getting.then(parseAndShowCurrentData, onError);

  // Reset sort order details
  sortOrderOfPrefColById = {};
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
    hideModalMsg();
  }
  else {
    msgField.innerHTML = text;
    if (isError) showModalMsg(text, isError);
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
        displayMessage("Preferences Loaded from File. Please review & click on 'Save Preferences' to save it.");
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
  var mergedPref = mergeOnScreenPrefAndFileData(filePrefObj[PREFERENCE_FILE_PREF_TAG]);
  parseAndShowCurrentData(mergedPref);
}

function mergeOnScreenPrefAndFileData(filePrefs) {
  if (! filePrefs.hasOwnProperty(SEARCH_PREFERENCE_KEY)) throw new Error("Invalid File Format.");
  var prefs = filePrefs[SEARCH_PREFERENCE_KEY];

  // Prepare data for merging.
  for (var count = 1; count <= preferenceRowCount; count++) {
    var c1 = document.querySelector("#F" + count + "1");
    var c2 = document.querySelector("#F" + count + "2");
    var c3 = document.querySelector("#F" + count + "3");
    var c4 = document.querySelector("#F" + count + "4");
    var c5 = document.querySelector("#F" + count + "5");

	  if (c1 == null || c2 == null || c3 == null || c4 == null || c5 == null) continue;

	  // Clear color highlights
    c1.style["background-color"] = "";
    c2.style["background-color"] = "";
    c3.style["background-color"] = "";
    c4.style["background-color"] = "";
    c5.style["background-color"] = "";

    var key = c1.value.trim();
    var name = c2.value.trim();
    var url = c3.value.trim();
    var desc = c4.value.trim();
    var cat = c5.value.trim();

	  // If UI Pref Key is present in file data then ignore UI data
    if (key == "" || prefs.hasOwnProperty(key)) continue;

    prefs[key] = {
      "name": name,
      "url": url,
      "category": cat,
      "description": desc
    };
  };

  return filePrefs;
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

  var hasToHideField = false;
  if (document.querySelector("#outputPrefFileBlock").style["display"] == "block") {
    hasToHideField = true;
  }
  resetFields();
  if (! hasToHideField) {
    document.querySelector("#showPrefDataButton").innerText = "Hide Pref Data";
    document.querySelector("#outputPrefFileBlock").style["display"] = "block";
    var getting = browser.storage.local.get(SEARCH_PREFERENCE_KEY);
    getting.then(loadData, onError);
  }

}

function resetFields() {
  displayMessage("");
  document.querySelector('#myModal').style.display = "none";
  document.querySelector("#showPrefDataButton").innerText = "Show Pref Data";
  document.querySelector("#outputPrefFileBlock").style["display"] = "none";
  document.querySelector("#inputPrefFileButton").value = "";
  let prefSearchBox = document.querySelector("#myPrefSearch");
  if (prefSearchBox) prefSearchBox.value = "";
  let chkBoxMain = document.querySelector("#F00");
  if (chkBoxMain) {
    chkBoxMain.checked = false;
    selectAllDeletePreferenceRow();
  }
}

// Load from remote url a default preference data.
function loadPopularSearchEngines() {
  resetFields();
  getPopularSearchEngineData()
  .then(function(prefText) {
    try {
      var filePrefObj = JSON.parse(prefText);
      loadPreferencesFromDataObj(filePrefObj);
      displayMessage("Popular Search Engines loaded. Please review & click on 'Save Preferences' to save it.");
    }
    catch (err) {
      console.log(`Error: ${err}`);
      console.log(err.stack);
      displayMessage(`Error while loading data - ${err.message}`, true);
      return;
    }
  });
}

// Required to do sorting on table columns
function buildPrefObjectArrayWithoutValidation() {
  deletePreferenceRow();

  var prefObjArr = [];
  // Prepare data for saving and also do validations.
  for (var count = 1; count <= preferenceRowCount; count++) {
    var c1 = document.querySelector("#F" + count + "1");
    var c2 = document.querySelector("#F" + count + "2");
    var c3 = document.querySelector("#F" + count + "3");
    var c4 = document.querySelector("#F" + count + "4");
    var c5 = document.querySelector("#F" + count + "5");

	  if (c1 == null || c2 == null || c3 == null || c4 == null || c5 == null) continue;

    var key = c1.value.trim();
    var name = c2.value.trim();
    var url = c3.value.trim();
    var desc = c4.value.trim();
    var cat = c5.value.trim();
    if (key == "" && name == "" && url == "" && desc == "" && cat == "") continue;

    prefObjArr.push({
        "key": key,
    	  "name": name,
    	  "url": url,
        "category": cat,
    	  "description": desc
    });
  }

  return prefObjArr;
}

// To sort prefernce table on the given property name
function sortPrefsOnProperty(propName, ascOrder) {
  function ascSortObjectsOnProperty(name) {
    return function(a, b) {
      if (a[name] > b[name]) return 1;
      if (a[name] < b[name]) return -1;
      return 0;
    }
  }
  function descSortObjectsOnProperty(name) {
    return function(a, b) {
      if (b[name] > a[name]) return 1;
      if (b[name] < a[name]) return -1;
      return 0;
    }
  }

  var prefObjArr = buildPrefObjectArrayWithoutValidation();
  prefObjArr = prefObjArr.sort(ascOrder ? ascSortObjectsOnProperty(propName) : descSortObjectsOnProperty(propName));

  var prefJson = {};
  var prevKeys = [];
  var keysInError = [];
  var hasError = false;
  var errMessage = getColorBlockForHtml("#dbccff") + " To sort due please resolve error with duplicate search key(s) : ";
  for (var idx in prefObjArr) {
    var prefObj = prefObjArr[idx];
    prefJson[prefObj["key"]] = {
      "name": prefObj["name"],
      "url": prefObj["url"],
      "category": prefObj["category"],
      "description": prefObj["description"]
    }

    if (prevKeys.includes(prefObj["key"])) {
      searchKey = prefObj["key"];
      errMessage += (hasError ? ", " : "") + searchKey;
      keysInError.push(searchKey);
      hasError = true;
    }
    prevKeys.push(prefObj["key"]);
  }
  if (hasError) {
    // Clear formatting if any and highlight the keys in error.
    for (var count = 1; count <= preferenceRowCount; count++) {
      var c1 = document.querySelector("#F" + count + "1");
      var c2 = document.querySelector("#F" + count + "2");
      var c3 = document.querySelector("#F" + count + "3");
      var c4 = document.querySelector("#F" + count + "4");
      var c5 = document.querySelector("#F" + count + "5");

  	  if (c1 == null || c2 == null || c3 == null || c4 == null || c5 == null) continue;

  	  // Clear color highlights
      c1.style["background-color"] = "";
      c2.style["background-color"] = "";
      c3.style["background-color"] = "";
      c4.style["background-color"] = "";
      c5.style["background-color"] = "";
      if (keysInError.includes(c1.value.trim())) {
        c1.style["background-color"] = "#dbccff";
      }
    }
    displayMessage(errMessage, true);
    return;
  }

  var prefStorageObj = {};
  prefStorageObj[SEARCH_PREFERENCE_KEY] = prefJson
  resetFields();
  parseAndShowCurrentData(prefStorageObj);
  displayMessage("Preference sorted on '" + propName + "' in " + (ascOrder ? "ascending" : "descending") + " order.");
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
