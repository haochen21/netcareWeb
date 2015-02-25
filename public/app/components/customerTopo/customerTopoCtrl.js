angular.module('netcareApp')
    .controller('customerTopoCtrl', ['$scope', '$http', '$filter', '$window', '$timeout', '$q', function ($scope, $http, $filter, $window, $timeout, $q) {

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
            customerGroup.id = 10005;
            customerGroup.name = '中国平安保险(集团)股份有限公司';
            $scope.customerGroupsView = false;
            $scope.basicInfoView = true;
            $scope.customerGroup = customerGroup;
            $window.scrollTo(0, 0);
        };
        $scope.customerMenus = [
            {name: '客户资料', angle: 'deg0', id: 'cusResourceFile'},
            {name: '运行报告', angle: 'deg45', id: 'netOps'},
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

            $scope.cusResourceFileDisplayModule = 'table';
            $scope.slaDisplayModule = 'chart';
            $scope.slaDocDisplayModule = 'table';
            $scope.netOpsDisplayModule = 'table';
        };

        $scope.showSubModule = function (customerMenu) {
            $scope.basicInfoView = false;
            $scope.displayModule = customerMenu.id;
            if (customerMenu.id === 'cusResourceFile') {
                getCusResourceFiles();
            } else if (customerMenu.id === 'checkService') {
                $scope.getCheckService();
            } else if (customerMenu.id === 'sla') {
                getSlaDoc();
            } else if (customerMenu.id === 'bizStatus') {
                $scope.getBizStatusData();
            }else if (customerMenu.id === 'netOps') {
                $scope.queryNetOps();
            }

            $scope.cusResourceFileDisplayModule = 'table';
            $scope.slaDisplayModule = 'chart';
            $scope.slaDocDisplayModule = 'table';
            $scope.netOpsDisplayModule = 'table';
        };

        $scope.download = function () {
            downloadFileHelper();
        };

        /* ----------Customer Resource File------------------------*/
        var getCusResourceFiles = function () {
            $http.get(
                'api/customerService/cusResource/' + $scope.customerGroup.id
            ).then(function (response) {
                    $scope.cusResourceFiles = response.data.logs;
                });
        };
        $scope.cusResourceFileDisplayModule = 'table';
        $scope.goBackCusResourceFileTable = function () {
            $scope.cusResourceFileDisplayModule = 'table';
        };
        $scope.showCusResourceFile = function (file) {
            $scope.cusResourceFileDisplayModule = 'file';
            $scope.pdfUrl = '/assets/cusfile/' + $scope.customerGroup.id + '/1/' + file.fileUrl + '.pdf';
            $scope.file = file;
        };
        $scope.downloadCusResourceFile = function (file) {
            $scope.file = file;
            $scope.downloadFileHelper();
        };

        $scope.downloadFileHelper = function () {
            window.open('/file/assets/cusfile/' + $scope.file.id, '_blank', '');
        };


        /*---------------------- SLA------------------------------*/
        $scope.slaDisplayModule = 'chart';
        $scope.changeSlaInfoPanel = function (type) {
            $scope.slaDisplayModule = type;
        };

        $scope.slaQueryPanelOpen = false;
        $scope.triggerSlaQueryPanel = function () {
            $scope.slaQueryPanelOpen = !$scope.slaQueryPanelOpen;
        };

        var nowDate = new Date();
        $scope.slaQueryParam = {};
        var slaQueryBeginDate = function () {
            $scope.slaQueryParam.bd = new Date(nowDate.getFullYear(), nowDate.getMonth() - 2);
        };
        slaQueryBeginDate();
        $scope.$watch('slaQueryParam.bd', function () {
            $scope.slaQueryParam.endMinDate = $scope.slaQueryParam.bd;
            $scope.slaQueryParam.ed = new Date($scope.slaQueryParam.bd.getFullYear(), $scope.slaQueryParam.bd.getMonth());
        });
        $scope.clearSlaQueryBeginDate = function () {
            $scope.slaQueryBd = null;
        };
        $scope.clearSlaQueryEndDate = function () {
            $scope.slaQueryEd = null;
        };
        $scope.openSlaQueryBeginDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.datepicker = {'slaQueryBdOpened': true};
        };
        $scope.openSlaQueryEndDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.datepicker = {'slaQueryEdOpened': true};
        };

        $scope.slaQuery_is_loading = false;
        $scope.cusGroupSlaDonutTitle = '故障统计';
        $scope.querySla = function () {
            $scope.slaQueryParam.beginDate = new Date($scope.slaQueryParam.bd.getFullYear(), $scope.slaQueryParam.bd.getMonth(), 1, 0, 0, 0);
            $scope.slaQueryParam.endDate = new Date($scope.slaQueryParam.ed.getFullYear(), $scope.slaQueryParam.ed.getMonth() + 1, 0, 23, 59, 59);
            var beginDateValue = $filter('date')($scope.slaQueryParam.beginDate, 'yyyy-M');
            var endDateValue = $filter('date')($scope.slaQueryParam.endDate, 'yyyy-M');
            $scope.slaQuery_is_loading = true;
            if (beginDateValue === endDateValue) {
                $scope.cusGroupSlaDonutTitle = beginDateValue + ' 故障统计';
            } else {
                $scope.cusGroupSlaDonutTitle = beginDateValue + ' 到 ' + endDateValue + '&nbsp;&nbsp;故障统计';
            }

            var form = {
                customerGroupId: $scope.customerGroup.id,
                beginDate: $scope.slaQueryParam.beginDate.getTime(),
                endDate: $scope.slaQueryParam.endDate.getTime()
            };

            var chartPromise = $http.post('api/customerService/slaChart', form);
            chartPromise.then(function (response) {
                $scope.slaRawDatas = response.data.duration;
                buildSlaData();
            }, function (response) {
                throw new Error('get sla chart went wrong...');
            });

            var tablePromise = $http.post('api/customerService/slaTable', form);
            tablePromise.then(function (response) {
                $scope.faultSheets = response.data.declarationReport;
            }, function (response) {
                throw new Error('get sla table went wrong...');
            });

            var slaPromises = $q.all([chartPromise, tablePromise]);
            slaPromises.then(function () {
                $scope.slaQuery_is_loading = false;
                $scope.triggerSlaQueryPanel();
            });
        };

        var buildSlaData = function () {
            var colors = Highcharts.getOptions().colors;
            $scope.faultSlaData = [];
            $scope.subSlaData = [];
            for (var i = 0; i < $scope.slaRawDatas.length; i++) {
                var slaRawData = $scope.slaRawDatas[i];
                if (slaRawData.name.indexOf('联通端') > -1) {
                    if (!$scope.faultSlaData[0]) {
                        $scope.faultSlaData[0] = {
                            name: '联通端',
                            color: colors[5],
                            y: slaRawData.netDuration
                        };
                    } else {
                        $scope.faultSlaData[0].y = $scope.faultSlaData[0].y + slaRawData.netDuration;
                    }
                } else if (slaRawData.name.indexOf('客户端') > -1) {
                    if (!$scope.faultSlaData[1]) {
                        $scope.faultSlaData[1] = {
                            name: '客户端',
                            color: colors[0],
                            y: slaRawData.netDuration
                        };
                    } else {
                        $scope.faultSlaData[1].y = $scope.faultSlaData[1].y + slaRawData.netDuration;
                    }
                }
            }

            var slaUnicomDataLen = 0,
                slaCusDataLen = 0;
            for (var m = 0; m < $scope.slaRawDatas.length; m++) {
                var slaRawData = $scope.slaRawDatas[m];
                if (slaRawData.name.indexOf('联通端') > -1) {
                    slaUnicomDataLen++;
                } else if (slaRawData.name.indexOf('客户端') > -1) {
                    slaCusDataLen++;
                }
            }
            for (var j = 0; j < $scope.slaRawDatas.length; j++) {
                var brightness = 0.2 - (j / slaUnicomDataLen) / 5;
                var slaRawData = $scope.slaRawDatas[j];
                if (slaRawData.name.indexOf('联通端') > -1) {
                    $scope.subSlaData.push({
                        name: slaRawData.name.substring(4),
                        y: slaRawData.netDuration,
                        color: Highcharts.Color($scope.faultSlaData[0].color).brighten(brightness).get()
                    });
                }
            }

            for (var k = 0; k < $scope.slaRawDatas.length; k++) {
                var brightness = 0.2 - (k / slaCusDataLen) / 5;
                var slaRawData = $scope.slaRawDatas[k];
                if (slaRawData.name.indexOf('客户端') > -1) {
                    $scope.subSlaData.push({
                        name: slaRawData.name.substring(4),
                        y: slaRawData.netDuration,
                        color: Highcharts.Color($scope.faultSlaData[1].color).brighten(brightness).get()
                    });
                }
            }
        };
        $scope.slaDocDisplayModule = 'table';
        $scope.goBackSlaFileTable = function () {
            $scope.cusResourceFileDisplayModule = 'table';
        };
        $scope.slaDocFiles = [];
        var getSlaDoc = function () {
            $http.get(
                'api/customerService/slaDoc/' + $scope.customerGroup.id
            ).then(function (response) {
                    $scope.slaDocFiles = response.data.logs;
            });
        };
        $scope.downloadSlaFile = function (file) {
            $scope.file = file;
            $scope.downloadFileHelper();
        };
        $scope.showSlaFile = function (file) {
            $scope.slaDocDisplayModule = 'pdf';
            $scope.pdfUrl = '/assets/cusfile/' + $scope.customerGroup.id + '/5/' + file.fileUrl + '.pdf';
            $scope.file = file;
        };


        /*---------------------- netOps ------------------------------*/
        $scope.netOpsDisplayModule = 'table';
        $scope.netOpsQueryPanelOpen = false;

        $scope.triggerNetOpsQueryPanel = function () {
            $scope.netOpsQueryPanelOpen = !$scope.netOpsQueryPanelOpen;
        };

        var netOpsNowDate = new Date();
        $scope.netOpsQueryParam = {};
        var netOpsQueryBeginDate = function () {
            $scope.netOpsQueryParam.bd = new Date(netOpsNowDate.getFullYear(), netOpsNowDate.getMonth() - 2);
        };
        netOpsQueryBeginDate();
        $scope.$watch('netOpsQueryParam.bd', function () {
            $scope.netOpsQueryParam.endMinDate = $scope.netOpsQueryParam.bd;
            $scope.netOpsQueryParam.ed = new Date($scope.netOpsQueryParam.bd.getFullYear(), $scope.netOpsQueryParam.bd.getMonth());
        });

        $scope.openNetOpsQueryBeginDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.datepicker = {'netOpsQueryBdOpened': true};
        };
        $scope.openNetOpsQueryEndDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.datepicker = {'netOpsQueryEdOpened': true};
        };

        $scope.netOpsQuery_is_loading = false;
        $scope.netOpsFiles = [];
        $scope.queryNetOps = function () {
            $scope.netOpsQueryParam.beginDate = new Date($scope.netOpsQueryParam.bd.getFullYear(), $scope.netOpsQueryParam.bd.getMonth(), 1, 0, 0, 0);
            $scope.netOpsQueryParam.endDate = new Date($scope.netOpsQueryParam.ed.getFullYear(), $scope.netOpsQueryParam.ed.getMonth() + 1, 0, 23, 59, 59);
            $scope.netOpsQuery_is_loading = true;

            var form = {
                customerGroupId: $scope.customerGroup.id,
                beginDate: $scope.netOpsQueryParam.beginDate.getTime(),
                endDate: $scope.netOpsQueryParam.endDate.getTime()
            };

            var tablePromise = $http.post('api/customerService/netOps', form);
            tablePromise.then(function (response) {
                $scope.netOpsFiles = response.data.logs;
                $scope.netOpsQuery_is_loading = false;
                $scope.netOpsQueryPanelOpen = false;
            }, function (response) {
                throw new Error('get netOps went wrong...');
            });
        };


        $scope.downloadNetOpsFile = function (file) {
            $scope.file = file;
            $scope.downloadFileHelper();
        };
        $scope.showNetOpsFile = function (file) {
            $scope.netOpsDisplayModule = 'pdf';
            $scope.pdfUrl = '/assets/cusfile/' + $scope.customerGroup.id + '/2/' + file.fileUrl + '.pdf';
            $scope.file = file;
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
                        "name": "市北"
                    },
                    {
                        "name": "平安保险(唐镇)"
                    },
                    {
                        "name": "中国平安金融大厦"
                    },
                    {
                        "name": "平安保险(浦东)"
                    },
                    {
                        "name": "上海润和院"
                    },
                    {
                        "name": "东亚银行(四川中路299号)"
                    }
                ],
                links: [
                    {
                        "source": 0,
                        "target": 1,
                        "value": 2
                    },
                    {
                        "source": 0,
                        "target": 2,
                        "value": 12
                    },
                    {
                        "source": 0,
                        "target": 3,
                        "value": 8
                    },
                    {
                        "source": 0,
                        "target": 4,
                        "value": 1
                    },
                    {
                        "source": 0,
                        "target": 5,
                        "value": 1
                    },
                    {
                        "source": 1,
                        "target": 1,
                        "value": 2
                    }
                ]
            };
        };


        //$scope.customerGroupsView = false;
        //$scope.basicInfoView = false;
        //$scope.displayModule = 'bizStatus';
        //$scope.bizStatusModule = 'bizStatusPanel';
        $scope.getBizStatusData();
    }]);
