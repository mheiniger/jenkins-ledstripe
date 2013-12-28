var ledStripe = require('ledstripe');
var pngparse = require('pngparse');
var settings = require('./../settings');


var myArgs = process.argv.slice(2);
if (myArgs.length > 0) {
    var command = myArgs[0];

    if (command == "demo") {
        connect();
        ledStripe.fill(0xFF, 0x00, 0x00);
        setTimeout(function () {
            ledStripe.fill(0x00, 0xFF, 0x00);
        }, 1000);
        setTimeout(function () {
            ledStripe.fill(0x00, 0x00, 0xFF);
        }, 2000);
        setTimeout(function () {
            ledStripe.fill(0xFF, 0xFF, 0xFF);
            disconnect()
        }, 3000);
    }


    if (command == "image") {
        connect();
        ledStripe.fill(0x00, 0x00, 0x00);
        pngparse.parseFile(myArgs[1], function (err, data) {
            ledStripe.animate(data.data, '10m', function () {
                ledStripe.fill(0x00, 0x00, 0x00);
                disconnect();
            });
        });
    }
}

function connect() {
    ledStripe.connect(settings.numLEDs, settings.stripeType, settings.spiDevice);
}

function disconnect() {
    ledStripe.disconnect();
}