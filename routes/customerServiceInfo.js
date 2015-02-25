var path = require('path');
var request = require("request");
var config = require('../config');

console.log(config.netCareServer); // this is the value for foo

exports.downloadFile = function (req, res, next) {
    var logFileId = req.params.logFileId;
    request(config.netCareServer + "/" + config.customerServiceName + "/cusFileLog?id=" + logFileId, function (err, response, body) {
        if (err) {
            console.error("get customer resource file error:", err, " (status: " + err.status + ")");
            if (err.status) {
                res.status(err.status).end();
            }
        }
        var fileLog = JSON.parse(body);
        var customerGroupId = '' + fileLog.customerGroupId;
        var fileType = '0';
        if (fileLog.fileType === '客户资源') {
            fileType = '1';
        } else if (fileLog.fileType === '网络运行报告') {
            fileType = '2';
        } else if (fileLog.fileType === '服务例会(客户拜访)') {
            fileType = '3';
        } else if (fileLog.fileType === '巡检服务(客户端巡检)') {
            fileType = '4';
        }else if (fileLog.fileType === 'SLA资料') {
            fileType = '5';
        }
        var fileName = fileLog.fileName;
        var lastIndex = fileName.lastIndexOf('.');
        var fileExtendName = fileName.substr(lastIndex);
        var fileUrl = fileLog.fileUrl + fileExtendName;

        var fileDir = path.join(__dirname, '..', 'public', 'assets', 'cusfile', customerGroupId, fileType, fileUrl);
        res.download(fileDir, fileName, function (err) {
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
    });

    var fileUrl = req.params.fileUrl;


};

exports.getCusResourceLog = function (req, res, next) {
    var customerGroupId = req.params.customerGroupId;
    request(config.netCareServer + "/" + config.customerServiceName + "/cusResource?customerGroupId=" + customerGroupId, function (err, response, body) {
        var jsonObject = JSON.parse(body);
        if (err) {
            console.error("get customer resource file error:", err, " (status: " + err.status + ")");
            if (err.status) {
                res.status(err.status).end();
            }
        }
        res.status(200).json(jsonObject);
    });
};

exports.getCusSlaChart = function (req, res, next) {
    var customerGroupId = req.body.customerGroupId;
    var beginDate = req.body.beginDate;
    var endDate = req.body.endDate;
    request.post({
        url: config.netCareServer + '/' + config.customerServiceName + '/slaChart',
        form: {
            customerGroupId: customerGroupId,
            beginDate: beginDate,
            endDate: endDate
        }
    }, function (err, response, body) {
        var jsonObject = JSON.parse(body);
        if (err) {
            console.error("get customer sla chart error:", err, " (status: " + err.status + ")");
            if (err.status) {
                res.status(err.status).end();
            }
        }
        res.status(200).json(jsonObject);
    });
};

exports.getCusSlaTable = function (req, res, next) {
    var customerGroupId = req.body.customerGroupId;
    var beginDate = req.body.beginDate;
    var endDate = req.body.endDate;
    request.post({
        url: config.netCareServer + '/' + config.customerServiceName + '/slaTable',
        form: {
            customerGroupId: customerGroupId,
            beginDate: beginDate,
            endDate: endDate
        }
    }, function (err, response, body) {
        var jsonObject = JSON.parse(body);
        if (err) {
            console.error("get customer sla table error:", err, " (status: " + err.status + ")");
            if (err.status) {
                res.status(err.status).end();
            }
        }
        res.status(200).json(jsonObject);
    });
};

exports.getCusSlaDoc = function (req, res, next) {
    var customerGroupId = req.params.customerGroupId;
    request(config.netCareServer + "/" + config.customerServiceName + "/slaDoc?customerGroupId=" + customerGroupId, function (err, response, body) {
        var jsonObject = JSON.parse(body);
        if (err) {
            console.error("get customer sla doc file error:", err, " (status: " + err.status + ")");
            if (err.status) {
                res.status(err.status).end();
            }
        }
        res.status(200).json(jsonObject);
    });
};

exports.getNetOpsLog = function (req, res, next) {
    var customerGroupId = req.body.customerGroupId;
    var beginDate = req.body.beginDate;
    var endDate = req.body.endDate;
    request.post({
        url: config.netCareServer + '/' + config.customerServiceName + '/netOpsLog',
        form: {
            customerGroupId: customerGroupId,
            beginDate: beginDate,
            endDate: endDate
        }
    }, function (err, response, body) {
        var jsonObject = JSON.parse(body);
        if (err) {
            console.error("get network operations error:", err, " (status: " + err.status + ")");
            if (err.status) {
                res.status(err.status).end();
            }
        }
        res.status(200).json(jsonObject);
    });
};

exports.getServiceMeetingLog = function (req, res, next) {
    var customerGroupId = req.body.customerGroupId;
    var beginDate = req.body.beginDate;
    var endDate = req.body.endDate;
    request.post({
        url: config.netCareServer + '/' + config.customerServiceName + '/serviceMeetingLog',
        form: {
            customerGroupId: customerGroupId,
            beginDate: beginDate,
            endDate: endDate
        }
    }, function (err, response, body) {
        var jsonObject = JSON.parse(body);
        if (err) {
            console.error("get service meeting error:", err, " (status: " + err.status + ")");
            if (err.status) {
                res.status(err.status).end();
            }
        }
        res.status(200).json(jsonObject);
    });
};