
// Search engines defined by user, saved in plugin storage
let searchEngines = {};

// Internal flag to disable search using multiple search engines
// It is set to false automatically if any of the custom search engine key has CHAR_SEPARATOR_FOR_MULTI_SEARCH as per definition in utils.js
let multiSearchDisabled = null

// Split text assuming format '<search_engine> <search text>'
function splitInputTextForSearch(text) {
  let result = {
    searchEngine: null,
    queryText: null
  };
  if (text) {
    let parts = text.trim().split(' ');
    result.searchEngine=parts[0].toLowerCase();
    parts.shift();
    result.queryText = parts.join(' ');
  }
  return result;
}

// Set plugin default description based on loaded preferences data
function setSearchEngineDescription() {
  let eNames = null;
  for (var key in searchEngines) {
    eNames = (eNames ? eNames + ", " + key : key);
  }
  if (eNames) {
    browser.omnibox.setDefaultSuggestion({ description: `Search using (multi-search = ${multiSearchDisabled ? "off" : "on"}) search engines - (${eNames})` });
  }
  else {
    browser.omnibox.setDefaultSuggestion({ description: `No custom Search Engine setup. Go to plugin preferenes to add custom search engines.` });
  }
}

// Get search suggessions based on user input
function getSearchEngineSuggessions(text) {
  let input = splitInputTextForSearch(text);
  let suggessions = [];

  // If either text is null or search engine keyword is null
  if (!text || !input.searchEngine) {
  	for (var key in searchEngines) {
  	  var desc = "Search with " + searchEngines[key].name + ((searchEngines[key].description && searchEngines[key].description.length > 0)? " - " + searchEngines[key].description : "")
      suggessions.push({
        content: `${key}`,
        description: `${desc}`
      });
  	}
    return suggessions;
  }

  // If user is still typing the search engine keyword
  for (var key in searchEngines) {
    if (key.startsWith(input.searchEngine)) {
  	  let sUrl = input.queryText ? buildSearchURL(key + " " + input.queryText) : key;
  	  var desc = "Search with " + searchEngines[key].name + ((searchEngines[key].description && searchEngines[key].description.length > 0)? " - " + searchEngines[key].description : "")
  	  suggessions.push({
        content: `${sUrl}`,
        description: `${desc}`
      });
    }
  }
  return suggessions;
}

// Get search suggessions for multiple search engines
function getMuliSearchEngineSuggessions(text) {
  var input = splitInputTextForSearch(text)
  var suggessions = [];
  var searchEngineKeys = input.searchEngine.split(CHAR_SEPARATOR_FOR_MULTI_SEARCH);
  for (var keyIdx in searchEngineKeys) {
    var searchKey = searchEngineKeys[keyIdx];
    if (searchKey.length != 0) suggessions = suggessions.concat(getSearchEngineSuggessions(searchKey + " " + input.queryText));
  }
  return suggessions
}

// Build Search Url based on user input
function buildSearchURL(text) {
  if (text.toLowerCase().startsWith("http://") || text.toLowerCase().startsWith("https://")) return `${text}`;
  let input = splitInputTextForSearch(text);
  let searchEngObj = searchEngines[input.searchEngine];
  if (searchEngObj) {
  	let searchUrl = searchEngObj.url;
  	let url = null;
  	if (searchUrl.includes(SEARCH_TEXT_PLACEHOLDER)) {
      url = strReplaceAll(searchUrl, SEARCH_TEXT_PLACEHOLDER, input.queryText);
    }
    else {
      url = buildUrlForSplitWordSearch(searchUrl, input.queryText);
    }
    return `${url}`;
  }
  else {
    // If there is only one search engine which is matching the key then use that for searching
    let searchKeys = [];
    for (var key in searchEngines) {
      if(key.startsWith(input.searchEngine)) {
        searchKeys.push(key);
      }
    }
    if (searchKeys.length == 1) {
      return buildSearchURL(searchKeys[0] + " " + input.queryText);
    }
  }

  return null;
}

function strReplaceAll(str, toReplace, replacement) {
  return str.split(toReplace).join(replacement);
}

