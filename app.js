var ledStripe = require('ledstripe');
var settings = require('./settings');
var pngparse = require('pngparse');
var http = require('http');
var fs = require('fs');

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
        startWebserver();
        connect();
        console.log('calling jenkins every ' + settings.jenkinsInterval + ' seconds');
        callJenkins();
        setInterval(function(){
            callJenkins();
        }, settings.jenkinsInterval*1000);
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

function startWebserver() {
    http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.readFile(__dirname + '/jobs/index.html', function(err, data){
            if (err) {
                res.end('No data from Jenkins available');
            } else {
                res.end(data);
            }
        });
    }).listen(3000);
    console.log('Server running at http://127.0.0.1:3000/');
}

function connect() {
    ledStripe.connect(settings.numLEDs, settings.stripeType, settings.spiDevice);
}

function disconnect() {
    ledStripe.disconnect();
}

function callJenkins() {
    var options = {
        hostname: settings.jenkinsHost,
        path: settings.jenkinsPath
    };

    if (settings.jenkinsAuth) {
        options.auth = settings.jenkinsAuth;
    }

    var req = http.request(options, function(res) {
        res.on('data', function (content) {
            handleCiAnswer(content);
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();
}

function handleCiAnswer(content)  {
    var jobs = JSON.parse(content).jobs.slice(0,settings.numLEDs);
    var htmlOutput = "";

    var pixelBuffer = new Buffer(settings.numLEDs*3);
    // clear buffer
    for (var i=0; i<pixelBuffer.length; i++){
        pixelBuffer[i]=0;
    }
    // fill projects into buffers
    for (var i=0; i<jobs.length; i++){
        htmlOutput += jobs[i].name + "<br />";
        for (var j=0;j<3;j++) {
            if (settings.reverseOrder) {
                pixelBuffer[settings.numLEDs - ((i*3)+j)] = settings.colors[jobs[i].color][j];
            } else {
                pixelBuffer[(i*3)+j] = settings.colors[jobs[i].color][j];
            }

        }
    }

    var date = new Date().toLocaleString();

    var htmlHeader = "<html><head><title>Jenkins Projects</title></head>"
                   + "<body><h1>Current Projects running on Jenkins</h1>"
                    + "<h2>Last updated at "+ date +"</h2>";
    var htmlFooter = "</body></html>";

    fs.writeFile(__dirname + '/jobs/index.html', htmlHeader + htmlOutput + htmlFooter);
    ledStripe.sendRgbBuf(pixelBuffer);
}

