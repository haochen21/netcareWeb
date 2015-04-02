angular.module('netcareApp')
    .controller('topNavCtrl',function($scope,$rootScope,$location,messaging,socketConstant){

        $scope.openMenu = function ($event) {
            $rootScope.$broadcast('menuTrigger');
            $event.stopPropagation();
        };

        $scope.clickOffSidebar = function ($event) {
            $rootScope.$broadcast('offSidebarTrigger');
            $event.stopPropagation();
        };

        $scope.clickShellSearch = function (value) {
            $scope.openShellSearch = value;
        };

        $scope.clickDropdownMenu = function ($event) {
            var $target = angular.element($event.currentTarget);
            $target.toggleClass('open');
        };

        $scope.faults = [];

        $scope.addFault = function(fault){
            $scope.$evalAsync(function(){
                var length = $scope.faults.length;
                for(var i=0;i<length;i++){
                    if($scope.faults[i].id === fault.id){
                        $scope.faults.splice(i,1);
                        i--;
                        length--;
                    }
                }
                if($scope.faults.length > 3){
                    //remove last element
                    $scope.faults.pop();
                }
                $scope.faults.unshift(fault);
            });
        };

        $scope.faultMessgeHandler = messaging.subscribe(socketConstant.faultMessageTopicName,$scope.addFault);

        $scope.$on('$destroy', function(){
            messaging.unsubscribe($scope.faultMessgeHandler);
        });

        $scope.shortcutMenus = [
            {name: "首页",id: "portal"},
            {name: "客户拓扑",id: "customerTopo"},
            {name: "电路管理",id: "circuitMgmt"}
        ];

        $scope.clickShortcutMenu = function(menu){
            $location.path('/components/'+menu.id);
        };

        $scope.lock = function(){
            $rootScope.$broadcast('lock');
        };

        $scope.websocketStatus = true;
        $scope.$on(socketConstant.websocketStatus,function(event, value){
            $scope.$evalAsync(function(){
                $scope.websocketStatus = value;
            });
        });

        //显示查询按钮
        $scope.showSearchBtn = false;

        $scope.$on('shellSearchShow', function (event, searchText) {
            $scope.showSearchBtn = true;
        });
        $scope.$on('shellSearchHide', function (event, searchText) {
            $scope.showSearchBtn = false;
        });
    })
    .controller('shellSearchCtrl', function ($scope,$rootScope) {

        $scope.shellSearchUpdate = function(){
            $rootScope.$broadcast('shellSearch',$scope.shellSearchText);
            if($scope.shellSearchText === ''){
                $scope.clickShellSearch(false);
            }
        };

        $scope.$on('shellSearchHide', function (event, searchText) {
            $scope.shellSearchText = '';
            $scope.clickShellSearch(false);
        });

        $scope.submit = function(){
            $scope.clickShellSearch(false);
        };
    });

