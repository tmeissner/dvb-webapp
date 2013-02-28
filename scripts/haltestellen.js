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
    var response;
    var request = getHTTPObject();  // get the xmlhttp object which is supported

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


// wrap all in anonymous function to get out of global scope
(function() {

    //variable definitions
    var serverUrl;
    var origin = window.location.origin.indexOf("www.goodcleanfun.de");

    // debug log
    if (DEBUG === 1) {console.log("anonymous function");}

    // server url
    if (origin === -1) {
        serverUrl = "http://goodcleanfun.de/cgi-bin/";
    } else {
        serverUrl = "http://www.goodcleanfun.de/cgi-bin/";
    }

    // get the search form
    var searchForm = document.getElementById("search-form");

    // haltestelle object
    var haltestelle = {


        getInfo : function(event) {

            // debug log
            if (DEBUG === 1) {console.log("getInfo function");}

            // prevent submit default behaviour
            event.preventDefault();

            // get output area
            var target  = document.getElementById("output");
            var hstName = document.getElementById("q").value;
            var hstUrl  = encodeURI(serverUrl + "abfahrtsmonitor.py?ort=dresden&hst=" + hstName);

            // get the data from the server with an ajax call
            ajaxCall(hstUrl, target, function(data) {

                // debug log
                if (DEBUG === 1) {console.log("received data: " + data);}

                //variable definitions
                var i;
                var y;
                var htmlOutput;
                var entry;
                var dataLength;

                // process of response only if it's not empty
                if (data.indexOf("[]") === -1) {

                    // replace useless chars
                    // split string into array
                    data = data.replace(/\],\[/gi, '#');
                    data = data.replace(/\(.+?\)/gi, '');
                    data = data.replace('ß', 'ss');
                    data = data.replace(/<(.+?)>/gi, '$1');
                    data = data.slice(3,-3).split("#");

                    // debug log
                    if (DEBUG === 1) {console.log("parsed data: " + data);}

                    dataLength = data.length;

                    // generate table header
                    htmlOutput =  "<table>";
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
                            htmlOutput += "<td>" + entry[y].slice(1,-1) + "</td>";
                        }
                        htmlOutput += "</tr>";
                    }
                    // close table
                    htmlOutput += "</table>";
                } else {  // there was an empty response
                    htmlOutput =  "<p>Haltestelleneingabe nicht eindeutig</p>";
                }

                // print content into web page
                target.innerHTML = htmlOutput;
            }, "text");
        }
    };

    //event listeners
    searchForm.addEventListener("submit", haltestelle.getInfo, false);

})();  // end of anonymous function
