angular.module('netcareApp')
    .controller('customerTopoCtrl', ['$scope', '$http', '$filter', '$window', function ($scope, $http, $filter, $window) {

        $scope.customerGroupsView = true;
        var orderBy = $filter('orderBy');
        $scope.getCustomerGroups = function (name) {
            var params = {name: name, sensor: false};
            return $http.get(
                'json/customerGroups.json'
            ).then(function (response) {
                    $scope.customerGroups = orderBy(response.data.customerGroups, 'classify', true);
                    var customerGroupsArrayLength = Math.ceil($scope.customerGroups.length / 4);
                    $scope.customerGroupsArray = new Array(customerGroupsArrayLength);
                    for (var i = 0; i < customerGroupsArrayLength; i++) {
                        $scope.customerGroupsArray[i] = i;
                    }
                });
        };
        $scope.$on('shellSearch', function (event, searchText) {
            $scope.customerGroupCriteria = searchText;
        });
        $scope.getCustomerGroups();


        $scope.basicInfoView = false;
        $scope.singleCustomerGroup = function (customerGroup) {
            $scope.customerGroupsView = false;
            $scope.basicInfoView = true;
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
        $scope.backToCustomerGroupsView = function () {
            $scope.customerGroupsView = true;
            $scope.basicInfoView = false;
            $scope.customerGroup = null;
        };

        $scope.back = function () {
            if ($scope.displayModule == 'bizStatus'
                && $scope.bizStatusModule == 'bizStatusTopo') {
                $scope.bizStatusModule = 'bizStatusPanel';
                return;
            }
            $scope.basicInfoView = true;
            $scope.displayModule = null;
        };

        $scope.showSubModule = function (customerMenu) {
            $scope.basicInfoView = false;
            $scope.displayModule = customerMenu.id;
            if (customerMenu.id === 'cusFile') {
                //$scope.pdfUrl = "/assets/cusfile/test.pdf";
                $scope.pdfUrl = "/assets/cusfile/CF_10005_201412.pdf";
            } else if (customerMenu.id === 'checkService') {
                $scope.getCheckService();
            } else if (customerMenu.id === 'sla') {
                $scope.buildSlaData();
            } else if (customerMenu.id === 'bizStatus') {
                $scope.getBizStatusData();
            }

        };

        $scope.myInterval = 2000;
        $scope.myNoTransition = false;
        var slides = $scope.slides = [];

        $scope.getCheckService = function () {
            slides = $scope.slides = [];
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
            {
                name: "故障",
                y: 20,
                color: '#3bbfb4'
            }
        ];

        $scope.slaDisplayModule = 'chart';
        $scope.changeSlaInfoPanel = function () {
            if ($scope.slaDisplayModule === 'chart') {
                $scope.slaDisplayModule = 'table';
            } else if ($scope.slaDisplayModule === 'table') {
                $scope.slaDisplayModule = 'chart';
            }
        };

        $scope.slaRawDatas = [
            {
                name: '联通端/第三方',
                netDuration: 491
            },
            {
                name: '联通端/光电',
                netDuration: 57
            },
            {
                name: '联通端/异地故障',
                netDuration: 67
            },
            {
                name: '客户端/原因不明',
                netDuration: 54
            },
            {
                name: '客户端/客户设备',
                netDuration: 35
            }
        ];

        $scope.buildSlaData = function () {
            $scope.faultSlaData = [];
            $scope.subSlaData = [];
            for (var i = 0; i < $scope.slaRawDatas.length; i++) {
                var slaRawData = $scope.slaRawDatas[i];
                if (slaRawData.name.indexOf('联通端') > -1) {
                    if (!$scope.faultSlaData[0]) {
                        $scope.faultSlaData[0] = {
                            name: '联通端',
                            y: slaRawData.netDuration
                        };
                    } else {
                        $scope.faultSlaData[0].y = $scope.faultSlaData[0].y + slaRawData.netDuration;
                    }
                } else if (slaRawData.name.indexOf('客户端') > -1) {
                    if (!$scope.faultSlaData[1]) {
                        $scope.faultSlaData[1] = {
                            name: '客户端',
                            y: slaRawData.netDuration
                        };
                    } else {
                        $scope.faultSlaData[1].y = $scope.faultSlaData[1].y + slaRawData.netDuration;
                    }
                }
            }
            ;
            for (var j = 0; j < $scope.slaRawDatas.length; j++) {
                var slaRawData = $scope.slaRawDatas[j];
                if (slaRawData.name.indexOf('联通端') > -1) {
                    $scope.subSlaData.push({
                        name: slaRawData.name.substring(4),
                        y: slaRawData.netDuration
                    });
                }
            }
            ;
            for (var k = 0; k < $scope.slaRawDatas.length; k++) {
                var slaRawData = $scope.slaRawDatas[k];
                if (slaRawData.name.indexOf('客户端') > -1) {
                    $scope.subSlaData.push({
                        name: slaRawData.name.substring(4),
                        y: slaRawData.netDuration
                    });
                }
            }
            ;
        };

        $scope.faultSheets = [
            {
                no: '上海-201410-A0386',
                brokenDate: '2014/10/24',
                cause: '已恢复，经倒换话务成功后',
                source: '异地联通',
                locate: '联通端/异地故障',
                duration: '67',
                circuitNo: '95512.0'
            },
            {
                no: '上海-201410-A0388',
                brokenDate: '2014/10/24',
                cause: '已报异地联通处理',
                source: '不明原因',
                locate: '联通端/第三方',
                duration: '491',
                circuitNo: '95511.0'
            },
            {
                no: '上海-201410-A0452',
                brokenDate: '2014/10/28',
                cause: '广西反馈联系用户拨测，反馈目前发现可以正幑',
                source: '不明原因',
                locate: '客户端/原因不明',
                duration: '54',
                circuitNo: '6.0750447E7'
            }, {
                no: 'SH-20141030-0035',
                brokenDate: '2014/10/30',
                cause: '更换光电已恢复',
                source: '本地接入段',
                locate: '联通端/光电',
                duration: '67',
                circuitNo: '21T012475'
            }
        ];

        var bizStatusRawDatas = [
            {
                type: "语音数字中继",
                faultStatus: false,
                circuitNum: 190
            },
            {
                type: "语音数字中继",
                faultStatus: true,
                circuitNum: 7
            },
            {
                type: "IDC",
                faultStatus: false,
                circuitNum: 1
            },
            {
                type: "GSM",
                faultStatus: false,
                circuitNum: 1
            },
            {
                type: "DPLC",
                faultStatus: false,
                circuitNum: 64
            },
            {
                type: "3G",
                faultStatus: false,
                circuitNum: 2
            },
            {
                type: "异地受理",
                faultStatus: false,
                circuitNum: 16
            },
            {
                type: "DID",
                faultStatus: false,
                circuitNum: 8
            },
            {
                type: "AG",
                faultStatus: false,
                circuitNum: 19
            },
            {
                type: "VOIP",
                faultStatus: false,
                circuitNum: 2
            },
            {
                type: "互联网LAN专线接入",
                faultStatus: false,
                circuitNum: 3
            },
            {
                type: "WLAN",
                faultStatus: false,
                circuitNum: 1
            },
            {
                type: "互联网普通专线接入",
                faultStatus: false,
                circuitNum: 1
            },
            {
                type: "沪运资调令",
                faultStatus: false,
                circuitNum: 6
            }
        ];

        $scope.bizStatusModule = 'bizStatusPanel';
        $scope.getBizStatusData = function () {
            $scope.bizStatusDatas = [];
            for (var i = 0; i < bizStatusRawDatas.length; i++) {
                var data = bizStatusRawDatas[i];
                var isExist = false;
                for (var j = 0; j < $scope.bizStatusDatas.length; j++) {
                    if ($scope.bizStatusDatas[j].type === data.type) {
                        $scope.bizStatusDatas[j].circuitNum = $scope.bizStatusDatas[j].circuitNum + data.circuitNum;
                        if (data.faultStatus) {
                            $scope.bizStatusDatas[j].faultCircuitNum = data.circuitNum;
                            $scope.bizStatusDatas[j].hasFault = true;
                        }
                        isExist = true;
                        break;
                    }
                }
                if (!isExist) {
                    var bizStatusData = {
                        type: data.type,
                        hasFault: false,
                        faultCircuitNum: 0,
                        circuitNum: data.circuitNum
                    };
                    if (data.faultStatus) {
                        bizStatusData.faultCircuitNum = data.circuitNum;
                        bizStatusData.hasFault = true;
                    }
                    $scope.bizStatusDatas.push(bizStatusData);
                }
            }
            for (var k = 0; k < $scope.bizStatusDatas.length; k++) {
                $scope.bizStatusDatas[k].dountData = [{
                    name: "正常",
                    y: $scope.bizStatusDatas[k].circuitNum - $scope.bizStatusDatas[k].faultCircuitNum,
                    color: Highcharts.getOptions().colors[7]
                },
                    {
                        name: "故障",
                        y: $scope.bizStatusDatas[k].faultCircuitNum,
                        color: Highcharts.getOptions().colors[5]
                    }];
            }
            var arrayLength = Math.ceil($scope.bizStatusDatas.length / 4);
            $scope.bizStatusArray = new Array(arrayLength);
            for (var l = 0; l < arrayLength; l++) {
                $scope.bizStatusArray[l] = l;
            }
            console.log($scope.bizStatusDatas);
        };

        $scope.showBizStatusTopo = function (bizStatusData) {
            $scope.bizStatusModule = 'bizStatusTopo';
            $scope.getBizStatusTopoData();
        };

        $scope.bizStatusTopoDatas = null;
        $scope.getBizStatusTopoData = function () {
            $scope.bizStatusTopoDatas = {};
            $scope.bizStatusTopoDatas = {
                nodes: [
                    {
                        "name": "Creighton Hospital"
                    },
                    {
                        "name": "Heart Hospital"
                    },
                    {
                        "name": "Marshall Regional Medical Center"
                    },
                    {
                        "name": "McKennan Hospital & University Health Center"
                    },
                    {
                        "name": "Queen of Peace Hospital"
                    },
                    {
                        "name": "Sacred Heart Hospital"
                    },
                    {
                        "name": "St. Luke's Hospital"
                    },
                    {
                        "name": "St. Mary's Hospital"
                    },
                    {
                        "name": "Milbank Area Hospital"
                    },
                    {
                        "name": "Pipestone County Medical Center"
                    },
                    {
                        "name": "St. Michael's Hospital"
                    },
                    {
                        "name": "Wagner Community Memorial Hospital"
                    }
                ],
                links: [
                    {
                        "source": 0,
                        "target": 0
                    },
                    {
                        "source": 1,
                        "target": 1
                    },
                    {
                        "source": 1,
                        "target": 7
                    },
                    {
                        "source": 2,
                        "target": 2
                    },
                    {
                        "source": 3,
                        "target": 1
                    },
                    {
                        "source": 3,
                        "target": 3
                    },
                    {
                        "source": 3,
                        "target": 9
                    },
                    {
                        "source": 4,
                        "target": 4
                    },
                    {
                        "source": 6,
                        "target": 5
                    },
                    {
                        "source": 6,
                        "target": 3
                    },
                    {
                        "source": 8,
                        "target": 8
                    },
                    {
                        "source": 10,
                        "target": 3
                    },
                    {
                        "source": 11,
                        "target": 3
                    },
                    {
                        "source": 11,
                        "target": 11
                    }
                ]
            };
        };


        $scope.customerGroupsView = false;
        $scope.basicInfoView = false;
        $scope.displayModule = 'bizStatus';
        $scope.bizStatusModule = 'bizStatusPanel';
        $scope.getBizStatusData();
    }]);
