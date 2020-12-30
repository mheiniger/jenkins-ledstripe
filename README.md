jenkins-ledstripe
=================

## Warning !
This project is not up to date anymore. It was made for Nodejs 0.10 and the Raspberry Pi 1 and the Jenkins version that I was using back in 2013. So use this at your own risk.

## Description
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
* Fontsize: 51
* Line spacing: 1.5

RaspberryPi setup
-----------------
* I'm using an standard Raspbian Wheezy Linux.
* The connection to the ledstripe is made like this: http://learn.adafruit.com/light-painting-with-raspberry-pi/hardware
* I installed the newest NodeJS version available according to this guide: http://blog.rueedlinger.ch/2013/03/raspberry-pi-and-nodejs-basic-setup/
* I enabled the SPI device with ```sudo raspi-config``` -> "8 Advanced Options" -> "A5 SPI"
* I added access to the SPI device for the (non root) user pi. See here: http://quick2wire.com/non-root-access-to-spi-on-the-pi/
