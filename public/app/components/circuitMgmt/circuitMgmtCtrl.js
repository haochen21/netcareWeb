angular.module('netcareApp')
    .controller('circuitMgmtCtrl', function ($scope, $http,circuitMgmtService,
                                             uiFootableEvent, uiFootablePageEvent, uiFootablePageSize) {

        $scope.sort = '$index';
        $scope.reverse = true;

        $scope.circuits = circuitMgmtService.circuits;
        $scope.pagination = circuitMgmtService.pagination;

        $scope.isFault = false;

        $scope.is_loading = false;
        $scope.queryCircuit = function () {
            console.log($scope.cirQueryCommand);
            $scope.is_loading = true;
            $http.get('json/circuit.json').success(function (data) {
                $scope.pagination.itemSize = data.records;
                $scope.pagination.pageSize = uiFootablePageSize;
                $scope.pagination.pageNumber = Math.ceil($scope.pagination.itemSize / $scope.pagination.pageSize);
                $scope.pagination.currentPage = 1;
                $scope.pagination.lastPage = $scope.pagination.pageNumber;
                circuitMgmtService.setPagination($scope.pagination);

                $scope.circuits = data.circuits;
                circuitMgmtService.setCircuits($scope.circuits);

                $scope.is_loading = false;
                $scope.triggerQueryPanel();
            });
        };

        $scope.showAllAttr = false;

        $scope.showAll = function () {
            if(!$scope.circuits.length){
                return;
            }
            if ($scope.showAllAttr) {
                $scope.$broadcast(uiFootableEvent.allRowsCollapse);
            } else {
                $scope.$broadcast(uiFootableEvent.allRowsExpand);
            }
            $scope.showAllAttr = !$scope.showAllAttr;
        };

        $scope.queryPanelOpen = false;
        $scope.triggerQueryPanel = function () {
            $scope.queryPanelOpen = !$scope.queryPanelOpen;
        };

        $scope.queryPanelMoreOpen = false;
        $scope.triggerQueryPanelMore = function () {
            $scope.queryPanelMoreOpen = !$scope.queryPanelMoreOpen;
        };

        $scope.cirQueryCommand = {};
        $scope.cirQueryCommand.isFault = false;
        $scope.cirQueryCommand.customerGroups = [];

        $scope.refreshCustomerGroups = function (name) {
            var params = {name: name, sensor: false};
            return $http.get(
                'json/customerGroups.json'
            ).then(function (response) {
                    $scope.customerGroupsModel = response.data.customerGroups;
                });
        };

        $scope.cirBizStatuses = [
            {value:0,name:'正常'},
            {value:1,name:'故障'}
        ];
    })
    .filter('circuitFaultFilter', function () {
        return function (value) {
            if (!value) {
                return '正常';
            } else {
                return '故障';
            }
        };
    });
