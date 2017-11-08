var request = require('request-promise');
var JXON=require("jxon");
var resourceName="LEIFIPhysik";
// Module vars
var _config = {
    "xml_url": "<xml_url>"
}
var _fetchAsync = false;
var _returnItems = [];
var _callbackFunc = function (_returnItems) {
    console.log(_returnItems)
    console.log("length of all fetched items:", _returnItems.length)
}

/**
 * Fetching the XML structure from the given URL (its a Drupal cache).
 */
function _fetchItems() {
    var options = {
        method: "GET",
        uri: _config.xml_url,
        qs: {}
    }
    request(options)
        .then(function (response) {
            // response is xml and gets converted to some JSON here
            var jx = JXON.stringToJs(response);
                _returnItems = jx.elixier.datensatz
                _callbackFunc(_returnItems)
        })
        .catch(function (err) {
            // Something bad happened, handle the error
            console.log(err)
        })
}


/**
 * 
 * @param {object} config 
 */
function _configValid(config) {
    var returnValue = true;
    returnValue &= config !== undefined;
    returnValue &= config.hasOwnProperty("xml_url") ? config.xml_url !== "" && config.xml_url.indexOf("<xml_url>") : false;
    return returnValue;
}
// Module public methods
/**
 * 
 * @param {object} config - Simple config object containing the API key and an array of channel ids as strings. 
 * @param {function} callbackFunc - The callback that handles the response.callbackFunc 
 * @param {boolean} fetchAsync - Utitlity flag setting whether the callback is called with every chunk or with the complete list of fetched items.
 */
function fetch(config, callbackFunc, fetchAsync) {
    if (_configValid(config)) {
        _fetchAsync = (fetchAsync === undefined) ? _fetchAsync : fetchAsync;
        _returnItems = [];
        _callbackFunc = callbackFunc || _callbackFunc;
        _config = config;
        _fetchItems()
    } else {
        console.log(resourceName+" config not valid!")
        console.log("editable "+resourceName+" config blueprint:", JSON.stringify(_config))
    }
}

module.exports = {
    fetch: fetch
}
