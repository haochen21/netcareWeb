angular.module('netcareApp')
    .controller('customerTopoCtrl', ['$scope',function ($scope) {

        $scope.showCustomerMenu = true;

        $scope.customerMenus = [
            {name: '客户资料', angle:'deg0',id: 'cusFile'},
            {name: '运行报告', angle:'deg45',id: 'operationReport'},
            {name: '业务状态', angle:'deg135',id: 'bizStatus'},
            {name: '服务例会', angle:'deg180',id: 'serviceMeeting'},
            {name: '巡检服务', angle:'deg225',id: 'checkService'},
            {name: '服务评价', angle:'deg270',id: 'serviceScore'},
            {name: 'SLA', angle:'deg315',id: 'sla'}
        ];

        $scope.showSubModule = function(customerMenu){
            $scope.showCustomerMenu = false;
            $scope.displayModule = customerMenu.id;
            if(customerMenu.id === 'cusFile'){
                //$scope.pdfURL = "assets/cusfile/CF_10005_201412.pdf";
                $scope.pdfUrl  = "/assets/cusfile/CF_10005_201412.pdf";
            }
        };

        $scope.backToCustomerMenu = function(){
            $scope.showCustomerMenu = true;
            $scope.displayModule = null;
        };
       

        //$scope.pdfUrl  = "/assets/cusfile/CF_10005_201412.pdf";
    }]);
