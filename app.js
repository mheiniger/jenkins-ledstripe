var ledStripe = require('ledstripe');

var myArgs = process.argv.slice(2);
if (myArgs.length == 1) {
    if (myArgs[0] == "off") {
        ledStripe.connect(32, "LPD8806", "/dev/spidev0.0");
        ledStripe.fill(0x00, 0x00, 0x00);
    }
    if (myArgs[0] == "on") {
        ledStripe.connect(32, "LPD8806", "/dev/spidev0.0");
        ledStripe.fill(0xAA, 0xAA, 0xAA);
    }
    if (myArgs[0] == "ci") {
        ledStripe.connect(32, "LPD8806", "/dev/spidev0.0");
        ledStripe.fill(0x00, 0x00, 0x00);
    }
    if (myArgs[0] == "ci") {
        ledStripe.connect(32, "LPD8806", "/dev/spidev0.0");
        ledStripe.fill(0xFF, 0x00, 0x00);
        setTimeout(function(){
            ledStripe.fill(0x00, 0xFF, 0x00);
        }, 1000);
        setTimeout(function(){
            ledStripe.fill(0x00, 0x00, 0xFF);
        }, 2000);
        setTimeout(function(){
            ledStripe.fill(0xFF, 0xFF, 0xFF);
        }, 3000);
    }

} else {
    console.log( "\nUsage:\tnode app <command>\n\n"
        +"where \t<command> can be one of the following commands:\n\n"
        +"\toff : turn all leds off\n"
        +"\ton : turn all leds on\n"
        +"\tci : run ci mode\n"
        +"\tdemo : demo mode without connecting to a real server\n\n"
    )
}
