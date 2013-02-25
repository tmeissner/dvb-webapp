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
            var response = eval(request.responseText);

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

    var wurst = [["13","Prohlis","754"],["13","Prohlis","754"],["13","Prohlis","754"],["13","Prohlis","754"]];
    console.log(wurst[0][0]);

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

                var i;
                var y;
                var dataLength = data.length;

                target.innerHTML =  "<table>";
                target.innerHTML += "<tr>";
                target.innerHTML += "<th>Linie</th>";
                target.innerHTML += "<th>Richtung</th>";
                target.innerHTML += "<th>Abfahrt</th>";
                target.innerHTML += "</tr>";

                for (i = 0; i < dataLength; i++) {
                    target.innerHTML += "<tr>";
                    for (y = 0; y < 3; y++) {
                        target.innerHTML += "<td>" + data[i][y] + "</td>";
                    }
                    target.innerHTML += "</tr>";
                }

                target.innerHTML += "</table>";
            });
        }
    };

    //event listeners
    searchForm.addEventListener("submit", haltestelle.getInfo, false);

})();  // end of anonymous function
