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
            {name: '服务评价', angle: 'deg0', id: 'serviceScore'},
            {name: 'SLA', angle: 'deg45', id: 'sla'},
            {name: '业务状态', angle: 'deg135', id: 'bizStatus'},
            {name: '服务例会', angle: 'deg180', id: 'serviceMeeting'},
            {name: '巡检服务', angle: 'deg225', id: 'checkService'},
            {name: '客户资料', angle: 'deg270', id: 'cusResourceFile'},
            {name: '运行报告', angle: 'deg315', id: 'netOps'}
        ];
        $scope.backToCustomerGroupsView = function () {
            $scope.customerGroupsView = true;
            $scope.basicInfoView = false;
            $scope.customerGroup = null;
        };

        $scope.back = function () {
            if ($scope.displayModule == 'bizStatus'
                && $scope.bizStatusDisplayModule == 'topo') {
                $scope.bizStatusDisplayModule = 'stats';
                return;
            }
            $scope.basicInfoView = true;
            $scope.displayModule = null;

            $scope.cusFileDisplayModule = 'table';
            $scope.slaDisplayModule = 'chart';
            $scope.slaDocDisplayModule = 'table';
            $scope.netOpsDisplayModule = 'table';
            $scope.serviceMeetingDisplayModule = 'table';
            $scope.serviceScoreDisplayModule = 'chart';
            $scope.bizStatusDisplayModule = 'stats';
        };

        $scope.showSubModule = function (customerMenu) {
            $scope.basicInfoView = false;
            $scope.displayModule = customerMenu.id;
            if (customerMenu.id === 'cusResourceFile') {
                $scope.queryCusFile();
            } else if (customerMenu.id === 'checkService') {
                $scope.queryCheckService();
            } else if (customerMenu.id === 'sla') {
                getSlaDoc();
            } else if (customerMenu.id === 'bizStatus') {
                $scope.getBizStatusData();
            } else if (customerMenu.id === 'netOps') {
                $scope.queryNetOps();
            } else if (customerMenu.id === 'serviceMeeting') {
                $scope.queryServiceMeetings();
            } else if (customerMenu.id === 'serviceScore') {
                $scope.queryServiceScore();
            }

            $scope.cusFileDisplayModule = 'table';
            $scope.slaDisplayModule = 'chart';
            $scope.slaDocDisplayModule = 'table';
            $scope.netOpsDisplayModule = 'table';
            $scope.serviceMeetingDisplayModule = 'table';
            $scope.serviceScoreDisplayModule = 'chart';
            $scope.bizStatusDisplayModule = 'stats';
        };

        $scope.download = function () {
            downloadFileHelper();
        };

        $scope.downloadFileHelper = function () {
            window.open('/file/assets/cusfile/' + $scope.file.id, '_blank', '');
        };

        /* ----------Customer Resource File------------------------*/
        $scope.cusFileDisplayModule = 'table';
        $scope.cusFileQueryPanelOpen = false;

        $scope.triggerCusFileQueryPanel = function () {
            $scope.cusFileQueryPanelOpen = !$scope.cusFileQueryPanelOpen;
        };

        var cusFileNowDate = new Date();
        $scope.cusFileQueryParam = {};
        var cusFileQueryBeginDate = function () {
            $scope.cusFileQueryParam.bd = new Date(cusFileNowDate.getFullYear(), cusFileNowDate.getMonth() - 3);
        };
        cusFileQueryBeginDate();
        $scope.$watch('cusFileQueryParam.bd', function () {
            $scope.cusFileQueryParam.endMinDate = $scope.cusFileQueryParam.bd;
            $scope.cusFileQueryParam.ed = new Date(cusFileNowDate.getFullYear(), cusFileNowDate.getMonth());
            if ($scope.cusFileQueryParam.ed.getTime() < $scope.cusFileQueryParam.endMinDate.getTime()) {
                $scope.cusFileQueryParam.ed = new Date($scope.cusFileQueryParam.bd.getFullYear(), $scope.cusFileQueryParam.bd.getMonth());
            }
        });

        $scope.openCusFileQueryBeginDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.datepicker = {'cusFileQueryBdOpened': true};
        };
        $scope.openCusFileQueryEndDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.datepicker = {'cusFileQueryEdOpened': true};
        };

        $scope.cusFileQuery_is_loading = false;
        $scope.queryCusFile = function () {
            $scope.cusFileQueryParam.beginDate = new Date($scope.cusFileQueryParam.bd.getFullYear(), $scope.cusFileQueryParam.bd.getMonth(), 1, 0, 0, 0);
            $scope.cusFileQueryParam.endDate = new Date($scope.cusFileQueryParam.ed.getFullYear(), $scope.cusFileQueryParam.ed.getMonth() + 1, 0, 23, 59, 59);
            $scope.cusFileQuery_is_loading = true;

            var form = {
                customerGroupId: $scope.customerGroup.id,
                beginDate: $scope.cusFileQueryParam.beginDate.getTime(),
                endDate: $scope.cusFileQueryParam.endDate.getTime()
            };

            var tablePromise = $http.post('api/customerService/cusResource', form);
            tablePromise.then(function (response) {
                $scope.cusResourceFiles = response.data.logs;
                if ($scope.cusResourceFiles.length) {
                    $scope.cusFileQueryState = 'hasData';
                } else {
                    $scope.cusFileQueryState = 'noData';
                }
                $scope.cusFileQuery_is_loading = false;
                $scope.cusFileQueryPanelOpen = false;
            }, function (response) {
                throw new Error('get cusFile went wrong...');
            });
        };

        $scope.goBackCusFileTable = function () {
            $scope.cusFileDisplayModule = 'table';
        };
        $scope.downloadCusResourceFile = function (file) {
            $scope.file = file;
            $scope.downloadFileHelper();
        };
        $scope.showCusResourceFile = function (file) {
            $scope.cusFileDisplayModule = 'pdf';
            $scope.pdfUrl = '/assets/cusfile/' + $scope.customerGroup.id + '/1/' + file.fileUrl + '.pdf';
            $scope.file = file;
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

        var slaNowDate = new Date();
        $scope.slaQueryParam = {};
        var slaQueryBeginDate = function () {
            $scope.slaQueryParam.bd = new Date(slaNowDate.getFullYear(), slaNowDate.getMonth() - 2);
        };
        slaQueryBeginDate();
        $scope.$watch('slaQueryParam.bd', function () {
            $scope.slaQueryParam.endMinDate = $scope.slaQueryParam.bd;
            $scope.slaQueryParam.ed = new Date($scope.slaQueryParam.bd.getFullYear(), $scope.slaQueryParam.bd.getMonth());
        });

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
            $scope.netOpsQueryParam.bd = new Date(netOpsNowDate.getFullYear() - 1, netOpsNowDate.getMonth());
        };
        netOpsQueryBeginDate();
        $scope.$watch('netOpsQueryParam.bd', function () {
            $scope.netOpsQueryParam.endMinDate = $scope.netOpsQueryParam.bd;
            $scope.netOpsQueryParam.ed = new Date(netOpsNowDate.getFullYear(), netOpsNowDate.getMonth());
            if ($scope.netOpsQueryParam.ed.getTime() < $scope.netOpsQueryParam.endMinDate.getTime()) {
                $scope.netOpsQueryParam.ed = new Date($scope.netOpsQueryParam.bd.getFullYear(), $scope.netOpsQueryParam.bd.getMonth());
            }
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
                if ($scope.netOpsFiles.length) {
                    $scope.netOpsQueryState = 'hasData';
                } else {
                    $scope.netOpsQueryState = 'noData';
                }
                $scope.netOpsQuery_is_loading = false;
                $scope.netOpsQueryPanelOpen = false;
            }, function (response) {
                throw new Error('get netOps went wrong...');
            });
        };

        $scope.goBackNetOpsTable = function () {
            $scope.netOpsDisplayModule = 'table';
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

        /*---------------------- serviceMeeting ------------------------------*/
        $scope.serviceMeetingDisplayModule = 'table';
        $scope.serviceMeetingQueryPanelOpen = false;

        $scope.triggerServiceMeetingQueryPanel = function () {
            $scope.serviceMeetingQueryPanelOpen = !$scope.serviceMeetingQueryPanelOpen;
        };

        var serviceMeetingNowDate = new Date();
        $scope.serviceMeetingQueryParam = {};
        var serviceMeetingQueryBeginDate = function () {
            $scope.serviceMeetingQueryParam.bd = new Date(serviceMeetingNowDate.getFullYear() - 1, serviceMeetingNowDate.getMonth());
        };
        serviceMeetingQueryBeginDate();
        $scope.$watch('serviceMeetingQueryParam.bd', function () {
            $scope.serviceMeetingQueryParam.endMinDate = $scope.serviceMeetingQueryParam.bd;
            $scope.serviceMeetingQueryParam.ed = new Date(serviceMeetingNowDate.getFullYear(), serviceMeetingNowDate.getMonth());
            if ($scope.serviceMeetingQueryParam.ed.getTime() < $scope.serviceMeetingQueryParam.endMinDate.getTime()) {
                $scope.serviceMeetingQueryParam.ed = new Date($scope.serviceMeetingQueryParam.bd.getFullYear(), $scope.serviceMeetingQueryParam.bd.getMonth());
            }
        });

        $scope.openServiceMeetingQueryBeginDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.datepicker = {'serviceMeetingQueryBdOpened': true};
        };
        $scope.openServiceMeetingQueryEndDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.datepicker = {'serviceMeetingQueryEdOpened': true};
        };

        $scope.serviceMeetingQuery_is_loading = false;
        $scope.queryServiceMeetings = function () {
            $scope.serviceMeetingQueryParam.beginDate = new Date($scope.serviceMeetingQueryParam.bd.getFullYear(), $scope.serviceMeetingQueryParam.bd.getMonth(), 1, 0, 0, 0);
            $scope.serviceMeetingQueryParam.endDate = new Date($scope.serviceMeetingQueryParam.ed.getFullYear(), $scope.serviceMeetingQueryParam.ed.getMonth() + 1, 0, 23, 59, 59);
            $scope.serviceMeetingQuery_is_loading = true;

            var form = {
                customerGroupId: $scope.customerGroup.id,
                beginDate: $scope.serviceMeetingQueryParam.beginDate.getTime(),
                endDate: $scope.serviceMeetingQueryParam.endDate.getTime()
            };

            var tablePromise = $http.post('api/customerService/serviceMeeting', form);
            tablePromise.then(function (response) {
                $scope.serviceMeetingFiles = response.data.logs;
                $scope.serviceMeetingQuery_is_loading = false;
                $scope.serviceMeetingQueryPanelOpen = false;
            }, function (response) {
                throw new Error('get serviceMeeting went wrong...');
            });
        };

        $scope.goBackServiceMeetingTable = function () {
            $scope.serviceMeetingDisplayModule = 'table';
        };
        $scope.downloadServiceMeetingFile = function (file) {
            $scope.file = file;
            $scope.downloadFileHelper();
        };
        $scope.showServiceMeetingFile = function (file) {
            $scope.serviceMeetingDisplayModule = 'pdf';
            $scope.pdfUrl = '/assets/cusfile/' + $scope.customerGroup.id + '/3/' + file.fileUrl + '.pdf';
            $scope.file = file;
        };

        /*---------------------- checkService ------------------------------*/
        $scope.checkServiceQueryPanelOpen = false;

        $scope.triggerCheckServiceQueryPanel = function () {
            $scope.checkServiceQueryPanelOpen = !$scope.checkServiceQueryPanelOpen;
        };

        var checkServiceNowDate = new Date();
        $scope.checkServiceQueryParam = {};
        var checkServiceQueryBeginDate = function () {
            $scope.checkServiceQueryParam.bd = new Date(checkServiceNowDate.getFullYear() - 1, checkServiceNowDate.getMonth());
        };
        checkServiceQueryBeginDate();
        $scope.$watch('checkServiceQueryParam.bd', function () {
            $scope.checkServiceQueryParam.endMinDate = $scope.checkServiceQueryParam.bd;
            $scope.checkServiceQueryParam.ed = new Date(checkServiceNowDate.getFullYear(), checkServiceNowDate.getMonth());
            if ($scope.checkServiceQueryParam.ed.getTime() < $scope.checkServiceQueryParam.endMinDate.getTime()) {
                $scope.checkServiceQueryParam.ed = new Date($scope.checkServiceQueryParam.bd.getFullYear(), $scope.checkServiceQueryParam.bd.getMonth());
            }
        });

        $scope.openCheckServiceQueryBeginDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.datepicker = {'checkServiceQueryBdOpened': true};
        };
        $scope.openCheckServiceQueryEndDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.datepicker = {'checkServiceQueryEdOpened': true};
        };

        $scope.checkServiceInterval = 2000;
        $scope.checkServiceTransition = false;


        $scope.queryCheckService = function () {
            $scope.checkServiceSlides = [];
            $scope.checkServiceQuery_is_loading = false;
            $scope.checkServiceQueryParam.beginDate = new Date($scope.checkServiceQueryParam.bd.getFullYear(), $scope.checkServiceQueryParam.bd.getMonth(), 1, 0, 0, 0);
            $scope.checkServiceQueryParam.endDate = new Date($scope.checkServiceQueryParam.ed.getFullYear(), $scope.checkServiceQueryParam.ed.getMonth() + 1, 0, 23, 59, 59);
            var form = {
                customerGroupId: $scope.customerGroup.id,
                beginDate: $scope.checkServiceQueryParam.beginDate.getTime(),
                endDate: $scope.checkServiceQueryParam.endDate.getTime()
            };

            var slidesPromise = $http.post('api/customerService/checkService', form);
            slidesPromise.then(function (response) {
                var checkServiceFiles = response.data.logs;
                for (var i = 0; i < checkServiceFiles.length; i++) {
                    $scope.checkServiceSlides.push({
                        image: '/assets/cusfile/' + $scope.customerGroup.id + '/4/' + checkServiceFiles[i].fileUrl,
                        text: checkServiceFiles[i].fileName
                    });
                }
                if (checkServiceFiles.length) {
                    $scope.checkQueryState = 'hasData';
                } else {
                    $scope.checkQueryState = 'noData';
                }
                $scope.checkServiceQuery_is_loading = false;
                $scope.checkServiceQueryPanelOpen = false;
            }, function (response) {
                throw new Error('get checkService went wrong...');
            });
        };


        /* ----------service score------------------------*/
        $scope.serviceScoreDisplayModule = 'chart';
        $scope.changeServiceScorePanel = function (type) {
            $scope.serviceScoreDisplayModule = type;
        };
        $scope.triggerServiceScoreQueryPanel = function () {
            $scope.serviceScoreQueryPanelOpen = !$scope.serviceScoreQueryPanelOpen;
        };
        var serviceScoreNowDate = new Date();
        $scope.serviceScoreQueryParam = {};
        var serviceScoreQueryBeginDate = function () {
            $scope.serviceScoreQueryParam.bd = new Date(serviceScoreNowDate.getFullYear(), serviceScoreNowDate.getMonth() - 2);
        };
        serviceScoreQueryBeginDate();

        $scope.openServiceScoreQueryBeginDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.datepicker = {'serviceScoreQueryBdOpened': true};
        };

        $scope.cusScorceCategories = ['网络配置', '运行状况', '服务评价', '开通指标', '人员配置'];
        $scope.cusScoreStandardName = "标准值";
        $scope.cusScoreActualName = "实际值";
        $scope.cusScorePolarTitle = '服务质量评分';
        $scope.cusScoreStandard = [100, 100, 100, 100, 100];
        $scope.serviceScoreQuery_is_loading = false;
        $scope.queryServiceScore = function () {
            $scope.serviceScoreQueryParam.beginDate = new Date($scope.serviceScoreQueryParam.bd.getFullYear(), $scope.serviceScoreQueryParam.bd.getMonth(), 1, 0, 0, 0);
            $scope.serviceScoreQueryParam.endDate = new Date($scope.serviceScoreQueryParam.bd.getFullYear(), $scope.serviceScoreQueryParam.bd.getMonth() + 1, 0, 23, 59, 59);
            var beginDateValue = $filter('date')($scope.serviceScoreQueryParam.beginDate, 'yyyy-M');
            $scope.serviceScoreQuery_is_loading = true;
            $scope.cusScorePolarTitle = beginDateValue + ' 服务质量评分';
            $scope.cusScorePolarSubtitle = $scope.customerGroup.name;

            var form = {
                customerGroupId: $scope.customerGroup.id,
                beginDate: $scope.serviceScoreQueryParam.beginDate.getTime(),
                endDate: $scope.serviceScoreQueryParam.endDate.getTime()
            };
            var promise = $http.post('api/customerService/serviceScore', form);
            promise.then(function (response) {
                $scope.serviceScore = response.data.scores[0];
                $scope.serviceScoreCategories = [
                    $scope.serviceScore.netConfig,
                    $scope.serviceScore.operatingStatus,
                    $scope.serviceScore.serviceEvalu,
                    $scope.serviceScore.patencyIndex,
                    $scope.serviceScore.staff
                ];

                if ($scope.serviceScore) {
                    $scope.cusScoreActual = [
                        $scope.serviceScore.netConfig.score,
                        $scope.serviceScore.operatingStatus.score,
                        $scope.serviceScore.serviceEvalu.score,
                        $scope.serviceScore.patencyIndex.score,
                        $scope.serviceScore.staff.score
                    ];
                } else {
                    $scope.cusScoreActual = [];
                }
                $scope.serviceScoreQuery_is_loading = false;
                $scope.serviceScoreQueryPanelOpen = false;
            }, function (response) {
                throw new Error('get serviceScore went wrong...');
            });

        };

        /* ----------business status------------------------*/
        $scope.bizStatusDisplayModule = 'stats';
        $scope.bizStatusModule = 'bizStatusPanel';
        $scope.getBizStatusData = function () {
            $scope.bizStatusDatas = [];
            var form = {
                customerGroupId: $scope.customerGroup.id
            };
            var promise = $http.post('api/customerService/bizStatusStats', form);
            promise.then(function (response) {
                $scope.bizStatusDatas = response.data.cirStatusStats;
                for (var i = 0; i < $scope.bizStatusDatas.length; i++) {
                    $scope.bizStatusDatas[i].dountData = [
                        {
                            name: "正常",
                            y: $scope.bizStatusDatas[i].normalCirNum,
                            color: Highcharts.getOptions().colors[7]
                        },
                        {
                            name: "故障",
                            y: $scope.bizStatusDatas[i].faultCirNum,
                            color: Highcharts.getOptions().colors[5]
                        }];
                }
                var arrayLength = Math.ceil($scope.bizStatusDatas.length / 4);
                $scope.bizStatusArray = new Array(arrayLength);
                for (var l = 0; l < arrayLength; l++) {
                    $scope.bizStatusArray[l] = l;
                }
            }, function (response) {
                throw new Error('get bizStatus went wrong...');
            });
        };

        $scope.showBizStatusTopo = function (bizStatusData) {
            $scope.bizStatusDisplayModule = 'topo';
            $scope.getBizStatusTopoData();
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

        var roomCircuits = [
            {
                id: 108745,
                name: "市北",
                type: "room",
                circuits: [
                    {no: "01T000087", hasFault: true},
                    {no: "01T013500", hasFault: false},
                    {no: "01T015973", hasFault: false},
                    {no: "01T018084", hasFault: false}
                ]
            },
            {
                id: 107852,
                name: "奥力孚商务大楼",
                type: "room",
                circuits: [
                    {no: "01T000087", hasFault: true}
                ]
            },
            {
                id: 114539,
                name: "外汇交易中心二期",
                type: "room",
                circuits: [
                    {no: "01T013500", hasFault: false}
                ]
            },
            {
                id: 100847,
                name: "人民银行大厦",
                type: "room",
                circuits: [
                    {no: "01T015973", hasFault: false}
                ]
            },
            {
                id: 102067,
                name: "上证通二期",
                type: "room",
                circuits: [
                    {no: "01T018084", hasFault: false},
                    {no: "21T022894", hasFault: false},
                    {no: "21T022895", hasFault: false},
                    {no: "21T022895", hasFault: false},
                    {no: "21T022896", hasFault: false},
                    {no: "21T022896", hasFault: false}
                ]
            },
            {
                id: 106437,
                name: "平安保险（唐镇）",
                type: "room",
                circuits: [
                    {no: "21T022894", hasFault: false},
                    {no: "21T025509", hasFault: false},
                    {no: "21T025508", hasFault: false}
                ]
            },
            {
                id: 103232,
                name: "平安保险(上丰路1158号)",
                type: "me",
                circuits: [
                    {no: "21T025509", hasFault: false},
                    {no: "21T025508", hasFault: false}
                ]
            }
        ];

        var roomCircuits1 = [
            {
                id: 108745,
                name: "市北",
                type: "room",
                circuits: [
                    {no: "01T000087", hasFault: true},
                    {no: "01T013500", hasFault: false},
                    {no: "01T015973", hasFault: false},
                    {no: "01T018084", hasFault: false}
                ]
            },
            {
                id: 107852,
                name: "奥力孚商务大楼",
                type: "room",
                circuits: [
                    {no: "01T000087", hasFault: true},
                    {no: "01T013500", hasFault: false},
                    {no: "01T015973", hasFault: false},
                    {no: "01T018084", hasFault: false},
                    {no: "21T022895", hasFault: false},
                    {no: "21T022895", hasFault: false},
                    {no: "21T022896", hasFault: false},
                    {no: "21T022896", hasFault: false}
                ]
            }
        ];


        $scope.getBizStatusTopoData = function () {
            //roomCircuits = roomCircuits1;
            $scope.bizStatusTopoDatas = {};
            var links = [];
            for (var i = 0; i < roomCircuits.length; i++) {
                //统计这个结点下同一电路的数量
                var result = roomCircuits[i].circuits.reduce(function (previousValue, currentValue) {
                    if (currentValue.no in previousValue) {
                        previousValue[currentValue.no]++;
                    } else {
                        previousValue[currentValue.no] = 1;
                    }
                    return previousValue;
                }, {});

                var uniqueArray = [];
                //获取这个机房下电路的唯一值
                var uniqueCircuits = [];
                roomCircuits[i].circuits.forEach(function (circuit) {
                    if (uniqueArray.indexOf(circuit.no) < 0) {
                        uniqueArray.push(circuit.no);
                        uniqueCircuits.push(circuit);
                    }
                });
                //AZ端都属于一个机房的电路数
                var aZIsTheSame = 0;
                uniqueCircuits.forEach(function (circuit) {
                    if (result[circuit.no] === 2) {
                        aZIsTheSame++;
                    }
                });
                if(aZIsTheSame >0){
                    var link = {source: roomCircuits[i], target: roomCircuits[i], subLinksSize: aZIsTheSame};
                    var subLinks = [];
                    uniqueCircuits.forEach(function (circuit) {
                        if (result[circuit.no] === 2) {
                            circuit.linkNo = subLinks.length+1;
                            subLinks.push(circuit);
                        }
                    });
                    link.subLinks = subLinks;
                    links.push(link);
                }

                //电路分别存在AZ机房里
                for (var j = i + 1; j < roomCircuits.length; j++) {
                    uniqueCircuits.forEach(function (aCircuit) {
                        var sameCircuits = roomCircuits[j].circuits.filter(function (zCircuit) {
                            return aCircuit.no === zCircuit.no;
                        });
                        if (sameCircuits.length) {
                            var link = topoLinkIsExist(links, roomCircuits[i], roomCircuits[j]);
                            if (link) {
                                link.value = link.value + 1;
                                aCircuit.linkNo = link.subLinks.length+1;
                                link.subLinks.push(aCircuit);
                            } else {
                                var link = {source: roomCircuits[i], target: roomCircuits[j]};
                                aCircuit.linkNo = 1;
                                link.subLinks = [aCircuit];
                                links.push(link);
                            }
                        }
                    });
                }
            }

            $scope.bizStatusTopoDatas = {
                nodes: roomCircuits,
                links: links
            };
        };

        var topoLinkIsExist = function (links, source, target) {
            for (var i = 0; i < links.length; i++) {
                if ((links[i].source.id === source.id && links[i].target.id === target.id)
                    || (links[i].source.id === target.id && links[i].target.id === source.id)) {
                    return links[i];
                }
            }
            return undefined;
        };
        //$scope.customerGroupsView = false;
        //$scope.basicInfoView = false;
        //$scope.displayModule = 'bizStatus';
        //$scope.bizStatusModule = 'bizStatusPanel';
    }]);
