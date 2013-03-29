// variable to en-/disable debug
// set to 1 to enable debug log
var DEBUG;


// xmlhttp object function
function getHTTPObject() {

    // debug log
    if (DEBUG === 1) {console.log("xml http object function");}

    // variable definitions
    var xhr;

    // check for availibility if xmlhttprequest object
    if(window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if(window.ActiveXObject) {
        xhr = new ActiveXObject("Msxml2.XMLHTTP");
    }

    return xhr;

}


// ajax call function
function ajaxCall(dataUrl, outputElement, callback, responseType) {

    // debug log
    if (DEBUG === 1) {console.log("ajax function");}

    // variable definitions
    var response,
        request = getHTTPObject();  // get the xmlhttp object which is supported

    outputElement.innerHTML = "Lade Daten ...";

    request.onreadystatechange = function() {

        if(request.readyState === 4 && request.status === 200) {

            //save ajax response
            if (responseType === "json") {
                response = JSON.parse(request.responseText);
            } else if (responseType === "xml") {
                response = request.responseXML;
            } else {
                response = request.responseText;
            }

            // check if callback is a function
            if(typeof callback === "function") {
                callback(response);
            }
        }
    };

    request.open("get", dataUrl, true);
    request.send(null);

}

// decode special characters with their utf-8 representation
function decodeHtml(token) {

    var i,
        y,
        start = [33, 58, 91, 123, 161],
        stop = [47, 64, 96, 126, 255],
        startLength = start.length;

    for (y = 0; y < startLength; y++) {
        for (i = start[y]; i <= stop[y]; i++) {
            token = token.replace("&#" + i +";", String.fromCharCode(255));
        }
    }

    return token;
}


// wrap all in anonymous function to get out of global scope
(function() {


    //variable definitions
    var serverUrl,                                              // this will hold the url we call with the ajaxCall() function
        target = document.getElementById("output"),             // get the html area where we print out the data
        searchForm = document.getElementById("search-form"),    // get the search form
        haltestelle;                                            // object with methods to get and process the data

    // debug log
    if (DEBUG === 1) {console.log("anonymous function");}

    // parse actual url and parse for protocol type (http/https)
    // set the ajax server url dependent on the protocol
    // for strato ssl-proxy, we have to insert the 1st part of the url path
    serverUrl = window.location.protocol + "//" +  window.location.hostname;

    if (serverUrl.indexOf("https") === -1) {
        serverUrl += "/cgi-bin/";
    } else {
        serverUrl += "/" + window.location.pathname.split("/")[1] + "/cgi-bin/";
    }

    // haltestelle object
    haltestelle = {

        getAbfahrten : function (event) {

            // debug log
            if (DEBUG === 1) {console.log("getAbfahrten() method");}

            // prevent submit default behaviour
            event.preventDefault();

            // construct ajax url
            var hstName = document.getElementById("q").value,
                hstUrl  = encodeURI(serverUrl + "abfahrtsmonitor.py?query=abfahrten.do&ort=dresden&hst=" + hstName);

            // get the data from the server with an ajax call
            ajaxCall(hstUrl, target, haltestelle.processAbfahrten, "text");

        },

        processAbfahrten : function (data) {

            // debug log
            if (DEBUG === 1) {console.log("processAbfahrten() method");}
            if (DEBUG === 1) {console.log("received data: " + data);}

            //variable definitions
            var i,
                y,
                htmlOutput,
                entry,
                dataLength;

            // process of response only if it's not empty
            if (data.indexOf("[]") !== -1) {  // there was an empty response

                haltestelle.getHaltestellen();

            } else {

                // replace useless chars & split string into array
                data = data.replace(/\(.+?\)/gi, '');    // remove all content in round parentheses
                data = data.replace(/<(.+?)>/gi, '$1');  // remove tag parentheses to prevent code injection
                data = data.slice(3, -3).split("],[");   // split at array boundaries to get an array of arrays

                // debug log
                if (DEBUG === 1) {console.log("parsed data: " + data);}

                dataLength = data.length;

                // generate table header
                htmlOutput = "<table>";
                htmlOutput += "<tr>";
                htmlOutput += "<th>Linie</th>";
                htmlOutput += "<th>Richtung</th>";
                htmlOutput += "<th>Abfahrt</th>";
                htmlOutput += "</tr>";

                // generate table entries
                for (i = 0; i < dataLength; i++) {

                    htmlOutput += "<tr>";
                    entry = data[i].split(",");

                    // debug log
                    if (DEBUG === 1) {console.log("part " + i + " of parsed data: " + entry);}

                    for (y = 0; y < 3; y++) {

                        // debug log
                        if (DEBUG === 1) {console.log("part " + y + ": " + entry[y]);}
                        htmlOutput += "<td>" + entry[y].slice(1, -1) + "</td>";

                    }

                    htmlOutput += "</tr>";

                }

                // close table
                htmlOutput += "</table>";
                // print content into web page
                target.innerHTML = htmlOutput;

            }

        },

        getHaltestellen : function () {

            // debug log
            if (DEBUG === 1) {console.log("getHaltestellen() method");}

            // prevent submit default behaviour
            //event.preventDefault();

            // construct ajax url
            var hstName = document.getElementById("q").value,
                hstUrl  = encodeURI(serverUrl + "abfahrtsmonitor.py?query=haltestelle.do&ort=dresden&hst=" + hstName);

            // get the data from the server with an ajax call
            ajaxCall(hstUrl, target, haltestelle.processHaltestellen, "text");

        },

        processHaltestellen : function (data) {

            // debug log
            if (DEBUG === 1) {console.log("processHaltestellen() method");}
            if (DEBUG === 1) {console.log("received data: " + data);}

            //variable definitions
            var i,
                entry,
                dataLength,
                htmlOutput;

            // process of response only if it's not empty
            if (data.indexOf("[]") !== -1) {

                htmlOutput = "<p>unbekannte Haltstelle, bitte erneut versuchen</p>";

            } else {

                // replace useless chars & split string into array
                data = data.replace(/\[\[\[.+?\]\],/gi, '[');   // remove useless first city entry
                data = data.replace(/\(.+?\)/gi, '');       // remove all content in round parentheses
                data = data.replace(/<(.+?)>/gi, '$1');     // remove tag parentheses to prevent code injection
                data = data.slice(4, -4).split("],[");      // split at array boundaries to get an array of arrays

                // debug log
                if (DEBUG === 1) {console.log("parsed data: " + data);}

                dataLength = data.length;

                // generate table header
                htmlOutput = "<table>";

                // generate table entries
                for (i = 0; i < dataLength; i++) {

                    htmlOutput += "<tr>";
                    entry = data[i].split(",");
                    // debug log
                    if (DEBUG === 1) {console.log("part " + i + " of parsed data: " + entry);}

                    htmlOutput += "<td>" + entry[0].slice(1, -1) + "</td>";
                    htmlOutput += "</tr>";

                }

                // close table
                htmlOutput += "</table>";

            }

            // print content into web page
            target.innerHTML = htmlOutput;

        }

    };

    //event listeners
    searchForm.addEventListener("submit", haltestelle.getAbfahrten, false);
    //searchForm.addEventListener("submit", haltestelle.getHaltestellen, false);

}());  // end of anonymous function
