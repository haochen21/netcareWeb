var app = require('../server').app;
var assert = require('assert');
var superagent = require('superagent');

var port = 'http://localhost:' + app.get('port');

app.listen(app.get('port'), function () {
    console.log('server listening on port ' + app.get('port'));
});

describe('APPLICATION API', function () {
    it('login success', function (done) {
        superagent.post('http://localhost:3000/api/login')
            .send({loginName: 'admin', password: 'abcd1234'})
            .end(function (res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.type, 'AUTHORIZED');
                console.log(res.body.user);
                done();
            })
    })


    it('login password error', function (done) {
        superagent.post('http://localhost:3000/api/login')
            .send({loginName: 'admin', password: 'abcd'})
            .end(function (res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.type, 'PASSWORDERROR');
                done();
            })
    })

    it('login loginName error', function (done) {
        superagent.post('http://localhost:3000/api/login')
            .send({loginName: 'errorName', password: 'abcd1234'})
            .end(function (res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.type, 'LOGINNAMEERROR');
                done();
            })
    })
})