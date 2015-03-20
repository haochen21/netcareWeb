var fs = require('fs');
var request = require("request");
var config = require('../config');

exports.getCircuit = function (req, res, next) {
    fs.readFile('./public/json/circuit.json', function (err, data) {
            if (err) {
                console.error(err);
                res.end('Server Error');
            }
            else {
                var circuits = JSON.parse(data.toString());
                res.status(200).json(circuits);
            }
        }
    )
};

exports.getByCusGroupAndServiceType = function (req, res, next) {
    var customerGroupId = req.body.customerGroupId;
    var serviceType = req.body.serviceType;
    request.post({
        url: config.netCareServer + '/circuits/findByServiceType',
        form: {
            customerGroupId: customerGroupId,
            serviceType: serviceType
        }
    }, function (err, response, body) {
        var jsonObject = JSON.parse(body);
        if (err) {
            console.error("get business status site circuit error:", err, " (status: " + err.status + ")");
            if (err.status) {
                res.status(err.status).end();
            }
        }
        res.status(200).json(jsonObject);
    });
};

exports.getTextRoute = function (req, res, next) {
    var circuitId = req.body.circuitId;
    var url =  config.netCareServer + '/circuits/textRoute/?circuitId='+circuitId;
    request(url, function (err, response, body) {
        var jsonpData = body;
        var startPos = jsonpData.indexOf('({');
        var endPos = jsonpData.indexOf('})');
        var jsonString = jsonpData.substring(startPos+1, endPos+1);
        var jsonObject = JSON.parse(jsonString);
        if (err) {
            console.error("get circuit text route error:", err, " (status: " + err.status + ")");
            if (err.status) {
                res.status(err.status).end();
            }
        }
        res.status(200).json(jsonObject);
    });
};

exports.getRoute = function (req, res, next) {
    var circuitId = req.body.circuitId;
    var operatorId = req.body.operatorId;
    var url =  config.netCareServer + '/circuits/route/?opId='+operatorId+'&circuitId='+circuitId;
    request(url, function (err, response, body) {
        var jsonpData = body;
        var startPos = jsonpData.indexOf('( {');
        if(startPos === -1){
            startPos = jsonpData.indexOf('({');
        }
        var endPos = jsonpData.indexOf('})');
        var jsonString = jsonpData.substring(startPos+1, endPos+1);
        var jsonObject = JSON.parse(jsonString);
        if (err) {
            console.error("get circuit route error:", err, " (status: " + err.status + ")");
            if (err.status) {
                res.status(err.status).end();
            }
        }
        res.status(200).json(jsonObject);
    });
};