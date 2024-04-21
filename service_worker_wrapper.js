/* service_worker_wrapper.js */

/*
import "./utils.js";
import "./browser-polyfill.min.js";
import "./background.js";
*/

/*
importScripts("./utils.js");
importScripts("./browser-polyfill.min.js");
importScripts("./background.js");
*/


try {
    importScripts("./utils.js");
} catch (e) {
    console.log(e);
}

try {
    importScripts("./browser-polyfill.min.js");
} catch (e) {
    console.log(e);
}

try {
    importScripts("./background.js");
} catch (e) {
    console.log(e);
}

