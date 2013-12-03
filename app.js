var ledStripe = require('ledstripe');
var settings = require('./settings');
var pngparse = require('pngparse');

var myArgs = process.argv.slice(2);
if (myArgs.length == 1) {
    if (myArgs[0] == "off") {
        connect();
        ledStripe.fill(0x00, 0x00, 0x00);
        disconnect()
    }
    if (myArgs[0] == "on") {
        connect();
        ledStripe.fill(0xAA, 0xAA, 0xAA);
        disconnect()
    }
    if (myArgs[0] == "ci") {
        connect();
        ledStripe.fill(0x00, 0x00, 0x00);
        disconnect()
    }
    if (myArgs[0] == "demo") {
        connect();
        ledStripe.fill(0xFF, 0x00, 0x00);
        setTimeout(function(){
            ledStripe.fill(0x00, 0xFF, 0x00);
        }, 1000);
        setTimeout(function(){
            ledStripe.fill(0x00, 0x00, 0xFF);
        }, 2000);
        setTimeout(function(){
            ledStripe.fill(0xFF, 0xFF, 0xFF);
            disconnect()
        }, 3000);
    }

} else if (myArgs.length == 2) {
    if (myArgs[0] == "image") {
        connect();
        ledStripe.fill(0x00, 0x00, 0x00);
        disconnect();
        settings.numLEDs = 30; // example images are 30px wide
        connect();
        pngparse.parseFile(myArgs[1], function(err, data) {
            ledStripe.animate(data.data,'10m', function(){
                ledStripe.fill(0x00, 0x00, 0x00);
                disconnect();
            });
        });
    }

} else {
    console.log( "\nUsage:\tnode app <command>\n\n"
        +"where \t<command> can be one of the following commands:\n\n"
        +"\toff : turn all leds off\n"
        +"\ton : turn all leds on\n"
        +"\tci : run ci mode\n"
        +"\tdemo : demo mode without connecting to a real server\n"
        +"\timage name.png : display an image \n"
    )
}

function connect() {
    ledStripe.connect(settings.numLEDs, settings.stripeType, settings.spiDevice);
}

function disconnect() {
    ledStripe.disconnect();
}
