// server url
var serverUrl = "http://widgets.vvo-online.de/abfahrtsmonitor/";

// xmlhttp object function
function getHTTPObject() {

    console.log("xml http object function");

    var xhr;

    if(window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if(window.ActiveXObject) {
        xhr = new ActiveXObject("Msxml2.XMLHTTP");
    }

    return xhr;

}


// ajax call function
function ajaxCall(dataUrl, outputElement, callback) {

    console.log("ajax function");

    // get the xmlhttp object which is supported
    var request = getHTTPObject();

    outputElement.innerHTML = "Lade Daten ...";

    request.onreadystatechange = function() {

        if(request.readyState === 4 && request.status === 200) {

            //save ajax response
            var response = request.responseText;

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

    console.log("anonymous function");

    // get the search form
    var searchForm = document.getElementById("search-form");

    // haltestelle object
    var haltestelle = {

        getInfo : function(event) {

            console.log("getInfo function");

            // prevent submit default behaviour
            event.preventDefault();

            // get output area
            var target  = document.getElementById("output");
            var hstName = document.getElementById("q").value;
            var hstUrl  = serverUrl + "Abfahrten.do?ort=dresden&hst=" + hstName;

            ajaxCall(hstUrl, target, function(data) {

                target.innerHTML = "";

                target.innerHTML = "<p>" + data + "</p>";
            });
        }
    };

    //event listeners
    searchForm.addEventListener("submit", haltestelle.getInfo, false);

})();  // end of anonymous function
