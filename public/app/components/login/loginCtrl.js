angular.module('netcareApp')
    .controller('loginCtrl', ['$scope', '$location', '$http', '$q', 'netcareCache',
        function ($scope, $location, $http, $q, netcareCache) {

            $scope.showing = true;
            $scope.is_loading = false;
            $scope.userNameError = false;
            $scope.userPasswordError = false;
            $scope.errorUserName = '';

            $scope.user = {};
            $scope.user.name = 'admin';
            $scope.user.password = 'abcd1234';

            $scope.login = function () {
                $scope.is_loading = true;

                $scope.userNameError = false;
                $scope.userPasswordError = false;
                $scope.errorUserName = '';

                var params = {
                    'loginName': $scope.user.name,
                    "password": $scope.user.password
                };

                $scope.user.name = '';
                $scope.user.password = '';

                console.log(params);
                $http.post('api/login', params).success(function (data) {
                    if (data.type === 'AUTHORIZED') {
                        netcareCache.put("user", data.user);
                        $scope.loadUserData();
                    } else if (data.type === 'LOGINNAMEERROR') {
                        $scope.errorUserName = params.loginName;
                        $scope.userNameError = true;
                        $scope.is_loading = false;
                    } else if (data.type === 'PASSWORDERROR') {
                        $scope.user.name = params.loginName;
                        $scope.userPasswordError = true;
                        $scope.is_loading = false;
                    }
                });
            };

            $scope.loadUserData = function () {
                var user = netcareCache.get("user");

                var getPermissionPromise = $http.get('/api/user/permissions/' + user._id);
                getPermissionPromise.then(function (response) {
                    netcareCache.put('permissions', response.data);
                }, function (response) {
                    throw new Error('getPermissions went wrong...');
                });

                var getMenusPromise = $http.get('json/menu.json');
                getMenusPromise.then(function (response) {
                    netcareCache.put('menus', response.data);
                }, function (response) {
                    throw new Error('getMenus went wrong...');
                });

                var loginPromises = $q.all([getPermissionPromise, getMenusPromise]);
                loginPromises.then($scope.loginComplete);
            };

            $scope.loginComplete = function () {
                console.log("loginComplete.....");
                $scope.is_loading = false;
                $scope.loginResult.value = true;
                $location.path('/components/customerTopo');
                $scope.showing = false;
            };

            $scope.login();
        }
    ]);