function buildUrlForSplitWordSearch(searchUrl, fullQueryText) {
  // Will contain all the remaining words if plaeholder count is less than query words.
  var lastQueryText = "";
  // Will contain the final split of query text words based on how many search tags are present in URL.
  var queryText = [];
  var parts = fullQueryText.split(" ");
  var count = 0;
  // Start preparing the list of query words
  if (searchUrl.includes(SEARCH_TEXT_PLACEHOLDER_0)) {
    if (parts.length > count) queryText.push(parts[count]);
    else queryText.push("");
    count += 1;
  }
  if (searchUrl.includes(SEARCH_TEXT_PLACEHOLDER_1)) {
    if (parts.length > count) queryText.push(parts[count]);
    else queryText.push("");
    count += 1;
  }
  if (searchUrl.includes(SEARCH_TEXT_PLACEHOLDER_2)) {
    if (parts.length > count) queryText.push(parts[count]);
    else queryText.push("");
    count += 1;
  }
  if (searchUrl.includes(SEARCH_TEXT_PLACEHOLDER_3)) {
    if (parts.length > count) queryText.push(parts[count]);
    else queryText.push("");
    count += 1;
  }
  if (searchUrl.includes(SEARCH_TEXT_PLACEHOLDER_4)) {
    if (parts.length > count) queryText.push(parts[count]);
    else queryText.push("");
    count += 1;
  }
  if (searchUrl.includes(SEARCH_TEXT_PLACEHOLDER_5)) {
    if (parts.length > count) queryText.push(parts[count]);
    else queryText.push("");
    count += 1;
  }
  if (searchUrl.includes(SEARCH_TEXT_PLACEHOLDER_6)) {
    if (parts.length > count) queryText.push(parts[count]);
    else queryText.push("");
    count += 1;
  }
  if (searchUrl.includes(SEARCH_TEXT_PLACEHOLDER_7)) {
    if (parts.length > count) queryText.push(parts[count]);
    else queryText.push("");
    count += 1;
  }
  if (searchUrl.includes(SEARCH_TEXT_PLACEHOLDER_8)) {
    if (parts.length > count) queryText.push(parts[count]);
    else queryText.push("");
    count += 1;
  }
  if (searchUrl.includes(SEARCH_TEXT_PLACEHOLDER_9)) {
    if (parts.length > count) queryText.push(parts[count]);
    else queryText.push("");
    count += 1;
  }

  // If query words are more than search tags, last tag will get the remaining search words.
  if (count < parts.length) {
    for (var i = 1; i < count; i++) parts.shift();
    lastQueryText = parts.join(" ");
  }
  count = 0;
  // Start backword for search tag replacement in URL.
  if (searchUrl.includes(SEARCH_TEXT_PLACEHOLDER_9)) {
    count += 1;
    if (lastQueryText != "" && count == 1) searchUrl = strReplaceAll(searchUrl, SEARCH_TEXT_PLACEHOLDER_9, lastQueryText);
    else searchUrl = strReplaceAll(searchUrl, SEARCH_TEXT_PLACEHOLDER_9, queryText[queryText.length - count]);
  }
  if (searchUrl.includes(SEARCH_TEXT_PLACEHOLDER_8)) {
    count += 1;
    if (lastQueryText != "" && count == 1) searchUrl = strReplaceAll(searchUrl, SEARCH_TEXT_PLACEHOLDER_8, lastQueryText);
    else searchUrl = strReplaceAll(searchUrl, SEARCH_TEXT_PLACEHOLDER_8, queryText[queryText.length - count]);
  }
  if (searchUrl.includes(SEARCH_TEXT_PLACEHOLDER_7)) {
    count += 1;
    if (lastQueryText != "" && count == 1) searchUrl = strReplaceAll(searchUrl, SEARCH_TEXT_PLACEHOLDER_7, lastQueryText);
    else searchUrl = strReplaceAll(searchUrl, SEARCH_TEXT_PLACEHOLDER_7, queryText[queryText.length - count]);
  }
  if (searchUrl.includes(SEARCH_TEXT_PLACEHOLDER_6)) {
    count += 1;
    if (lastQueryText != "" && count == 1) searchUrl = strReplaceAll(searchUrl, SEARCH_TEXT_PLACEHOLDER_6, lastQueryText);
    else searchUrl = strReplaceAll(searchUrl, SEARCH_TEXT_PLACEHOLDER_6, queryText[queryText.length - count]);
  }
  if (searchUrl.includes(SEARCH_TEXT_PLACEHOLDER_5)) {
    count += 1;
    if (lastQueryText != "" && count == 1) searchUrl = strReplaceAll(searchUrl, SEARCH_TEXT_PLACEHOLDER_5, lastQueryText);
    else searchUrl = strReplaceAll(searchUrl, SEARCH_TEXT_PLACEHOLDER_5, queryText[queryText.length - count]);
  }
  if (searchUrl.includes(SEARCH_TEXT_PLACEHOLDER_4)) {
    count += 1;
    if (lastQueryText != "" && count == 1) searchUrl = strReplaceAll(searchUrl, SEARCH_TEXT_PLACEHOLDER_4, lastQueryText);
    else searchUrl = strReplaceAll(searchUrl, SEARCH_TEXT_PLACEHOLDER_4, queryText[queryText.length - count]);
  }
  if (searchUrl.includes(SEARCH_TEXT_PLACEHOLDER_3)) {
    count += 1;
    if (lastQueryText != "" && count == 1) searchUrl = strReplaceAll(searchUrl, SEARCH_TEXT_PLACEHOLDER_3, lastQueryText);
    else searchUrl = strReplaceAll(searchUrl, SEARCH_TEXT_PLACEHOLDER_3, queryText[queryText.length - count]);
  }
  if (searchUrl.includes(SEARCH_TEXT_PLACEHOLDER_2)) {
    count += 1;
    if (lastQueryText != "" && count == 1) searchUrl = strReplaceAll(searchUrl, SEARCH_TEXT_PLACEHOLDER_2, lastQueryText);
    else searchUrl = strReplaceAll(searchUrl, SEARCH_TEXT_PLACEHOLDER_2, queryText[queryText.length - count]);
  }
  if (searchUrl.includes(SEARCH_TEXT_PLACEHOLDER_1)) {
    count += 1;
    if (lastQueryText != "" && count == 1) searchUrl = strReplaceAll(searchUrl, SEARCH_TEXT_PLACEHOLDER_1, lastQueryText);
    else searchUrl = strReplaceAll(searchUrl, SEARCH_TEXT_PLACEHOLDER_1, queryText[queryText.length - count]);
  }
  if (searchUrl.includes(SEARCH_TEXT_PLACEHOLDER_0)) {
    count += 1;
    if (lastQueryText != "" && count == 1) searchUrl = strReplaceAll(searchUrl, SEARCH_TEXT_PLACEHOLDER_0, lastQueryText);
    else searchUrl = strReplaceAll(searchUrl, SEARCH_TEXT_PLACEHOLDER_0, queryText[queryText.length - count]);
  }

  return searchUrl;
}

