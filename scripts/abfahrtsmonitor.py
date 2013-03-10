#!/usr/bin/python
# -*- coding: iso-8859-1 -*-

import cgi
import urllib
import urllib2


# get cgi object
form = cgi.FieldStorage()

url = "http://widgets.vvo-online.de/abfahrtsmonitor/"
query = ""

queries = {
    "ort": "",
    "hst": "",
    "vz": "",
    "vm": "",
    "timestamp": ""
}

# available server scripts = valid queries
validqueries = ["haltestelle.do", "abfahrten.do"]

# check for queries
if (form.getvalue('query')):
    query = form.getvalue('query')

for key in queries:
#.viewkeys():
    if (form.getvalue(key)):
        queries[key] = form.getvalue(key)

# call the vvo server if the query is valid
if (query in validqueries):
    url += query + "?" + urllib.urlencode(queries)
    data = urllib2.urlopen(url).read()
else:
    data = "[]"

# return the http response with the data received from server
# or an empty array if query was invalid
print("Content-type: text/html\n\n")
print(data)
