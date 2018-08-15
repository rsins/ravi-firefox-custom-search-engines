# custom-search-engine

## What it does

This extension allows you to create your own custom search engines. These searches will work with Firefox's awesome bar.

To kick off this search type 'ms' into the awesome bar and followed by custom search engine identifier and the search string.

Example:
   ms google <search term>
   This will result in search to be made on google assuming a custom engine is already setup with google as keyword for search.


Now multiple search engines can be used for search in single go. Type search engine keys separated with comma ',' (no spaces). 
E.g. "ms key1,key2,key3 <search text>"

If search engine key itself contains comma ',' then multi-search feature is automatically disabled.

A new feature has been added to support search engine categories. Multiple search categories can be grouped together using search category.

To search based in category type 'ms' and followed by @<categories separated by comma> and the search string.

Example:
    ms @food,restaurant home delivery
    This will result in search to be made on search engines under categories 'food' and 'restaurant'.

