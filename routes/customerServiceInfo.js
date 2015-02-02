var path = require('path');

exports.downloadFile  = function(req,res,next){
    var options = {
        root: path.join(__dirname, '..','public','assets','cusfile',req.params.customerGroupId,req.params.type),
        dotfiles: 'ignore',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    var fileName = req.params.fileName;

    res.sendFile(fileName, options, function (err) {
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
        }
        else {
            console.log('Sent:', fileName);
        }
    });
};
