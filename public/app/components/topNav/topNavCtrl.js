angular.module('netcareApp')
    .controller('topNavCtrl',function($scope,$rootScope,$document){

        $scope.openMenu = function ($event) {
            $rootScope.$broadcast('menuTrigger');
            $event.stopPropagation();
        }

        $scope.clickOffSidebar = function ($event) {
            $rootScope.$broadcast('offSidebarTrigger');
            $event.stopPropagation();
        }

        $scope.clickShellSearch = function (value) {
            $scope.openShellSearch = value;
        }

        $scope.clickDropdownMenu = function ($event) {
            var $target = angular.element($event.currentTarget);
            $target.toggleClass('open');
        }

        $scope.faults = [
            {
                "id": 465223, "circuitId": 120523, "beginTime": "2013-12-25 15:02:01", "customerGroupName": "倍乐生商贸(中国)有限公司", "circuitNo": "01T021967", "state": "已确认", "circuitState": "占用", "circuitServiceType": "DPLC", "circuitRate": "2M", "circuitGroupNo": "上海无锡NE0006NP"
            },
            {
                "id": 447976, "circuitId": 119972, "beginTime": "2013-12-21 19:33:07", "customerGroupName": "倍乐生商贸(中国)有限公司", "circuitNo": "01T025473", "state": "已确认", "circuitState": "占用", "circuitServiceType": "DPLC", "circuitRate": "4M", "circuitGroupNo": "上海无锡ANE0012NP"
            },
            {
                "id": 440434, "circuitId": 112549, "beginTime": "2013-12-06 15:36:40", "customerGroupName": "光大证券", "circuitNo": "01T022335", "state": "未确认", "circuitState": "占用", "circuitServiceType": "DPLC", "circuitRate": "2M", "circuitGroupNo": "上海遵义30N0001NP"
            },
            {
                "id": 433738, "circuitId": 123026, "beginTime": "2013-05-18 08:57:20", "customerGroupName": "兴业银行", "circuitNo": "01T017417", "state": "未确认", "circuitState": "占用", "circuitServiceType": "DPLC", "circuitRate": "100M", "circuitGroupNo": "上海福州ANE0002NP"
            }
        ];
    })
    .controller('shellSearchCtrl', function ($scope) {

        $scope.submit = function () {
            $scope.clickShellSearch(false);
            if ($scope.shellSearchText) {
                console.log($scope.shellSearchText);
            }
        };
    });

