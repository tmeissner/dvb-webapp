/**
 * Created with JetBrains WebStorm.
 * User: torsten
 * Date: 28.03.13
 * Time: 23:07
 * To change this template use File | Settings | File Templates.
 */


var gcf = {


    // decode special characters with their utf-8 representation
    decodeHtml : function (token) {

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
    },


    // xmlhttp object function
    getHTTPObject : function () {

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

    },


    // ajax call function
    ajaxCall : function (dataUrl, outputElement, callback, responseType) {

        // debug log
        if (DEBUG === 1) {console.log("ajax function");}

        // variable definitions
        var response,
            request = this.getHTTPObject();  // get the xmlhttp object which is supported

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


}