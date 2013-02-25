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

                console.log("received data: " + data);

                data = data.replace(/\],\[/gi, '#');
                data = data.slice(2,-2);
                data = data.split("#");

                console.log("parsed data: " + data);

                var i;
                var y;
                var htmlOutput;
                var dataLength = data.length;

                htmlOutput =  "<table>";
                htmlOutput += "<tr>";
                htmlOutput += "<th>Linie</th>";
                htmlOutput += "<th>Richtung</th>";
                htmlOutput += "<th>Abfahrt</th>";
                htmlOutput += "</tr>";

                for (i = 0; i < dataLength; i++) {
                    htmlOutput += "<tr>";
                    var trala = data[i].split(",");
                    console.log("part " + i + " of parsed data: " + data)
                    for (y = 0; y < 3; y++) {
                        console.log("part " + y + ": " + data[y])
                        htmlOutput += "<td>" + data[y].slice(1,-1) + "</td>";
                    }
                    htmlOutput += "</tr>";
                }

                htmlOutput += "</table>";

                // print table into web page
                target.innerHTML = htmlOutput;
            });
        }
    };

    //event listeners
    searchForm.addEventListener("submit", haltestelle.getInfo, false);

})();  // end of anonymous function
