PearlEdit BETA Version
======================

PearlEdit is a live WYSIWYG layout editor that allows for in browser customization, and guaranteeing responsive themes.


Live DEMO: http://pearledit.aws.af.cm/


Support
-------

Use Chrome(recommended) or FireFox for best suppport. 

I am using a MAMP(http://www.mamp.info) server to run PearlEdit locally (WAMP for Windows users & LAMP for Linux users). I am still trying to figure out alternative ways to run this program. Since I am using CGI with Python to create the 'download' feature, 
I am still looking for hosting options that will support CGI, or an alternative way to accomplish the 
download feature


Start Program(using MAMP server)
--------------------------------

1. Start MAMP server

2. Copy all folders and files in the root directory of this project in to MAMP's htdocs folder  

3. Copy downloadLayout.py from the cgi-bin folder into the cgi-bin folder in MAMP.

4. In index.html and downloadLayout.py, change all references of the localhost port to the port MAMP uses. Mines is port 8888.(e.g. http://localhost:8888/)


Technology
----------
YUI - http://yuilibrary.com

Pure CSS - http://www.purecss.io

HTML5 Drag & Drop

PHP

Features
--------

Drag & Drop elements to adjust layout

Live Text Editing

Font Editing

Responsive Themes


Instructions
------------

First, select layout. 

- Drag & Drop Elements: Click and hold elements for about 3 seconds to initiate drag & drop

- Editing Text: Triple-click on text


Features in Progress(See branches)
----------------------------------

- Color Picker: Allows users to change the background and font color of elements.
- DD Elements: Drag & Drop additional UI Elements into DOM such as forms, tables, buttons, slideshows, etc.
- DD Images: Allows users to drag & drop images from a desktop into DOM, and replace filler images.


Known Bugs
----------

- Alternatve method to creating the 'download' feature rather than using a python CGI script. A PHP script will most likely be a better option due to more support from hosting services.
- Editing gears do not function yet. Edit gears were meant to allow users to edit individual elements.


License
-------
This software is free to use under the Yahoo! Inc. BSD license. See the LICENSE file for license text and copyright information.