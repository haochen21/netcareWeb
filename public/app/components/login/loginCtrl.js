angular.module('netcareApp')
    .controller('loginCtrl', ['$scope', '$rootScope', '$location', '$http', 'netcareCache',
        function ($scope, $rootScope, $location, $http, netcareCache) {

            $scope.showing = true;
            $scope.is_loading = false;
            $scope.userNameError = false;
            $scope.userPasswordError = false;
            $scope.errorUserName = '';
            $scope.completedTasks = 0;
            $scope.tasks = [];

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
                        netcareCache.put("user",data.user);
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
                $scope.completedTasks = 0;

                $scope.tasks.push({excuteFun: $scope.getPermissions});
                $scope.tasks.push({excuteFun: $scope.getMenus});

                for (var task in $scope.tasks) {
                    $scope.tasks[task].excuteFun($scope.checkIfComplete);
                }
            };

            $scope.checkIfComplete = function () {
                $scope.completedTasks++;
                if ($scope.completedTasks == $scope.tasks.length) {
                    console.log("checkIfComplete.....");
                    $scope.is_loading = false;
                    $rootScope.$broadcast('logined');
                    $location.path('/components/portal');
                    $scope.showing = false;
                }
            };

            $scope.getPermissions = function (callback) {
                console.log('get permission.....');
                var user =netcareCache.get("user");
                $http.get('/api/user/permissions/'+user._id).success(function (data) {
                    netcareCache.put('permissions',data);
                    callback();
                });
            };

            $scope.getMenus = function (callback) {
                console.log('get systemMenu.....');
                $http.get('json/menu.json').success(function (data) {
                    netcareCache.put('menus',data);
                    callback();
                });
            };
        }
    ]);

