var ledStripe = require('ledstripe');
var request = require('request');
var fs = require('fs');
var webserver = require('./webserver.js');

try {
    var settings = require('./settings');
} catch (err) {
    if (err.code == "MODULE_NOT_FOUND") {
        fs.writeFileSync('settings.js', fs.readFileSync('settings.js.dist'));
        var settings = require('./settings');
    } else {
        console.log('Error: ', err);
        process.exit(1);
    }
}

var myArgs = process.argv.slice(2);
if (myArgs.length == 1) {
    var command = myArgs[0];
    if (command == "ci") {
        webserver.start();
        connect();
        console.log('calling jenkins every ' + settings.jenkinsInterval + ' seconds');
        callJenkins();
        setInterval(function () {
            callJenkins();
        }, settings.jenkinsInterval * 1000);

    } else if (settings.stripeType != "none") {
        if (command == "off") {
            connect();
            ledStripe.fill(0x00, 0x00, 0x00);
            disconnect()
        } else if (command == "on") {
            connect();
            ledStripe.fill(0xAA, 0xAA, 0xAA);
            disconnect()
        }
    }
} else {
    console.log("\nSettings for your led-stripe are in settings.js");
    console.log("\nUsage:\tnode app <command>\n\n"
        + "where \t<command> can be one of the following commands:\n\n"
        + "\tci : run ci mode\n"
        + "\toff : turn all leds off\n"
        + "\ton : turn all leds on\n"
    )
}

function connect() {
    if (settings.stripeType != "none") {
        if (!ledStripe.connect(settings.numLEDs, settings.stripeType, settings.spiDevice)) {
            console.log("Can't access device, running simulation mode");
            settings.stripeType = "none";
        }
    }
}

function disconnect() {
    if (settings.stripeType != "none") {
        ledStripe.disconnect();
    }
}

function callJenkins() {
    request(settings.jenkinsUrl + settings.jenkinsPath, {
            'auth': {
                'user': settings.jenkinsAuth.user,
                'pass': settings.jenkinsAuth.password
            }
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                handleCiAnswer(body);
            } else {
                console.log('problem with request: ' + error);
            }
        });
}

function handleCiAnswer(content) {
    var jobs = JSON.parse(content).jobs;
    var jobsLimitedToLEDs = jobs.slice(0, settings.numLEDs);

    var pixelBuffer = new Buffer(settings.numLEDs * 3);
    // clear buffer
    for (var i = 0; i < pixelBuffer.length; i++) {
        pixelBuffer[i] = 0;
    }
    // fill projects into buffers
    for (var i = 0; i < jobsLimitedToLEDs.length; i++) {
        for (var j = 0; j < 3; j++) {
            if (settings.reverseOrder) {
                pixelBuffer[(settings.numLEDs - 1) * 3 - (i * 3) + j] = settings.colors[jobsLimitedToLEDs[i].color][j];
            } else {
                pixelBuffer[(i * 3) + j] = settings.colors[jobsLimitedToLEDs[i].color][j];
            }

        }
    }
    webserver.write(jobs);

    if (settings.stripeType != "none") {
        ledStripe.sendRgbBuf(pixelBuffer);
    }
}

