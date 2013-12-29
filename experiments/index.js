var ledStripe = require('ledstripe');
var pngparse = require('pngparse');
var settings = require('./../settings');
var http = require('http');
var fs = require('fs');
var nanotimer = require('nanotimer');

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

    if (command == "websocket") {

        var app = http.createServer(function (req, res) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            fs.readFile(__dirname + '/websocket.html', function (err, data) {
                res.end(data);
            });
        });
        var io = require('socket.io').listen(app);

        app.listen(3000);
        console.log('Server running at http://127.0.0.1:3000/');

        io.sockets.on('connection', function (socket) {
            pngparse.parseFile(myArgs[1], function (err, data) {
                animate(data.data, '50m', socket, function () {
                    console.log('done');
                });
            });


        });

    }
}

function animate(buffer,frameDelay, socket, callback){
    this.bytePerPixel = 3;
    var row = 0;
    var rows = buffer.length/(settings.numLEDs*this.bytePerPixel);
    if (rows != Math.ceil(rows)) {
        console.log("buffer size is not a multiple of frame size");
        return false;
    }
    var myTimer = new nanotimer();
    console.log("Writing " + rows + " rows for " + settings.numLEDs + " LEDs with delay " + frameDelay);
    myTimer.setInterval(function(){
        if (row>=rows){
            myTimer.clearInterval();
            if (callback)
                callback();
        } else {
            socket.emit('animate', buffer.slice(row * settings.numLEDs * this.bytePerPixel, (row + 1) * settings.numLEDs * this.bytePerPixel));
            //this.sendRgbBuf(buffer.slice(row * settings.numLEDs * this.bytePerPixel, (row + 1) * settings.numLEDs * this.bytePerPixel));
            row++;
        }
    }.bind(this), null, frameDelay, function(err) {
        if(err) {
            //error
        }
    });
} //end animate

function connect() {
    ledStripe.connect(settings.numLEDs, settings.stripeType, settings.spiDevice);
}

function disconnect() {
    ledStripe.disconnect();
}