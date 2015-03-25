var request = require("request");
var config = require('../config');

exports.getByOperatorId = function (req, res, next) {
    var operatorId = req.body.operatorId;
    request.post({
        url: config.netCareServer + '/customers/cusGroupByOperator',
        form: {
            operatorId: operatorId
        }
    }, function (err, response, body) {
        var jsonObject = JSON.parse(body);
        if (err) {
            console.error("get customers by operator error:", err, " (status: " + err.status + ")");
            if (err.status) {
                res.status(err.status).end();
            }
        }
        res.status(200).json(jsonObject);
    });
};

exports.statCusGroupCircuit = function (req, res, next) {
    var customerGroupId = req.body.customerGroupId;
    request.post({
        url: config.netCareServer + '/customers/statCusGroupCircuit',
        form: {
            customerGroupId: customerGroupId
        }
    }, function (err, response, body) {
        var jsonObject = JSON.parse(body);
        if (err) {
            console.error("get customers circuit stats error:", err, " (status: " + err.status + ")");
            if (err.status) {
                res.status(err.status).end();
            }
        }
        res.status(200).json(jsonObject);
    });
};
