var ledStripe = require('ledstripe');
var settings = require('./settings');
var pngparse = require('pngparse');
var http = require('http');

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
        var options = {
            hostname: settings.jenkinsHost,
            path: settings.jenkinsPath
        };

        if (settings.jenkinsAuth) {
            options.auth = settings.jenkinsAuth;
        }

        var req = http.request(options, function(res) {
            res.on('data', function (chunk) {
                handleCiAnswer(chunk);
            });
        });

        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });

        req.end();


//        connect();
//        ledStripe.fill(0x00, 0x00, 0x00);
//        disconnect()
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

function handleCiAnswer(content)  {
    var jobs = JSON.parse(content).jobs;

    var pixelBuffer = new Buffer(settings.numLEDs*3);
    // clear buffer
    for (var i=0; i<pixelBuffer.length; i++){
        pixelBuffer[i]=0;
    }
    // fill projects into buffers
    for (var i=0; i<jobs.length; i++){
        console.log(jobs[i].name);
        for (var j=0;j<3;j++) {
            pixelBuffer[(i*3)+j] = settings.colors[jobs[i].color][j];
        }
    }

    connect();
    ledStripe.sendRgbBuf(pixelBuffer);
    disconnect();
}

