
let searchEngines = {};

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
    browser.omnibox.setDefaultSuggestion({ description: `Search using following search engines - (${eNames})` });
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

// Build Search Url based on user input
function buildSearchURL(text) {
  if (text.toLowerCase().startsWith("http://") || text.toLowerCase().startsWith("https://")) return `${text}`;
  let input = splitInputTextForSearch(text);
  let searchEngObj = searchEngines[input.searchEngine];
  if (searchEngObj) {
  	let searchUrl = searchEngObj.url;
    let url = searchUrl.replace(SEARCH_TEXT_PLACEHOLDER, input.queryText);
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
  if (item[SEARCH_PREFERENCE_KEY]) searchEngines = item[SEARCH_PREFERENCE_KEY];
}

// Read preferences from storage
function getSearchEnginesFromPreferences() {
  var preferences = browser.storage.local.get(SEARCH_PREFERENCE_KEY);
  preferences.then(onGot, onError);
}

// Mani function which loads the plugin functionality
function main() {
  pluginLoadData();
  
  // Update the suggestions whenever the input is changed.
  browser.omnibox.onInputChanged.addListener((text, addSuggestions) => {
    addSuggestions(getSearchEngineSuggessions(text));
  });

  // Open the page based on how the user clicks on a suggestion.
  browser.omnibox.onInputEntered.addListener((text, disposition) => {
    let url = buildSearchURL(text);
    if (!url && JSON.stringify(searchEngines) == "{}") browser.runtime.openOptionsPage();
    if (!url) return;
    switch (disposition) {
      case "currentTab":
        browser.tabs.update({url});
        break;
      case "newForegroundTab":
        browser.tabs.create({url});
        break;
      case "newBackgroundTab":
        browser.tabs.create({url, active: false});
        break;
    }
  });
}

main();

