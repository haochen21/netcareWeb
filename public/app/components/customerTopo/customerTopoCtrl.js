angular.module('netcareApp')
    .controller('customerTopoCtrl', ['$scope', '$http', '$filter', '$window','$timeout', function ($scope, $http, $filter, $window,$timeout) {

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
            if (customerMenu.id === 'cusResourceFile') {
                $scope.getCusResourceFiles();
            } else if (customerMenu.id === 'checkService') {
                $scope.getCheckService();
            } else if (customerMenu.id === 'sla') {
                $scope.buildSlaData();
            } else if (customerMenu.id === 'bizStatus') {
                $scope.getBizStatusData();
            }
        };

        $scope.download = function () {
            downloadFileHelper();
        };

        $scope.getCusResourceFiles = function () {
            $http.get(
                'api/customerService/cusResource/'+$scope.customerGroup.id
            ).then(function (response) {
                    $scope.cusResourceFiles = response.data.logs;
            });
            $scope.cusResourceFiles1 = [{
                customerGroupId: 10005,
                fileName: "技术资料维护--中国平安保险(集团)股份有限公司.doc",
                fileType: "客户资源",
                fileUrl: "10005_303095",
                id: 35101,
                syncResult: "success",
                syncTime: 1418264641000,
                taskTime: 1417678177000
            },{
                customerGroupId: 10005,
                fileName: "技术资料维护--中国平安保险(集团)股份有限公司.doc",
                fileType: "客户资源",
                fileUrl: "10005_235940",
                id: 35170,
                syncResult: "success",
                syncTime: 1418265402000,
                taskTime: 1408951623000
            },{
                customerGroupId: 10005,
                fileName: "技术资料维护--中国平安保险(集团)股份有限公司.doc",
                fileType: "客户资源",
                fileUrl: "10005_196297",
                id: 35166,
                syncResult: "success",
                syncTime: 1418265396000,
                taskTime: 1402277965000
            },{
                customerGroupId: 10005,
                fileName: "技术资料维护--中国平安保险(集团)股份有限公司.doc",
                fileType: "客户资源",
                fileUrl: "10005_189433",
                id: 35163,
                syncResult: "success",
                syncTime: 1418265390000,
                taskTime: 1401093730000
            },{
                customerGroupId: 10005,
                fileName: "电路信息20140526.xls",
                fileType: "客户资源",
                fileUrl: "10005_189299",
                id: 35167,
                syncResult: "success",
                syncTime: 1418265396000,
                taskTime: 1401088092000
            },{
                customerGroupId: 10005,
                fileName: "技术资料维护--中国平安保险(集团)股份有限公司.doc",
                fileType: "客户资源",
                fileUrl: "10005_162503",
                id: 35174,
                syncResult: "success",
                syncTime: 1418265408000,
                taskTime: 1394602604000
            }]
        };
        $scope.cusResourceFileDisplayModule = 'table';
        $scope.goBackCusResourceFileTable = function(){
            $scope.cusResourceFileDisplayModule = 'table';
        } ;
        $scope.showCusResourceFile = function (file) {
            $scope.cusResourceFileDisplayModule = 'file';
            $scope.pdfUrl = '/assets/cusfile/'+$scope.customerGroup.id+'/1/'+file.fileUrl+'.pdf';
            $scope.file = file;
        };
        $scope.downloadCusResourceFile = function (file) {
            $scope.file = file;
            $scope.downloadFileHelper();
        };

        $scope.downloadFileHelper = function(){
            window.open('/file/assets/cusfile/'+$scope.file.id, '_blank', '');
        };


        $scope.slaQueryPanelOpen = true;
        $scope.triggerSlaQueryPanel = function () {
            $scope.slaQueryPanelOpen = !$scope.slaQueryPanelOpen;
        };
        var nowDate = new Date();
        $scope.slaQueryParam = {};
        $scope.slaQueryBeginDate = function() {
            $scope.slaQueryParam.bd = new Date(nowDate.getFullYear(), nowDate.getMonth()-1);
        };
        $scope.slaQueryBeginDate();

        $scope.slaQueryEndDate = function() {
            $scope.slaQueryParam.ed = new Date(nowDate.getFullYear(), nowDate.getMonth()-1);
        };
        $scope.slaQueryEndDate();

        $scope.clearSlaQueryBeginDate = function () {
            $scope.slaQueryBd = null;
        };

        $scope.clearSlaQueryEndDate = function () {
            $scope.slaQueryEd = null;
        };

        $scope.openSlaQueryBeginDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.datepicker = {'slaQueryBdOpened': true};
        };

        $scope.openSlaQueryEndDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.datepicker = {'slaQueryEdOpened': true};
        };

        $scope.is_loading = false;
        $scope.querySla = function () {
            var beginDate = new Date($scope.slaQueryParam.bd.getFullYear(), $scope.slaQueryParam.bd.getMonth(), 1,0,0,0);
            var endDate = new Date($scope.slaQueryParam.ed.getFullYear(), $scope.slaQueryParam.ed.getMonth() + 1, 0,23,59,59);
            console.log(beginDate.getTime());
            console.log(endDate.getTime());
            $scope.is_loading = true;
            $timeout(function(){
                $scope.is_loading = false;
                $scope.triggerSlaQueryPanel();
            },1000);
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
