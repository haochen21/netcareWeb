angular.module('netcareApp')
    .controller('customerTopoCtrl', ['$scope', function ($scope) {

        $scope.showCustomerMenu = true;

        $scope.customerMenus = [
            {name: '客户资料', angle: 'deg0', id: 'cusFile'},
            {name: '运行报告', angle: 'deg45', id: 'operationReport'},
            {name: '业务状态', angle: 'deg135', id: 'bizStatus'},
            {name: '服务例会', angle: 'deg180', id: 'serviceMeeting'},
            {name: '巡检服务', angle: 'deg225', id: 'checkService'},
            {name: '服务评价', angle: 'deg270', id: 'serviceScore'},
            {name: 'SLA', angle: 'deg315', id: 'sla'}
        ];

        $scope.backToCustomerMenu = function () {
            $scope.showCustomerMenu = true;
            $scope.displayModule = null;
        };

        $scope.showSubModule = function (customerMenu) {
            $scope.showCustomerMenu = false;
            $scope.displayModule = customerMenu.id;
            if (customerMenu.id === 'cusFile') {
                //$scope.pdfURL = "assets/cusfile/CF_10005_201412.pdf";
                $scope.pdfUrl = "/assets/cusfile/CF_10005_201412.pdf";
            } else if (customerMenu.id === 'checkService') {
                $scope.getCheckService();
            }
        };

        $scope.myInterval = 2000;
        $scope.myNoTransition = false;
        var slides = $scope.slides = [];

        $scope.getCheckService = function () {
            slides.push({
                image: '/assets/checkservice/SA_10005_201303_001.jpg',
                text: '2013第一季度1'
            }, {
                image: '/assets/checkservice/SA_10005_201303_002.jpg',
                text: '2013第一季度2'
            }, {
                image: '/assets/checkservice/SA_10005_201306_001.jpg',
                text: '2013第二季度1'
            }, {
                image: '/assets/checkservice/SA_10005_201306_002.jpg',
                text: '2013第二季度2'
            }, {
                image: '/assets/checkservice/SA_10005_201309_001.jpg',
                text: '2013第三季度1'
            }, {
                image: '/assets/checkservice/SA_10005_201309_002.jpg',
                text: '2013第三季度2'
            }, {
                image: '/assets/checkservice/SA_10005_201309_003.jpg',
                text: '2013第三季度3'
            }, {
                image: '/assets/checkservice/SA_10005_201309_004.jpg',
                text: '2013第三季度4'
            }, {
                image: '/assets/checkservice/SA_10005_201312_001.jpg',
                text: '2013第四季度1'
            }, {
                image: '/assets/checkservice/SA_10005_201312_002.jpg',
                text: '2013第四季度2'
            }, {
                image: '/assets/checkservice/SA_10005_201312_003.jpg',
                text: '2013第四季度3'
            }, {
                image: '/assets/checkservice/SA_10005_201312_004.jpg',
                text: '2013第四季度4'
            });
        };

        $scope.cusCircuitDonutData = [
            {
                name: "正常",
                y: 820,
                color: '#ffffff'
            },
            { name: "故障",
                y: 20,
                color: '#3bbfb4'
            }
        ];

    }]);
