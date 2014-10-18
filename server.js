var formidable = require('formidable');
var express = require('express');
var fs = require('fs');
var path = require('path');

var app = express();

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
};

app.use(allowCrossDomain);

app.route('/').post(function (req, resp) {
    if (req.method.toString() == 'POST') {
        var form = new formidable.IncomingForm();
        var uploaded_file;
        form.uploadDir = "./files";
        form.on('file', function (field, file) {
            uploaded_file = file.name;
            fs.rename(file.path, path.dirname(file.path) + '\\' + file.name, function (err) {
                if (err) {
                    console.error('rename failed' + err);
                }
            });
        });
        form.on('progress', function (byteReceived, byteExpected) {
            console.log('Uploaded: ' + Math.round(byteReceived / byteExpected * 100) + '%');
        });
        form.on('end', function () {
            resp.writeHead(200, {'content-type': 'text/plain'});
            resp.write("Uploaded file: " + uploaded_file);
            resp.write("\n");
            resp.end("Done");
        });
        form.parse(req);
    }
});


var server = app.listen(5578, function () {
    console.log('Upload server listening on port %d', server.address().port);
});