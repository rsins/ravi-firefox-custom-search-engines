// This part of the search engine url gets replaced by the actual query text.
const SEARCH_TEXT_PLACEHOLDER = "{searchTerms}";

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
const POPULAR_SEARCH_ENGINE_URL = "";

function getPopularSearchEngineData() {
	var d = {
		  "file_version": "1.0",
		  "preferences": {
		  	      "custom_engines": {
		  	      	        "google": {
		  	      	        	        "name": "Google Search",
		  	      	        	        "url": "https://www.google.co.in/search?q={searchTerms}",
		  	      	        	        "description": "Google Search"
		  	      	        	      },
		  	      	        "bing": {
		  	      	        	        "name": "Bing Search",
		  	      	        	        "url": "https://www.bing.com/search?q={searchTerms}",
		  	      	        	        "description": "Bing Search"
		  	      	        	      },
		  	      	        "yahoo": {
		  	      	        	        "name": "Yahoo Search",
		  	      	        	        "url": "https://in.search.yahoo.com/search?q={searchTerms}",
		  	      	        	        "description": "Yahoo Search"
		  	      	        	      },
		  	      	        "duck": {
		  	      	        	        "name": "Duck Duck Go",
		  	      	        	        "url": "https://in.search.yahoo.com/search?q={searchTerms}",
		  	      	        	        "description": "Duck Duck Go"
		  	      	        	      }
		  	      	      }
		  	    }
	};
	return JSON.stringify(d);
}
