// variable to en-/disable debug
// set to 1 to enable debug log
if (DEBUG === undefined) {
    var DEBUG = 1;
}



// wrap all in anonymous function to get out of global scope
(function() {


    //variable definitions
    var serverUrl = gcf.getCgiBinPath(),                        // the url of the cgi-bin folder with the scripts we call with the ajaxCall() function
        input = document.getElementById("input"),
        target = document.getElementById("output"),             // get the html area where we print out the data
        searchForm = document.getElementById("search-form"),    // get the search form
        lastHst,
        haltestelle;                                            // object with methods to get and process the data

    // debug log
    if (DEBUG === 1) {console.log("anonymous function");}

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

            lastHst = hstName;

            // get the data from the server with an ajax call
            gcf.ajaxCall(hstUrl, target, haltestelle.processAbfahrten, "text");

        },

        processAbfahrten : function (data) {

            // debug log
            if (DEBUG === 1) {console.log("processAbfahrten() method");}
            if (DEBUG === 1) {console.log("received data: " + data);}

            //variable definitions
            var i,
                y,
                htmlOutput,
                htmlInput,
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

                htmlInput  = "<label for='q'>Haltestelle</label>";
                htmlInput += "<input type='search' id='q' name='q' required placeholder='Haltestelle eingeben' value='" + lastHst + "'>";

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
                input.innerHTML  = htmlInput;

            }

        },

        getHaltestellen : function () {

            // debug log
            if (DEBUG === 1) {console.log("getHaltestellen() method");}

            // construct ajax url
            var hstName = document.getElementById("q").value,
                hstUrl  = encodeURI(serverUrl + "abfahrtsmonitor.py?query=haltestelle.do&ort=dresden&hst=" + hstName);

            // get the data from the server with an ajax call
            gcf.ajaxCall(hstUrl, target, haltestelle.processHaltestellen, "text");

        },

        processHaltestellen : function (data) {

            // debug log
            if (DEBUG === 1) {console.log("processHaltestellen() method");}
            if (DEBUG === 1) {console.log("received data: " + data);}

            //variable definitions
            var i,
                entry,
                dataLength,
                htmlInput,
                htmlOutput;

            // process of response only if it's not empty
            if (data.indexOf("[]") !== -1) {

                htmlOutput = "<p>unbekannte Haltstelle, bitte erneut versuchen</p>";

                target.innerHTML = htmlOutput;

            } else {

                // replace useless chars & split string into array
                data = data.replace(/\[\[\[.+?\]\],/gi, '[');   // remove useless first city entry
                data = data.replace(/\(.+?\)/gi, '');           // remove all content in round parentheses
                data = data.replace(/<(.+?)>/gi, '$1');         // remove tag parentheses to prevent code injection
                data = data.slice(4, -4).split("],[");          // split at array boundaries to get an array of arrays

                // debug log
                if (DEBUG === 1) {console.log("parsed data: " + data);}

                dataLength = data.length;

                // generate table header
                htmlInput  =  "<label for='q'>Haltestelle</label>";
                htmlInput += "<select id='q' name='q' required>";

                // generate table entries
                for (i = 0; i < dataLength; i++) {

                    entry = data[i].split(",");
                    // debug log
                    if (DEBUG === 1) {console.log("part " + i + " of parsed data: " + entry);}

                    htmlInput += "<option value='" + (entry[0].slice(1, -1)) + "'>" + (entry[0].slice(1, -1)) + "</option>";

                }

                // close table
                htmlInput += "</select>";

                input.innerHTML = htmlInput;

            }

        }

    };

    //event listeners
    searchForm.addEventListener("submit", haltestelle.getAbfahrten, false);

}());  // end of anonymous function
