var fs = require('fs');
var http = require('http');
var settings = require('./settings');

module.exports = Webserver;
module.exports.start = start;
module.exports.write = write;

function Webserver() {

}

function start() {
    http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.readFile(__dirname + '/jobs/index.html', function (err, data) {
            if (err) {
                res.end('No data from Jenkins available');
            } else {
                res.end(data);
            }
        });
    }).listen(3000);
    console.log('Server running at http://127.0.0.1:3000/');
}

function write(jobs) {
    var htmlOutput = "";
    for (var i = 0; i < jobs.length; i++) {
        htmlOutput += '<span style="background-color:rgb('
            + settings.colors[jobs[i].color][0] + ', '
            + settings.colors[jobs[i].color][1] + ', '
            + settings.colors[jobs[i].color][2] + ');">&nbsp;&nbsp;</span> '
            + jobs[i].name + "<br />";
    }

    var date = new Date().toLocaleString();

    var htmlHeader = "<html><head><title>Jenkins Projects</title></head>"
        + "<body><h1>Current Projects running on Jenkins</h1>"
        + "<h2>Last updated at " + date + "</h2>";
    var htmlFooter = "</body></html>";

    fs.writeFile(__dirname + '/jobs/index.html', htmlHeader + htmlOutput + htmlFooter);
}