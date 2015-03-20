var fs = require('fs');
var request = require("request");
var config = require('../config');

exports.getAlarm = function (req, res, next) {
    fs.readFile('./public/json/alarm.json', function (err, data) {
            if (err) {
                console.error(err);
                res.end('Server Error');
            }
            else {
                var alarms = JSON.parse(data.toString());
                res.status(200).json(alarms);
            }
        }
    )
};

exports.getByCusGroupAndServiceType = function (req, res, next) {
    var customerGroupId = req.body.customerGroupId;
    var serviceType = req.body.serviceType;
    request.post({
        url: config.netCareServer + '/alarms/findByServiceType',
        form: {
            customerGroupId: customerGroupId,
            serviceType: serviceType
        }
    }, function (err, response, body) {
        var jsonObject = JSON.parse(body);
        if (err) {
            console.error("get business status site bizAlarm error:", err, " (status: " + err.status + ")");
            if (err.status) {
                res.status(err.status).end();
            }
        }
        res.status(200).json(jsonObject);
    });
};

exports.getBizAlarmByCircuit = function (req, res, next) {
    var circuitId = req.body.circuitId;
    var url =  config.netCareServer + '/alarms/bizAlarmByCircuit/?circuitId='+circuitId;
    request(url, function (err, response, body) {
        var jsonpData = body;
        var startPos = jsonpData.indexOf('({');
        var endPos = jsonpData.indexOf('})');
        var jsonString = jsonpData.substring(startPos+1, endPos+1);
        var jsonObject = JSON.parse(jsonString);
        if (err) {
            console.error("get circuit biz alarm error:", err, " (status: " + err.status + ")");
            if (err.status) {
                res.status(err.status).end();
            }
        }
        res.status(200).json(jsonObject);
    });
};