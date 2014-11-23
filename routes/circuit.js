var fs = require('fs');

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