angular.module('netcareApp')
    .controller('customerTopoCtrl', ['$scope', '$http','$window',function ($scope,$http,$window) {

        $scope.customerGroupsView = true;
        $scope.getCustomerGroups = function (name) {
            var params = {name: name, sensor: false};
            return $http.get(
                'json/customerGroups.json'
            ).then(function (response) {
                    $scope.customerGroups = response.data.customerGroups;
                });
        };
        //$scope.customerGroupCriteria = '平安';
        $scope.$on('shellSearch',function(event,searchText){
            $scope.customerGroupCriteria = searchText;
        });
        $scope.getCustomerGroups();


        $scope.singleCustomerGroupView = false;
        $scope.singleCustomerGroup = function(customerGroup){
            $scope.customerGroupsView = false;
            $scope.singleCustomerGroupView = true;
            $scope.customerGroup = customerGroup;
            $window.scrollTo(0, 0);
        };
        $scope.customerMenus = [
            {name: '客户资料', angle: 'deg0', id: 'cusFile'},
            {name: '运行报告', angle: 'deg45', id: 'operationReport'},
            {name: '业务状态', angle: 'deg135', id: 'bizStatus'},
            {name: '服务例会', angle: 'deg180', id: 'serviceMeeting'},
            {name: '巡检服务', angle: 'deg225', id: 'checkService'},
            {name: '服务评价', angle: 'deg270', id: 'serviceScore'},
            {name: 'SLA', angle: 'deg315', id: 'sla'}
        ];
        $scope.backToCustomerGroupsView = function(){
            $scope.customerGroupsView = true;
            $scope.singleCustomerGroupView = false;
            $scope.customerGroup = null;
        };

        $scope.backToCustomerMenu = function () {
            $scope.singleCustomerGroupView = true;
            $scope.displayModule = null;
        };

        $scope.showSubModule = function (customerMenu) {
            $scope.singleCustomerGroupView = false;
            $scope.displayModule = customerMenu.id;
            if (customerMenu.id === 'cusFile') {
                //$scope.pdfUrl = "/assets/cusfile/test.pdf";
                $scope.pdfUrl = "/assets/cusfile/CF_10005_201412.pdf";
            } else if (customerMenu.id === 'checkService') {
                $scope.getCheckService();
            } else if (customerMenu.id === 'sla'){
                $scope.buildSlaData();
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

        $scope.slaRawDatas = [
            {
              name:'联通端/第三方',
              netDuration: 491
            },
            {
                name:'联通端/光电',
                netDuration: 57
            },
            {
                name:'联通端/异地故障',
                netDuration: 457
            },
            {
                name:'客户端/原因不明',
                netDuration: 74
            },
            {
                name:'客户端/自行恢复',
                netDuration: 148
            },
            {
                name:'客户端/客户设备',
                netDuration: 35
            }
        ];

        $scope.buildSlaData = function(){
            $scope.faultSlaData = [];
            $scope.subSlaData = [];
            for (var i = 0; i < $scope.slaRawDatas.length; i++) {
                var slaRawData = $scope.slaRawDatas[i];
                if(slaRawData.name.indexOf('联通端') > -1){
                    if(!$scope.faultSlaData[0]){
                        $scope.faultSlaData[0] = {
                            name:'联通端',
                            y:slaRawData.netDuration
                        };
                    }else{
                        $scope.faultSlaData[0].y = $scope.faultSlaData[0].y+slaRawData.netDuration;
                    }
                }else if(slaRawData.name.indexOf('客户端') >-1){
                    if(!$scope.faultSlaData[1]){
                        $scope.faultSlaData[1] = {
                            name:'客户端',
                            y:slaRawData.netDuration
                        };
                    }else{
                        $scope.faultSlaData[1].y = $scope.faultSlaData[1].y+slaRawData.netDuration;
                    }
                }
            };
            for (var j = 0; j < $scope.slaRawDatas.length; j++) {
                var slaRawData = $scope.slaRawDatas[j];
                if(slaRawData.name.indexOf('联通端') > -1){
                    $scope.subSlaData.push({
                        name:slaRawData.name.substring(4),
                        y:slaRawData.netDuration
                    });
                }
            };
            for (var k = 0; k < $scope.slaRawDatas.length; k++) {
                var slaRawData = $scope.slaRawDatas[k];
                if(slaRawData.name.indexOf('客户端') > -1){
                    $scope.subSlaData.push({
                        name:slaRawData.name.substring(4),
                        y:slaRawData.netDuration
                    });
                }
            };
            console.log($scope.subSlaData);
        };
    }]);
