cnc.modelSecurity = (function () {
    'use strict';
    var initModule, storage, login, logOut, completeLogin,
        getPermissions, getCustomerGroups, getSystemMenus;


    login = function (loginData) {
        loginData.submit.button('loading');
        $.post('/api/login', {'loginName': loginData.loginName, "password": loginData.password}, function (data) {
            if (data.type === 'AUTHORIZED') {
                completeLogin(data.user, loginData.persistent);
                $.gevent.publish('login-success', [cnc.globalModel.operator]);
            } else if (data.type === 'LOGINNAMEERROR') {
                $.gevent.publish('login-fail-nameError', data);
            } else if (data.type === 'PASSWORDERROR') {
                $.gevent.publish('login-fail-passwordError', data);
            }
        }).fail(function () {
            console.log('error');
        }).always(function () {
            loginData.submit.button('reset');
        });
    };

    logOut = function () {
        cnc.globalModel.operator.password = '';
        cnc.globalModel.operator.persistent = false;
        var operatorJson = JSON.stringify(cnc.globalModel.operator);
        storage.setItem("operatorJson", operatorJson);
        $.post('/api/logout');
    };

    completeLogin = function (operator, persistent) {
        for (var key in operator) {
            if (Object.prototype.hasOwnProperty.call(operator, key)) {
                cnc.globalModel.operator[key] = operator[key];
            }
        }
        cnc.globalModel.operator.persistent = persistent;
        if (persistent) {
            var operatorJson = JSON.stringify(cnc.globalModel.operator);
            storage.setItem("operatorJson", operatorJson);
        }
    };

    getPermissions = function (notyId, callback) {
        setTimeout(function () {
            console.log('get permission.....');
            notyId.close();
            callback();
        }, 500);
    };

    getCustomerGroups = function (notyId, callback) {
        console.log('get customerGroup.....');
        $.getJSON('json/customerGroups.json', function (data) {
            for (var i = 0; i < data.customerGroups.length; i++) {
                cnc.globalModel.customerGroups.insert(data.customerGroups[i]);
            }
            notyId.close();
            callback();
        })
    };

    getSystemMenus = function (notyId, callback) {
        console.log('get systemMenu.....');
        $.getJSON('json/menu.json', function (data) {
            cnc.globalModel.systemMenu.add(data.menus);
            cnc.globalModel.systemMenu.initMenuHtml();
            var menuHtml = cnc.globalModel.systemMenu.menuHtml;
            console.log(menuHtml);
            notyId.close();
            callback();
        });
    };

    initModule = function () {
        storage = window.localStorage;
    };

    return {
        initModule: initModule,
        login: login,
        logOut: logOut,
        getPermissions: getPermissions,
        getCustomerGroups: getCustomerGroups,
        getSystemMenus: getSystemMenus
    };
})();