angular.module('netcareApp')
    .controller('circuitMgmtCtrl', function ($scope, $http, uiFootableEvent, uiFootablePageEvent, uiFootablePageSize) {

        $scope.sort = '$index';
        $scope.reverse = true;

        $scope.circuits = [];
        $scope.pagination = { };

        $scope.isFault = false;

        $scope.queryCircuit = function () {
            $http.get('json/circuit.json').success(function (data) {

                $scope.pagination.itemSize = data.records;
                $scope.pagination.pageSize = uiFootablePageSize;
                $scope.pagination.pageNumber = Math.ceil($scope.pagination.itemSize / $scope.pagination.pageSize);
                $scope.pagination.currentPage = 1;
                $scope.pagination.lastPage = $scope.pagination.pageNumber;

                $scope.circuits = data.circuits;
            });
        };

        $scope.showAllAttr = false;

        $scope.showAll = function () {
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

        $scope.customerGroups = {};
        $scope.customerGroups.selected = [];
        $scope.refreshCustomerGroups = function (name) {
            var params = {name: name, sensor: false};
            return $http.get(
                'json/customerGroups.json'
            ).then(function (response) {
                    $scope.customerGroupsModel = response.data.customerGroups;
                });
        };

        $scope.queryCircuit();
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
