angular.module('netcareApp')
    .controller('loginCtrl', ['$scope', '$location', '$http', '$q', 'netcareCache',
        function ($scope, $location, $http, $q, netcareCache) {

            $scope.showing = true;
            $scope.is_loading = false;
            $scope.userNameError = false;
            $scope.userPasswordError = false;
            $scope.smsSended = false;
            $scope.smsCodeError = false;
            $scope.errorUserName = '';

            $scope.user = {};
            //$scope.user.name = 'jtyh';
            //$scope.user.password = 'abc123';

            $scope.sendSms = function(){
                var params = {
                    'loginName': $scope.user.name
                };
                $http.post('api/sendSms', params).success(function (data) {
                    console.log("send sms success");
                    $scope.smsSended = true;
                });
            };

            $scope.login = function () {
                $scope.is_loading = true;

                $scope.userNameError = false;
                $scope.userPasswordError = false;
                $scope.smsCodeError = false;
                $scope.smsSended = false;
                $scope.errorUserName = '';

                var params = {
                    'loginName': $scope.user.name,
                    "password": $scope.user.password,
                    "sms": $scope.user.sms
                };

                console.log(params);
                $http.post('api/login', params).success(function (data) {
                    $scope.user.name = '';
                    $scope.user.password = '';
                    $scope.user.sms = '';
                    if (data.result === 'AUTHORIZED') {
                        netcareCache.put("user", data.user);
                        $scope.loadUserData();
                    } else if (data.result === 'LOGINNAMEERROR') {
                        $scope.errorUserName = params.loginName;
                        $scope.userNameError = true;
                        $scope.is_loading = false;
                    } else if (data.result === 'PASSWORDERROR') {
                        $scope.user.name = params.loginName;
                        $scope.userPasswordError = true;
                        $scope.is_loading = false;
                    }else if (data.result === 'SMSCODEERROR') {
                        $scope.user.name = params.loginName;
                        $scope.user.password = params.password;
                        $scope.smsCodeError = true;
                        $scope.is_loading = false;
                    }
                });
            };

            $scope.loadUserData = function () {
                var user = netcareCache.get("user");

                var getMenusPromise = $http.get('json/menu.json');
                getMenusPromise.then(function (response) {
                    netcareCache.put('menus', response.data);
                }, function (response) {
                    throw new Error('getMenus went wrong...');
                });

                var queryCustomerGroupsPromise = $http.post('api/customers/getByOperatorId', {
                    operatorId: user.id
                });
                queryCustomerGroupsPromise.then(function (response) {
                    netcareCache.put('customerGroups', response.data.customerGroups);
                }, function (response) {
                    throw new Error('get customerGroups wrong...');
                });

                var loginPromises = $q.all([queryCustomerGroupsPromise, getMenusPromise]);
                loginPromises.then($scope.loginComplete);
            };

            $scope.loginComplete = function () {
                console.log("loginComplete.....");
                $scope.is_loading = false;
                $scope.loginResult.value = true;
                $location.path('/components/customerTopo');
                $scope.showing = false;
            };

            //$scope.login();
        }
    ]);