// Plugin init function
function pluginLoadData() {
  // Read preferences
  getSearchEnginesFromPreferences();

  // Provide help text to the user types keyword for this extension.
  setSearchEngineDescription();
  browser.omnibox.onInputStarted.addListener(() => {
  	setSearchEngineDescription();
  });
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function onGot(item) {
  multiSearchDisabled = false
  if (item[SEARCH_PREFERENCE_KEY]) searchEngines = item[SEARCH_PREFERENCE_KEY];

  for (var key in searchEngines) {
    if (key.includes(CHAR_SEPARATOR_FOR_MULTI_SEARCH)) {
      multiSearchDisabled = true;
      break;
    }
  }
}

// Read preferences from storage
function getSearchEnginesFromPreferences() {
  var preferences = browser.storage.local.get(SEARCH_PREFERENCE_KEY);
  preferences.then(onGot, onError);
}

// Main function which loads the plugin functionality
function main() {
  pluginLoadData();

  // Update the suggestions whenever the input is changed.
  browser.omnibox.onInputChanged.addListener((text, addSuggestions) => {
    addSuggestions(multiSearchDisabled ? getSearchEngineSuggessions(text) : getMuliSearchEngineSuggessions(text));
  });

  // Open the page based on how the user clicks on a suggestion.
  browser.omnibox.onInputEntered.addListener((text, disposition) => {
    if (JSON.stringify(searchEngines) == "{}") {
      browser.runtime.openOptionsPage();
      return;
    }

    // Array of objects {"url" : url, "disposition" : disposition}
    var searchEngineUrls = [];
    if (multiSearchDisabled) {
      var url = buildSearchURL(text);
      if (url) searchEngineUrls.push({"url": url, "disposition": disposition});
    }
    else {
      var input = splitInputTextForSearch(text)
      var searchEngineKeys = input.searchEngine.split(CHAR_SEPARATOR_FOR_MULTI_SEARCH);
      var isFirstSearch = true;
      for (var keyIdx in searchEngineKeys) {
        var searchKey = searchEngineKeys[keyIdx];
        if (searchKey.length != 0) {
          var url = buildSearchURL(searchEngineKeys[keyIdx] + " " + input.queryText);
          if (url) searchEngineUrls.push({"url": url, "disposition": (isFirstSearch) ? disposition : "newBackgroundTab"});
          isFirstSearch = false;
        }
      }
    }

    if (searchEngineUrls.length == 0) return;

    // For newBackgroundTab use.
    function getOnGot(url) {
        return function(tab) { browser.tabs.create({url, index: tab.index + 1, active: false}); }
    }

    function getOnErr(url) {
      return function(err) { browser.tabs.create({url, active: false}); }
    }

    // Loop through to open tabs in the order of search engine keyword
    while (searchEngineUrls.length > 0) {
      var seUrl = searchEngineUrls.pop();
      var url = seUrl.url;
      var curDisposition = seUrl.disposition;
      switch (curDisposition) {
        case "currentTab":
          browser.tabs.update({url});
          break;
        case "newForegroundTab":
          browser.tabs.create({url});
          break;
        case "newBackgroundTab":
          // Try opening new tab next to current tab.
          // On error simply open new tab at the end.
          try {
            browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT})
            .then(tabs => browser.tabs.get(tabs[0].id))
            .then(getOnGot(url),getOnErr(url));
          }
          catch (err) {
            browser.tabs.create({url, active: false});
          }
          break;
      }
    };
  });
}

main();
