jenkins-ledstripe
=================

Display the jenkins build-status of your projects with help of a raspberry-pi and an led-stripe.

Setup
-----

* Copy settings.js.dist to settings.js and adjust your settings.
* Run ```node app ci```
* Look what your led stripe shows.

Webserver
---------
There's a little built-in webserver at http://yourRaspi:3000 where you see the currently scanned Jenkins projects (in case you want to print it out) and when it has been updated the last time.

Printing projects
-----------------
For a 1 meter 32-led strip i used the following settings:
* Program: Openoffice Writer
* Paper: A4
* Borders: the smallest amount possible, 0.41cm on my printer
* Font: Liberation Serif
* Line spacing: 1.5

