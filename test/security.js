var app = require('../server').app;
var assert = require('assert');
var superagent = require('superagent');
var agent = superagent.agent();
var async = require('async');

var port = 'http://localhost:' + app.get('port');

app.listen(app.get('port'), function () {
    console.log('server listening on port ' + app.get('port'));
});

describe('security', function () {
    var user = {
        name: '陈昊',
        loginName: 'chenhao',
        plainPassword: 'abcd1234',
        admin: true,
        mobilePhone: '13817475681'
    };

    before(function (done) {
        agent.post(port + '/api/login/').send({
            loginName: 'admin',
            password: 'abcd1234'

        }).end(function (res) {
            assert.equal(res.status, 200);
            done();
        });
    });

    after(function (done) {
        done();
    });

    describe('user', function () {
        it('POST /api/users', function (done) {
            agent.post(port + '/api/users/')
                .send(user)
                .end(function (res) {
                    assert.equal(res.status, 200);
                    user = res.body;
                    assert(user._id);
                    done();
                });
        });

        it('save exist user POST /api/users', function (done) {
            agent.post(port + '/api/users/')
                .send({
                    name: '陈昊',
                    loginName: 'chenhao',
                    plainPassword: 'abcd1234',
                    admin: true,
                    mobilePhone: '13817475681'
                })
                .end(function (res) {
                    assert.equal(res.status, 500);
                    done();
                });
        });

        it('PUT /api/users', function (done) {
            agent.put(port + '/api/users/' + user._id)
                .send({
                    name: '昊陈',
                    password: 'abcd'
                })
                .end(function (res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.password, 'abcd');
                    superagent.post(port + '/api/login/')
                        .send({
                            loginName: 'chenhao',
                            password: 'abcd'
                        })
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            assert.equal(res.body.type, 'AUTHORIZED');
                            done();
                        });
                });
        });

        it('GET /api/users', function (done) {
            agent.get(port + '/api/users')
                .end(function (res) {
                    assert.equal(res.status, 200);
                    var user2 = res.body.filter(function (el, i, list) {
                        return (el._id === user._id);
                    });
                    assert(user2.length === 1);
                    done();
                });
        });

        it('DELETE /api/users', function (done) {
            assert(user._id != '');
            agent.del(port + '/api/users/' + user._id)
                .end(function (res) {
                    assert.equal(res.status, 200);
                    agent.get(port + '/api/users/' + user._id)
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            assert.equal(Object.keys(res.body).length, 0);
                            done();
                        });
                });
        });
    });

    describe('role', function () {
        var role = {
            name: 'roleTest',
            description: 'roleDescription'
        };
        it('GET /api/roles', function (done) {
            agent.get(port + '/api/roles')
                .end(function (res) {
                    assert.equal(res.status, 200);
                    var roles = res.body.filter(function (el, i, list) {
                        return (el.name === '管理员权限');
                    });
                    assert(roles.length === 1);
                    assert(roles[0].permissions.length === 5);
                    done();
                });
        });

        it('POST /api/roles', function (done) {
            agent.post(port + '/api/roles/')
                .send(role)
                .end(function (res) {
                    assert.equal(res.status, 200);
                    role = res.body;
                    assert(role._id);
                    done();
                });
        });

        it('save exist role POST /api/roles', function (done) {
            agent.post(port + '/api/roles/')
                .send({
                    name: 'roleTest',
                    description: 'roleDescription'
                })
                .end(function (res) {
                    assert.equal(res.status, 500);
                    done();
                });
        });

        it('PUT /api/roles', function (done) {
            agent.put(port + '/api/roles/' + role._id)
                .send({
                    name: 'roleTestTest'
                })
                .end(function (res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.name, 'roleTestTest');
                    done();
                });
        });

        it('DELETE /api/roles', function (done) {
            assert(role._id != '');
            agent.del(port + '/api/roles/' + role._id)
                .end(function (res) {
                    assert.equal(res.status, 200);
                    agent.get(port + '/api/roles/' + role._id)
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            assert.equal(Object.keys(res.body).length, 0);
                            done();
                        });
                });
        });
    });

    describe('permission', function () {
        var permission = {
            name: 'permissionTest',
            description: 'permissionDescription'
        };
        it('GET /api/permissions', function (done) {
            agent.get(port + '/api/permissions')
                .end(function (res) {
                    assert.equal(res.status, 200);
                    var permissions = res.body.filter(function (el, i, list) {
                        return (el.name === 'BUTTON_OPERATOR_EDIT');
                    });
                    assert(permissions.length === 1);
                    assert(permissions[0].roles.length === 2);
                    assert(permissions[0].roles[0].name);
                    assert(!permissions[0].roles[0].permissions[0].name);
                    done();
                });
        });

        it('POST /api/permissions', function (done) {
            agent.post(port + '/api/permissions/')
                .send(permission)
                .end(function (res) {
                    assert.equal(res.status, 200);
                    permission = res.body;
                    assert(permission._id);
                    done();
                });
        });

        it('save exist permission POST /api/permissions', function (done) {
            agent.post(port + '/api/permissions/')
                .send({
                    name: 'permissionTest',
                    description: 'permissionDescription'
                })
                .end(function (res) {
                    assert.equal(res.status, 500);
                    done();
                });
        });

        it('PUT /api/permissions', function (done) {
            agent.put(port + '/api/permissions/' + permission._id)
                .send({
                    name: 'permissionTestTest'
                })
                .end(function (res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.name, 'permissionTestTest');
                    done();
                });
        });

        it('DELETE /api/permissions', function (done) {
            assert(permission._id != '');
            agent.del(port + '/api/permissions/' + permission._id)
                .end(function (res) {
                    assert.equal(res.status, 200);
                    agent.get(port + '/api/permissions/' + permission._id)
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            assert.equal(Object.keys(res.body).length, 0);
                            done();
                        });
                });
        });
    });

    describe('role permission', function () {
        var role = {
            name: 'roleTest',
            description: 'roleDescription',
            permissions: []
        };
        var permission1 = {
            name: 'permissionTest1',
            description: 'permissionDescription'
        };
        var permission2 = {
            name: 'permissionTest2',
            description: 'permissionDescription'
        };

        it('role permission assign', function (done) {
            async.series([
                function (callback) {
                    agent.post(port + '/api/roles/')
                        .send(role)
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            role = res.body;
                            assert(role._id);
                            callback(null, '');
                        });
                },
                function (callback) {
                    agent.post(port + '/api/permissions/')
                        .send(permission1)
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            permission1 = res.body;
                            assert(permission1._id);
                            callback(null, '');
                        });
                },
                function (callback) {
                    agent.post(port + '/api/permissions/')
                        .send(permission2)
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            permission2 = res.body;
                            assert(permission2._id);
                            callback(null, '');
                        });
                },
                function (callback) {
                    role.permissions.push(permission1._id);
                    agent.put(port + '/api/roles/' + role._id)
                        .send({
                            permissions: role.permissions
                        })
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            callback(null, '');
                        });
                },
                function (callback) {
                    role.permissions.push(permission2._id);
                    agent.put(port + '/api/roles/' + role._id)
                        .send({
                            permissions: role.permissions
                        })
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            callback(null, '');
                        });
                },
                function (callback) {
                    //delete role and permission's roles is null
                    agent.del(port + '/api/roles/' + role._id)
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            agent.get(port + '/api/permissions/' + permission1._id)
                                .end(function (res) {
                                    assert.equal(res.status, 200);
                                    assert(res.body.roles.length === 0);
                                    callback(null, '');
                                });
                        });
                },
                function (callback) {
                    role.permissions = [];
                    agent.post(port + '/api/roles/')
                        .send(role)
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            role = res.body;
                            assert(role._id);
                            callback(null, '');
                        });
                },
                function (callback) {
                    role.permissions.push(permission1._id);
                    role.permissions.push(permission2._id);
                    agent.put(port + '/api/roles/' + role._id)
                        .send({
                            permissions: role.permissions
                        })
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            callback(null, '');
                        });
                },
                function (callback) {
                    //test role's permissions length
                    agent.get(port + '/api/roles')
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            var roles = res.body.filter(function (el, i, list) {
                                return (el.name === 'roleTest');
                            });
                            assert(roles.length === 1);
                            assert(roles[0].permissions.length === 2);
                            callback(null, '');
                        });
                },
                function (callback) {
                    agent.del(port + '/api/permissions/' + permission1._id)
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            callback(null, '');
                        });
                },
                function (callback) {
                    agent.del(port + '/api/permissions/' + permission2._id)
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            callback(null, '');
                        });
                },
                function (callback) {
                    //test role's permissions length
                    agent.get(port + '/api/roles/' + role._id)
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            assert(res.body.permissions.length === 0);
                            callback(null, '');
                        });
                },
                function (callback) {
                    agent.del(port + '/api/roles/' + role._id)
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            callback(null, '');
                        });
                }
            ], function (err, results) {
                done();
            });
        });
    });

    describe('user roles', function () {
        var user = {
            name: '陈昊',
            loginName: 'chenhao',
            plainPassword: 'abcd1234',
            admin: true,
            mobilePhone: '13817475681'
        };
        var role1 = {
            name: 'roleTest1',
            description: 'roleDescription1',
            permissions: []
        };
        var role2 = {
            name: 'roleTest2',
            description: 'roleDescription2',
            permissions: []
        };

        it('user role permission', function (done) {
            async.series([
                function (callback) {
                    agent.post(port + '/api/users/')
                        .send(user)
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            user = res.body;
                            assert(user._id);
                            callback(null, '');
                        });
                },
                function (callback) {
                    agent.post(port + '/api/roles/')
                        .send(role1)
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            role1= res.body;
                            assert(role1._id);
                            callback(null, '');
                        });
                },
                function (callback) {
                    agent.post(port + '/api/roles/')
                        .send(role2)
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            role2 = res.body;
                            assert(role2._id);
                            callback(null, '');
                        });
                },
                function (callback) {
                    //add roles to user
                    user.roles.push(role1._id);
                    user.roles.push(role2._id);
                    agent.put(port + '/api/users/roles/'+user._id)
                        .send(user.roles)
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            callback(null, '');
                        });
                },
                function (callback) {
                    //get user's roles
                    agent.get(port + '/api/users/'+user._id)
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            assert(res.body.roles.length === 2);
                            callback(null, '');
                        });
                },
                function (callback) {
                    agent.del(port + '/api/roles/' + role1._id)
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            callback(null, '');
                        });
                },
                function (callback) {
                    //get user's roles
                    agent.get(port + '/api/users/'+user._id)
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            assert(res.body.roles.length === 1);
                            callback(null, '');
                        });
                },
                function (callback) {
                    agent.del(port + '/api/roles/' + role2._id)
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            callback(null, '');
                        });
                },
                function (callback) {
                    agent.del(port + '/api/users/' + user._id)
                        .end(function (res) {
                            assert.equal(res.status, 200);
                            callback(null, '');
                        });
                }
            ], function (err, results) {
                done();
            });
        });
    });
})
