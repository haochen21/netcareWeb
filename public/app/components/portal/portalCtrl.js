angular.module('netcareApp')
    .controller('portalCtrl', function ($scope,$timeout) {

        $scope.focusEnabled = {
            eyeSlash: false,
            customerInfo: false,
            circuitStatus: false,
            customerCircuit: false,
            sla: false
        };

        $scope.setFocusOverlay = function (value) {
            $scope.focusEnabled.eyeSlash = !$scope.focusEnabled.eyeSlash;
            $scope.focusEnabled[value] = !$scope.focusEnabled[value];
            $scope.$emit('focusOverlay');
        };

        $scope.widgetShow = {
            customerCircuit: true,
            sla:true,
            circuitVitalMonitor:true
        };

        $scope.closeWidget = function (value){
            $scope.widgetShow[value] = !$scope.widgetShow[value];
        };

        $scope.reloading = {
            customerInfo: false,
            circuitStatus: false,
            customerCircuit: false,
            sla: false
        };

        $scope.loadingCustomerInfo = function(){
            $scope.reloading.customerInfo = true;
            $timeout(function() {
                $scope.reloading.customerInfo = false;
            }, parseInt(Math.random() * 1000 + 2000));
        };

        $scope.loadingCircuitStatus = function(){
            $scope.reloading.circuitStatus = true;
            $timeout(function() {
                $scope.reloading.circuitStatus = false;
            }, parseInt(Math.random() * 1000 + 2000));
        };

        $scope.loadingCustomerCircuit = function(){
            $scope.reloading.customerCircuit = true;
            $timeout(function() {
                $scope.reloading.customerCircuit = false;
            }, parseInt(Math.random() * 1000 + 2000));
        };

        $scope.loadingSla = function(){
            $scope.reloading.sla = true;
            $timeout(function() {
                $scope.reloading.sla = false;
            }, parseInt(Math.random() * 1000 + 2000));
        };

        $scope.customerInfoData = [
            { name: "集团直管",
                y: 91,
                color: Highcharts.getOptions().colors[7]
            },
            { name: "钻石",
                y: 85,
                color: Highcharts.getOptions().colors[2]
            },
            { name: "金牌",
                y: 68,
                color: Highcharts.getOptions().colors[3]
            }
        ];

        $scope.circuitStatus = [
            {
                name: "占用",
                y: 8845,
                color: Highcharts.getOptions().colors[9] // Jane's color
            },
            { name: "管理类",
                y: 1496,
                color: Highcharts.getOptions().colors[6] // Jane's color
            },
            { name: "有故障",
                y: 271,
                color: Highcharts.getOptions().colors[7] // Jane's color
            }
        ];

        $scope.customerCircuit = [
            {name:"中企网络",value:494},
            {name:"平安保险",value:410},
            {name:"数讯信息",value:351},
            {name:"太平洋保险",value:313},
            {name:"信天通讯",value:234},
            {name:"大客户重保",value:232},
            {name:"国家税务局",value:232},
            {name:"浦发银行",value:207},
            {name:"农行",value:200},
            {name:"银联",value:191}
        ];

        $scope.sla = [
            {name:"海洋局",value:85.4},
            {name:"中远（网络）北京有限公司",value:89.6},
            {name:"上海市自来水有限公司",value:90.1},
            {name:"甲骨文软件公司",value:90.4},
            {name:"东方证券",value:90.9},
            {name:"广发银行",value:91.8},
            {name:"上海通用",value:92.2},
            {name:"招商银行",value:94.3},
            {name:"太平人寿",value:94.7},
            {name:"银联",value:96.5}
        ];

        $scope.cusVitalCirMonitors = [
            {
                name:'中国人民银行结算中心重保',
                beginTime:'2013-08-01',
                endTime:'2015-01-01',
                circuitNum:25,
                status:true
            },
            {
                name:'水利部重保',
                beginTime:'2014-02-01',
                endTime:'2015-01-01',
                circuitNum:105,
                status:true
            },
            {
                name:'工商银行VPDN重保',
                beginTime:'2013-09-01',
                endTime:'2015-03-01',
                circuitNum:10,
                status:true
            },
            {
                name:'宝马大客户重保',
                beginTime:'2014-08-31',
                endTime:'2015-01-31',
                circuitNum:120,
                status:true
            },
            {
                name:'新华社重保',
                beginTime:'2013-01-01',
                endTime:'2015-01-01',
                circuitNum:36,
                status:true
            },
            {
                name:'天文台重点保障',
                beginTime:'2013-01-01',
                endTime:'2015-01-01',
                circuitNum:15,
                status:false
            }
        ]
    });
