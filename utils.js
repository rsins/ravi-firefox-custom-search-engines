// This part of the search engine url gets replaced by the actual query text.
const SEARCH_TEXT_PLACEHOLDER   = "{searchTerms}";
const SEARCH_TEXT_PLACEHOLDER_0 = "{searchTerms[0]}";
const SEARCH_TEXT_PLACEHOLDER_1 = "{searchTerms[1]}";
const SEARCH_TEXT_PLACEHOLDER_2 = "{searchTerms[2]}";
const SEARCH_TEXT_PLACEHOLDER_3 = "{searchTerms[3]}";
const SEARCH_TEXT_PLACEHOLDER_4 = "{searchTerms[4]}";
const SEARCH_TEXT_PLACEHOLDER_5 = "{searchTerms[5]}";
const SEARCH_TEXT_PLACEHOLDER_6 = "{searchTerms[6]}";
const SEARCH_TEXT_PLACEHOLDER_7 = "{searchTerms[7]}";
const SEARCH_TEXT_PLACEHOLDER_8 = "{searchTerms[8]}";
const SEARCH_TEXT_PLACEHOLDER_9 = "{searchTerms[9]}";

// Property name in the preference data stored in storage
const SEARCH_PREFERENCE_KEY = "custom_engines";

// Property name in the preference file for preference data
const PREFERENCE_FILE_PREF_TAG = "preferences";
// Property name in the preference file for version number
const PREFERENCE_FILE_VERSION_TAG = "file_version";
// Minimum file version supported
const PREFERENCE_FILE_VERSION_MIN = "1.0";
// Current file version
const PREFERENCE_FILE_VERSION_CUR = "1.0";

// Url for popular search engines data
const POPULAR_SEARCH_ENGINE_URL = "https://raw.githubusercontent.com/rsins/ravi-firefox-custom-search-engines/master/SampleCustomEngines/PopularSearchEngines.txt";

// For search using multiple search engines
const CHAR_SEPARATOR_FOR_MULTI_SEARCH = ","

function getPopularSearchEngineData() {
  return fetch(POPULAR_SEARCH_ENGINE_URL).then((resp) => resp.text());
}
