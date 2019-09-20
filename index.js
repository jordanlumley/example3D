var express = require('express');
var app = express();
var path = require('path');

var parseString = require('xml2js').parseString;

var fs = require('fs');

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/getxml', function (req, res) {

    fs.readFile('./public/assets/xml/latest.xml', "utf-8", function (err, data) {
        console.log(data)
        if (err) {
            console.log(err);
            return;
        }
        try {
            parseString(data, function (err, result) {
                // console.dir(result);
                res.send(result);
            });
        }
        catch (err) {
            console.log(err)
        }
    });
});


app.listen(5000, function () {
    console.log(`Listening`);
});