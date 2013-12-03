var settings = {};

settings.numLEDs = 32;
settings.stripeType = "LPD8806"; // choose between "LPD8806" and "WS2801"
settings.spiDevice = "/dev/spidev0.0";

module.exports = settings;
