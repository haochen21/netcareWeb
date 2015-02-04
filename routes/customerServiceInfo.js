var path = require('path');
var request = require("request");
var config = require('../config');

console.log(config.netCareServer); // this is the value for foo

exports.downloadFile = function (req, res, next) {
    var fileUrl=req.body.fileUrl;
    var fileName=req.body.fileName;

    var fileDir = path.join(__dirname, '..', 'public', 'assets', 'cusfile', req.params.customerGroupId, req.params.type,fileUrl);
    res.download(fileDir, fileName, function(err){
        if (err) {
            if (err.code === "ECONNABORT" && res.statusCode == 304) {
                // No problem, 304 means client cache hit, so no data sent.
                console.log('304 cache hit for ' + fileName);
                return;
            }
            console.error("SendFile error:", err, " (status: " + err.status + ")");
            if (err.status) {
                res.status(err.status).end();
            }
        } else {
            console.log('Sent:', fileName);
        }
    });
};

exports.getCusResourceLog = function (req, res, next) {
    var customerGroupId = req.params.customerGroupId;
    request(config.netCareServer + "/" + config.customerServiceName + "/cusResource?customerGroupId=" + customerGroupId, function (err, response, body) {
        var jsonObject = JSON.parse(body);
        console.log(body);
        if (err) {
            console.error("get customer resource file error:", err, " (status: " + err.status + ")");
            if (err.status) {
                res.status(err.status).end();
            }
        }
        res.status(200).json(jsonObject);
    });
};

