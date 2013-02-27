#!/usr/bin/python
# -*- coding: iso-8859-1 -*-

import cgi
import urllib
import urllib2


# get cgi object
form = cgi.FieldStorage()

ort = ""
hst = ""
vz = ""
vm = ""
timestamp = ""

# check for queries
if (form.getvalue('ort')):
    ort = form.getvalue('ort')
if (form.getvalue('hst')):
    hst = form.getvalue('hst')
if (form.getvalue('vz')):
    vz = form.getvalue('vz')
if (form.getvalue('vz')):
    vm = form.getvalue('vz')
if (form.getvalue('timestamp')):
    timestamp = form.getvalue('timestamp')

queries = {
    "ort": ort,
    "hst": hst,
    "vz": vz,
    "vm": vm,
    "timestamp": timestamp
}

url = "http://widgets.vvo-online.de/abfahrtsmonitor/Abfahrten.do?" + urllib.urlencode(queries)
data = urllib2.urlopen(url).read()

print("Content-type: text/html\n\n")
print(data)
