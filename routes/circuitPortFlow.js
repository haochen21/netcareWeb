var request = require("request");
var config = require('../config');

exports.getCircuit = function (req, res, next) {
    var customerGroupId = req.body.customerGroupId;
    request.post({
        url: config.netCareServer + '/dataFlow/findCircuit',
        form: {
            customerGroupId: customerGroupId
        }
    }, function (err, response, body) {
        var jsonObject = JSON.parse(body);
        if (err) {
            console.error("get port data flow circuit error:", err, " (status: " + err.status + ")");
            if (err.status) {
                res.status(err.status).end();
            }
        }
        res.status(200).json(jsonObject);
    });
};

exports.getDailyFlow = function (req, res, next) {
    var beginDate = req.body.beginDate;
    var endDate = req.body.endDate;
    var circuitId = req.body.circuitId;
    request.post({
        url: config.netCareServer + '/dataFlow/dailyFlow',
        form: {
            beginDate: beginDate,
            endDate: endDate,
            circuitId: circuitId
        }
    }, function (err, response, body) {
        var jsonObject = JSON.parse(body);
        if (err) {
            console.error("get daily data flow error:", err, " (status: " + err.status + ")");
            if (err.status) {
                res.status(err.status).end();
            }
        }
        res.status(200).json(jsonObject);
    });
};

exports.getWeekFlow = function (req, res, next) {
    var beginDate = req.body.beginDate;
    var endDate = req.body.endDate;
    var circuitId = req.body.circuitId;
    request.post({
        url: config.netCareServer + '/dataFlow/weekFlow',
        form: {
            beginDate: beginDate,
            endDate: endDate,
            circuitId: circuitId
        }
    }, function (err, response, body) {
        var jsonObject = JSON.parse(body);
        if (err) {
            console.error("get week data flow error:", err, " (status: " + err.status + ")");
            if (err.status) {
                res.status(err.status).end();
            }
        }
        res.status(200).json(jsonObject);
    });
};

exports.getMonthFlow = function (req, res, next) {
    var beginDate = req.body.beginDate;
    var endDate = req.body.endDate;
    var circuitId = req.body.circuitId;
    request.post({
        url: config.netCareServer + '/dataFlow/monthFlow',
        form: {
            beginDate: beginDate,
            endDate: endDate,
            circuitId: circuitId
        }
    }, function (err, response, body) {
        var jsonObject = JSON.parse(body);
        if (err) {
            console.error("get month data flow error:", err, " (status: " + err.status + ")");
            if (err.status) {
                res.status(err.status).end();
            }
        }
        res.status(200).json(jsonObject);
    });
};

exports.getYearFlow = function (req, res, next) {
    var beginDate = req.body.beginDate;
    var endDate = req.body.endDate;
    var circuitId = req.body.circuitId;
    request.post({
        url: config.netCareServer + '/dataFlow/yearFlow',
        form: {
            beginDate: beginDate,
            endDate: endDate,
            circuitId: circuitId
        }
    }, function (err, response, body) {
        var jsonObject = JSON.parse(body);
        if (err) {
            console.error("get yearly data flow error:", err, " (status: " + err.status + ")");
            if (err.status) {
                res.status(err.status).end();
            }
        }
        res.status(200).json(jsonObject);
    });
};