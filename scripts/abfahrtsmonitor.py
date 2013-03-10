#!/usr/bin/python
# -*- coding: iso-8859-1 -*-

import cgi
import urllib
import urllib2


# get cgi object
form = cgi.FieldStorage()

url = "http://widgets.vvo-online.de/abfahrtsmonitor/"
querytype = ""
ort = ""
hst = ""
vz = ""
vm = ""
timestamp = ""

# check for queries
if (form.getvalue('query')):
    query = form.getvalue('query')
if (form.getvalue('ort')):
    ort = form.getvalue('ort')
if (form.getvalue('hst')):
    hst = form.getvalue('hst')
if (form.getvalue('vz')):
    vz = form.getvalue('vz')
if (form.getvalue('vm')):
    vm = form.getvalue('vm')
if (form.getvalue('timestamp')):
    timestamp = form.getvalue('timestamp')

validqueries = ["haltestelle.do", "abfahrten.do"]

queries = {
    "ort": ort,
    "hst": hst,
    "vz": vz,
    "vm": vm,
    "timestamp": timestamp
}

if (query in validqueries):
    url += query + "?" + urllib.urlencode(queries)
    data = urllib2.urlopen(url).read()
else:
    data = "[]"

print("Content-type: text/html\n\n")
print(data)
