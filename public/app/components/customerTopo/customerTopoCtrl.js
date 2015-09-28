angular.module('netcareApp')
    .controller('customerTopoCtrl', ['$scope','$rootScope', '$http', '$filter', '$window', '$timeout', '$q', '$modal','noty','netcareCache',
        function ($scope, $rootScope,$http, $filter, $window, $timeout, $q, $modal,noty,netcareCache) {

            var user = netcareCache.get("user");

            //打开查询按钮
            $rootScope.$broadcast('shellSearchShow','');

            $scope.customerGroupsView = true;
            var orderBy = $filter('orderBy');
            $scope.getCustomerGroups = function (name) {
                $scope.customerGroups = orderBy(netcareCache.get('customerGroups'), 'classify', true);
                var customerGroupsArrayLength = Math.ceil($scope.customerGroups.length / 3);
                $scope.customerGroupsArray = new Array(customerGroupsArrayLength);
                for (var i = 0; i < customerGroupsArrayLength; i++) {
                    $scope.customerGroupsArray[i] = i;
                }
                //如果用户只有一个客户组，直接调用客户拓扑页面
                if($scope.customerGroups.length === 1){
                    $scope.singleCustomerGroup($scope.customerGroups[0]);
                }
                createTopoMenu();
            };

            $scope.$on('shellSearch', function (event, searchText) {
                if($scope.customerGroupsView){
                    $scope.customerGroupCriteria = searchText;
                }else{
                    if($scope.bizStatusDisplayModule === 'topo'
                        && $scope.bizStatusTopoDisplayModule === 'circuit'){
                        $scope.searchCircuitKeyword  = searchText;
                    }
                }
            });

            //customerGroup rating
            $scope.customerGroupRateMax = 3;

            $scope.basicInfoView = false;
            $scope.singleCustomerGroup = function (customerGroup) {
                //customerGroup.id = 15421;
                //银行间市场清算所股份有限
                //customerGroup.id = 10005;
                //customerGroup.name = '中国平安保险(集团)股份有限公司';
                $scope.customerGroupsView = false;
                $scope.basicInfoView = true;
                $scope.customerGroup = customerGroup;
                getCustomerGroupCircuitStats();
                $window.scrollTo(0, 0);

                //关闭查询按钮
                $rootScope.$broadcast('shellSearchHide','');
                $scope.customerGroupCriteria = '';
            };

            var getCustomerGroupCircuitStats = function(){
                $scope.cusCircuitDonutData  = [];
                var form = {
                    customerGroupId: $scope.customerGroup.id
                };
                var statsPromise = $http.post('api//customers/statCusGroupCircuit', form);
                statsPromise.then(function (response) {
                    var statsData = response.data.circuitStats;
                    for(var i=0;i<statsData.length;i++){
                        if(statsData[i].name === '正常' ){
                            $scope.cusCircuitDonutData.push({
                                name: "正常",
                                y: statsData[i].circuitNum,
                                color: '#ffffff'
                            });
                        }else if(statsData[i].name === '故障' ){
                            $scope.cusCircuitDonutData.push({
                                name: "故障",
                                y: statsData[i].circuitNum,
                                color: '#3bbfb4'
                            });
                        }
                    }
                }, function (response) {
                    throw new Error('get customerGroup circuit stats wrong...');
                });
            };

            var createTopoMenu = function(){
                var isCustomerManager = false;
                for(var i=0;i<user.permission.length;i++){
                    if(user.permission[i].name === 'CNS_SSP_DATAFLOW'){
                        isCustomerManager = true;
                        break;
                    }
                }
                if(isCustomerManager){
                    $scope.customerMenus = [
                        {name: '服务评价', angle: 'deg0', id: 'serviceScore',permission:'CNS_SSP_SERVICESCORE'},
                        {name: 'SLA', angle: 'deg45', id: 'sla',permission:'CNS_SSP_SLA'},
                        {name: '业务状态', angle: 'deg90', id: 'bizStatus',permission:'CNS_SSP_BIZSTATUS'},
                        {name: '端口流量', angle: 'deg135', id: 'portFlow',permission:'CNS_SSP_DATAFLOW'},
                        {name: '服务例会', angle: 'deg180', id: 'serviceMeeting',permission:'CNS_SSP_SERVICEMEETING'},
                        {name: '巡检服务', angle: 'deg225', id: 'checkService',permission:'CNS_SSP_CHECKSERVICE'},
                        {name: '客户资料', angle: 'deg270', id: 'cusResourceFile',permission:'CNS_SSP_RESOURCEFILE'},
                        {name: '运行报告', angle: 'deg315', id: 'netOps',permission:'CNS_SSP_NETOPS'}
                    ];
                }else{
                    $scope.customerMenus = [
                        {name: '服务评价', angle: 'deg0', id: 'serviceScore',permission:'CNS_SSP_SERVICESCORE'},
                        {name: 'SLA', angle: 'deg45', id: 'sla',permission:'CNS_SSP_SLA1'},
                        {name: '业务状态', angle: 'deg135', id: 'bizStatus',permission:'CNS_SSP_BIZSTATUS'},
                        {name: '服务例会', angle: 'deg180', id: 'serviceMeeting',permission:'CNS_SSP_SERVICEMEETING'},
                        {name: '巡检服务', angle: 'deg225', id: 'checkService',permission:'CNS_SSP_CHECKSERVICE'},
                        {name: '客户资料', angle: 'deg270', id: 'cusResourceFile',permission:'CNS_SSP_RESOURCEFILE'},
                        {name: '运行报告', angle: 'deg315', id: 'netOps',permission:'CNS_SSP_NETOPS'}
                    ];
                }
            };

            $scope.backToCustomerGroupsView = function () {
                $scope.customerGroupsView = true;
                $scope.basicInfoView = false;
                $scope.customerGroup = null;
                $rootScope.$broadcast('shellSearchShow','');
            };

            $scope.back = function () {
                if ($scope.displayModule == 'bizStatus'
                    && $scope.bizStatusDisplayModule == 'topo') {
                    $scope.bizStatusDisplayModule = 'stats';
                    $rootScope.$broadcast('shellSearchHide','');
                    return;
                }

                if($scope.portFlowDisplayModule == 'chart'){
                    $scope.goBackPortFlowTable();
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
                $scope.bizStatusTopoDisplayModule = 'siteTopo';
                $scope.portFlowDisplayModule = 'table';
            };

            $scope.showSubModule = function (customerMenu) {
                //判断权限
                var hasPermission = false
                for(var i=0;i<user.permission.length;i++){
                    if(user.permission[i].name === customerMenu.permission){
                        hasPermission = true;
                        break;
                    }
                }
                if(!hasPermission){
                    noty.show('请先获取功能权限',"information")
                    return;
                }
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
                }else if (customerMenu.id === 'portFlow') {
                    $scope.queryPortFlowCircuit();
                }

                $scope.cusFileDisplayModule = 'table';
                $scope.slaDisplayModule = 'chart';
                $scope.slaDocDisplayModule = 'table';
                $scope.netOpsDisplayModule = 'table';
                $scope.serviceMeetingDisplayModule = 'table';
                $scope.serviceScoreDisplayModule = 'chart';
                $scope.bizStatusDisplayModule = 'stats';
                $scope.bizStatusTopoDisplayModule = 'siteTopo';
                $scope.portFlowDisplayModule = 'table';
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
            $scope.firstQueryCircuitByBizStatus = false;
            $scope.firstQueryBizAlarmByBizStatus = false;
            //点击机房连线后对应的电路
            $scope.bizStatusClickCircuit = {nos: ""};

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
                    var arrayLength = Math.ceil($scope.bizStatusDatas.length / 3);
                    $scope.bizStatusArray = new Array(arrayLength);
                    for (var l = 0; l < arrayLength; l++) {
                        $scope.bizStatusArray[l] = l;
                    }
                }, function (response) {
                    throw new Error('get bizStatus went wrong...');
                });
            };

            $scope.backToBizStatusStats = function () {
                $scope.bizStatusDisplayModule = 'stats';
                $scope.bizStatusTopoDisplayModule = 'siteTopo';
            };

            $scope.changeBizStatusTopoPanel = function () {
                $scope.bizStatusTopoDisplayModule = 'siteTopo';
            };

            $scope.showBizStatusTopo = function (bizStatusData) {
                $scope.bizStatusData = bizStatusData;
                $scope.bizStatusDisplayModule = 'topo';
                $scope.bizStatusTopoDisplayModule = 'siteTopo';
                $scope.bizStatusClickCircuit.nos = "";
                $scope.firstQueryCircuitByBizStatus = false;
                $scope.firstQueryBizAlarmByBizStatus = false;
                $rootScope.$broadcast('shellSearchShow','');
                $scope.getBizStatusTopoData();
            };

            $scope.getBizStatusTopoData = function () {
                $scope.bizStatusTopoDatas = {};

                var form = {
                    customerGroupId: $scope.customerGroup.id,
                    serviceType: $scope.bizStatusData.name
                };
                var siteMapPromise = $http.post('api/customerService/bizStatusSiteMap', form);
                siteMapPromise.then(function (response) {
                    var roomCircuits = response.data.bizStatusSiteMap;

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
                        if (aZIsTheSame > 0) {
                            var link = {source: roomCircuits[i], target: roomCircuits[i], subLinksSize: aZIsTheSame};
                            var subLinks = [];
                            uniqueCircuits.forEach(function (circuit) {
                                if (result[circuit.no] === 2) {
                                    circuit.linkNo = subLinks.length + 1;
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
                                        aCircuit.linkNo = link.subLinks.length + 1;
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
                }, function (response) {
                    throw new Error('get bizStatusSiteMap went wrong...');
                });
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

            $scope.bizStatusCircuitFilter = function (element) {
                if ($scope.bizStatusClickCircuit.nos.length) {
                    var index = $scope.bizStatusClickCircuit.nos.indexOf(element.no);
                    if (index < 0)
                        return false;
                    else
                        return true;
                } else {
                    return true;
                }
            };

            $scope.sort = '$index';
            $scope.reverse = true;
            $scope.showBizStatusCircuit = function () {
                $scope.bizStatusTopoDisplayModule = 'circuit';
                if (!$scope.firstQueryCircuitByBizStatus) {
                    $scope.firstQueryCircuitByBizStatus = true;
                    $scope.bizStatusTopoCircuits = [];
                    var form = {
                        customerGroupId: $scope.customerGroup.id,
                        serviceType: $scope.bizStatusData.name
                    };
                    var circuitPromise = $http.post('api/circuitService/cusGroupAndServiceType', form);
                    circuitPromise.then(function (response) {
                        $scope.bizStatusTopoCircuits = response.data.circuits;
                    }, function (response) {
                        throw new Error('get siteMap circuit went wrong...');
                    });
                }
            };

            $scope.bizStatusAlarmFilter = function (element) {
                if ($scope.bizStatusClickCircuit.nos.length) {
                    var circuitNos = element.circuits.split(',');
                    var hasCircuit = false;
                    for (var i = 0; i < circuitNos.length; i++) {
                        var oldCircuitNo = circuitNos[i];
                        var signIndex = oldCircuitNo.indexOf('@');
                        if (signIndex > 0) {
                            oldCircuitNo = oldCircuitNo.substr(0, signIndex);
                        }
                        var index = $scope.bizStatusClickCircuit.nos.indexOf(oldCircuitNo);
                        if (index >= 0) {
                            hasCircuit = true;
                            break;
                        }
                    }
                    return hasCircuit;
                } else {
                    return true;
                }
            };

            $scope.showBizStatusAlarm = function () {
                $scope.bizStatusTopoDisplayModule = 'alarm';
                if (!$scope.firstQueryBizAlarmByBizStatus) {
                    $scope.firstQueryBizAlarmByBizStatus = true;
                    $scope.bizStatusTopoAlarms = [];
                    var form = {
                        customerGroupId: $scope.customerGroup.id,
                        serviceType: $scope.bizStatusData.name
                    };
                    var circuitPromise = $http.post('api/alarmService/cusGroupAndServiceType', form);
                    circuitPromise.then(function (response) {
                        $scope.bizStatusTopoAlarms = response.data.alarms;
                    }, function (response) {
                        throw new Error('get siteMap bizAlarm went wrong...');
                    });
                }
            };

            /*-------------circuit manage---------------------------*/
            $scope.backToCircuitMgmt = function () {
                $scope.circuitRoute = null;
                $scope.bizStatusDisplayModule = 'topo';
            };

            $scope.showCirTextRoute = function ($event, circuit) {
                $event.stopPropagation();
                var form = {
                    circuitId: circuit.id
                };
                var queryPromise = $http.post('api/circuit/textRoute', form);
                queryPromise.then(function (response) {
                    $scope.bizStatusCirTextRoute = response.data.textRoute;
                    var modalInstance = $modal.open({
                        templateUrl: 'bizStatusCirTextRoute.html',
                        controller: 'BizStatusCirTextRouteInstanceCtrl',
                        resolve: {
                            bizStatusCirTextRoute: function () {
                                return $scope.bizStatusCirTextRoute;
                            }
                        }
                    });
                }, function (response) {
                    throw new Error('get circuit text route wrong...');
                });
            };

            $scope.showCirRoute = function ($event, circuit) {
                $event.stopPropagation();
                $scope.circuitRoute = {};
                $scope.bizStatusDisplayModule = 'circuitMgmtTopo';

                var form = {
                    circuitId: circuit.id,
                    operatorId: user.id
                };
                var queryPromise = $http.post('api/circuit/route', form);
                queryPromise.then(function (response) {
                    $scope.selectCircuit = circuit;
                    $scope.circuitRoute = response.data;
                }, function (response) {
                    throw new Error('get circuit text route wrong...');
                });
                //$scope.selectCircuit = circuit;
                //$scope.circuitRoute = cirRouteTestData;
            };

            $scope.showCirFault = function ($event, circuit) {
                $event.stopPropagation();
                $scope.bizStatusCirMgmtAlarms = [];
                $scope.bizStatusDisplayModule = 'circuitMgmtAlarm';
                var form = {
                    circuitId: circuit.id
                };
                var queryPromise = $http.post('api/alarm/bizAlarmByCircuit', form);
                queryPromise.then(function (response) {
                    $scope.bizStatusCirMgmtAlarms = response.data.alarms;
                }, function (response) {
                    throw new Error('get circuit biz alarm wrong...');
                });
            };

            $scope.isShowChannelText = true;
            $scope.showChannelText = function(){
                $scope.isShowChannelText = !$scope.isShowChannelText;
            };

            /*--------------------portFlow----------------------------*/
            $scope.portFlowDisplayModule = 'table';
            $scope.portFlowQueryPanelOpen = false;

            $scope.triggerPortFlowQueryPanel = function () {
                $scope.portFlowQueryPanelOpen = !$scope.portFlowQueryPanelOpen;
            };

            var portFlowNowDate = new Date();
            portFlowNowDate.setHours(23);
            portFlowNowDate.setMinutes(59);
            portFlowNowDate.setSeconds(59);
            portFlowNowDate.setMilliseconds(999);
            $scope.portFlowQueryParam = {};
            $scope.portFlowQueryParam.ed = portFlowNowDate;

            $scope.$watch('portFlowQueryParam.ed', function () {
                $scope.portFlowQueryParam.ed.setHours(23);
                $scope.portFlowQueryParam.ed.setMinutes(59);
                $scope.portFlowQueryParam.ed.setSeconds(59);
                $scope.portFlowQueryParam.ed.setMilliseconds(999);

                $scope.portFlowQueryParam.dayBd = new Date($scope.portFlowQueryParam.ed.getTime());
                $scope.portFlowQueryParam.dayBd.setHours(0);
                $scope.portFlowQueryParam.dayBd.setMinutes(0);
                $scope.portFlowQueryParam.dayBd.setSeconds(0);
                $scope.portFlowQueryParam.dayBd.setMilliseconds(0);

                $scope.portFlowQueryParam.weekBd = new Date($scope.portFlowQueryParam.ed.getTime()-6*24*60*60*1000);
                $scope.portFlowQueryParam.weekBd.setHours(0);
                $scope.portFlowQueryParam.weekBd.setMinutes(0);
                $scope.portFlowQueryParam.weekBd.setSeconds(0);
                $scope.portFlowQueryParam.weekBd.setMilliseconds(0);

                $scope.portFlowQueryParam.monthBd = new Date($scope.portFlowQueryParam.ed.getTime()-30*24*60*60*1000);
                $scope.portFlowQueryParam.monthBd.setHours(0);
                $scope.portFlowQueryParam.monthBd.setMinutes(0);
                $scope.portFlowQueryParam.monthBd.setSeconds(0);
                $scope.portFlowQueryParam.monthBd.setMilliseconds(0);

                $scope.portFlowQueryParam.yearBd = new Date($scope.portFlowQueryParam.ed.getTime()-365*24*60*60*1000);
                $scope.portFlowQueryParam.yearBd.setHours(0);
                $scope.portFlowQueryParam.yearBd.setMinutes(0);
                $scope.portFlowQueryParam.yearBd.setSeconds(0);
                $scope.portFlowQueryParam.yearBd.setMilliseconds(0);

            });

            $scope.openPortFlowQueryBeginDate = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.datepicker = {'portFlowQueryBdOpened': true};
            };

            $scope.queryPortFlowCircuit = function(){
                $scope.portFlowCircuits = {};
                var form = {
                    customerGroupId: $scope.customerGroup.id
                };
                var promise = $http.post('api/dataFlow/getCircuit', form);
                promise.then(function (response) {
                    $scope.portFlowCircuits = response.data.circuits;
                    if($scope.portFlowCircuits.length >0){
                        $scope.portFlowQueryState = 'hasData';
                    }else{
                        $scope.portFlowQueryState = 'noData';
                    }
                }, function (response) {
                    throw new Error('get port flow circuit went wrong...');
                });
            };

            $scope.showPortFlow = function(circuit){
                $scope.portFlowDisplayModule = 'chart';
                $scope.portFlowCircuit = circuit;
                $scope.queryPortFlow();
            };

            $scope.goBackPortFlowTable = function () {
                $scope.portFlowDisplayModule = 'table';
            };

            $scope.portFlowQuery_is_loading = false;
            $scope.queryPortFlow = function(){
                $scope.portFlowQuery_is_loading = true;

                $scope.portFlowDaily = {};
                $scope.portFlowDaily.inFlow = [];
                $scope.portFlowDaily.outFlow=[];
                var dailyForm = {
                    beginDate: $scope.portFlowQueryParam.dayBd.getTime(),
                    endDate: $scope.portFlowQueryParam.ed.getTime(),
                    circuitId: $scope.portFlowCircuit.id
                };
                var getDayPromise = $http.post('api/dataFlow/getDailyFlow',dailyForm);
                getDayPromise.then(function (response) {
                    for(var i = 0;i<response.data.dataFlow.length;i++){
                        var dataFlow = response.data.dataFlow[i];
                        var time = new Date(dataFlow.time);
                        var inFlow =[dataFlow.time,dataFlow.inFlow];
                        var outFlow = [dataFlow.time,dataFlow.outFlow];
                        $scope.portFlowDaily.inFlow.push(inFlow);
                        $scope.portFlowDaily.outFlow.push(outFlow);
                    }
                }, function (response) {
                    throw new Error('get daily flow wrong...');
                });

                $scope.portFlowWeek = {};
                $scope.portFlowWeek.inFlow = [];
                $scope.portFlowWeek.outFlow=[];
                var weekForm = {
                    beginDate: $scope.portFlowQueryParam.weekBd.getTime(),
                    endDate: $scope.portFlowQueryParam.ed.getTime(),
                    circuitId: $scope.portFlowCircuit.id
                };
                var getWeekPromise = $http.post('api/dataFlow/getWeekFlow',weekForm);
                getWeekPromise.then(function (response) {
                    for(var i = 0;i<response.data.dataFlow.length;i++){
                        var dataFlow = response.data.dataFlow[i];
                        var time = new Date(dataFlow.time);
                        var inFlow =[dataFlow.time,dataFlow.inFlow];
                        var outFlow = [dataFlow.time,dataFlow.outFlow];
                        $scope.portFlowWeek.inFlow.push(inFlow);
                        $scope.portFlowWeek.outFlow.push(outFlow);
                    }
                }, function (response) {
                    throw new Error('get week flow wrong...');
                });

                $scope.portFlowMonth = {};
                $scope.portFlowMonth.inFlow = [];
                $scope.portFlowMonth.outFlow=[];
                var monthForm = {
                    beginDate: $scope.portFlowQueryParam.monthBd.getTime(),
                    endDate: $scope.portFlowQueryParam.ed.getTime(),
                    circuitId: $scope.portFlowCircuit.id
                };
                var getMonthPromise = $http.post('api/dataFlow/getMonthFlow',monthForm);
                getMonthPromise.then(function (response) {
                    for(var i = 0;i<response.data.dataFlow.length;i++){
                        var dataFlow = response.data.dataFlow[i];
                        var time = new Date(dataFlow.time);
                        var inFlow =[dataFlow.time,dataFlow.inFlow];
                        var outFlow = [dataFlow.time,dataFlow.outFlow];
                        $scope.portFlowMonth.inFlow.push(inFlow);
                        $scope.portFlowMonth.outFlow.push(outFlow);
                    }
                }, function (response) {
                    throw new Error('get month flow wrong...');
                });

                $scope.portFlowYear = {};
                $scope.portFlowYear.inFlow = [];
                $scope.portFlowYear.outFlow=[];
                var yearForm = {
                    beginDate: $scope.portFlowQueryParam.yearBd.getTime(),
                    endDate: $scope.portFlowQueryParam.ed.getTime(),
                    circuitId: $scope.portFlowCircuit.id
                };
                var getYearPromise = $http.post('api/dataFlow/getYearFlow',yearForm);
                getYearPromise.then(function (response) {
                    for(var i = 0;i<response.data.dataFlow.length;i++){
                        var dataFlow = response.data.dataFlow[i];
                        var time = new Date(dataFlow.time);
                        var inFlow =[dataFlow.time,dataFlow.inFlow];
                        var outFlow = [dataFlow.time,dataFlow.outFlow];
                        $scope.portFlowYear.inFlow.push(inFlow);
                        $scope.portFlowYear.outFlow.push(outFlow);
                    }
                }, function (response) {
                    throw new Error('get year flow wrong...');
                });

                var flowQueryPromises = $q.all([getDayPromise,getWeekPromise,getMonthPromise,getYearPromise]);
                flowQueryPromises.then(flowQueryFinish);
            };

            var flowQueryFinish = function(){
                $scope.portFlowQuery_is_loading = false;
                $scope.portFlowQueryPanelOpen = false;
            };

            $scope.getWeekMargin = function(){
                var beginDate = $filter('date')($scope.portFlowQueryParam.weekBd,'yyyy-MM-dd');
                var endDate = $filter('date')($scope.portFlowQueryParam.ed,'yyyy-MM-dd');
                return beginDate+" 至 "+endDate;
            };

            $scope.getMonthMargin = function(){
                var beginDate = $filter('date')($scope.portFlowQueryParam.monthBd,'yyyy-MM-dd');
                var endDate = $filter('date')($scope.portFlowQueryParam.ed,'yyyy-MM-dd');
                return beginDate+" 至 "+endDate;
            };

            $scope.getYearMargin = function(){
                var beginDate = $filter('date')($scope.portFlowQueryParam.yearBd,'yyyy-MM-dd');
                var endDate = $filter('date')($scope.portFlowQueryParam.ed,'yyyy-MM-dd');
                return beginDate+" 至 "+endDate;
            };
            //$scope.customerGroupsView = false;
            //$scope.basicInfoView = false;
            //$scope.displayModule = 'bizStatus';
            //$scope.bizStatusModule = 'bizStatusPanel';
            var cusCircuitDonutTestData = [
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

            var roomCircuits1 = [
                {
                    id: 108745,
                    name: "市北",
                    type: "room",
                    circuits: [
                        {no: "00T030822", hasFault: true},
                        {no: "21V000324", hasFault: false},
                        {no: "00T030823", hasFault: true},
                        {no: "21D110522", hasFault: false}
                    ]
                },
                {
                    id: 107852,
                    name: "奥力孚商务大楼",
                    type: "room",
                    circuits: [
                        {no: "00T030822", hasFault: true}
                    ]
                },
                {
                    id: 114539,
                    name: "外汇交易中心二期",
                    type: "room",
                    circuits: [
                        {no: "21V000324", hasFault: false}
                    ]
                },
                {
                    id: 100847,
                    name: "人民银行大厦",
                    type: "room",
                    circuits: [
                        {no: "00T030823", hasFault: true}
                    ]
                },
                {
                    id: 102067,
                    name: "上证通二期",
                    type: "room",
                    circuits: [
                        {no: "21D110522", hasFault: false},
                        {no: "21Z203050EXI", hasFault: false},
                        {no: "21Z216699VOT", hasFault: false},
                        {no: "21Z216699VOT", hasFault: false},
                        {no: "21T030821", hasFault: false},
                        {no: "21T030821", hasFault: false}
                    ]
                },
                {
                    id: 106437,
                    name: "平安保险（唐镇）",
                    type: "room",
                    circuits: [
                        {no: "21Z203050EXI", hasFault: false},
                        {no: "21Z201516VOT", hasFault: false},
                        {no: "21Z201547VOT", hasFault: false}
                    ]
                },
                {
                    id: 103232,
                    name: "平安保险(上丰路1158号)",
                    type: "me",
                    circuits: [
                        {no: "21Z201516VOT", hasFault: false},
                        {no: "21Z201547VOT", hasFault: false}
                    ]
                }
            ];

            var roomCircuits2 = [
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

            var cirTextRouteTestData = "11776-中国工商银行股份有限公司上海市分公司 13-N２EFSO:08（新开通总头，VLAN：2021） 12616-中国建设银行股份有限公司(F):03-EFS:01（VLAN：2021）<br/><br/><br/>【11776-中国工商银行股份有限公司上海市分行(B):13-N２EFSO:08】<br/>→【11776-中国工商银行股份有限公司上海市分行(B):04-CXL４:01】【622M:01/VC4:01/VC12:26(2-2-2)】【2744-金桥汇聚主架(B):04-N１SLQ４:03】<br/>→【1422-新黄浦(F)--2744-金桥(B)/155M0001/45M03/2M24(3-1-2)】<br/>→【1422-新黄浦汇聚主架(B):12-SL64:01】【VC4:34/VC12:04(1-2-1)】【1423-157地块汇聚主架(B):07-SL64:01】<br/>→【1423-157地块汇聚主架(B):06-SLQ16:04】【VC16:01/VC4:01/VC12:44(2-1-3)】【2686-157地块接入子架(B):08-SLQ16:01】<br/>→【2686-157地块接入子架(B):13-N１SLQ４:01】【622M:01/VC4:01/VC12:27(3-2-2)】【10061-汇通大厦(B):04-CXL４:01】<br/>→【10061-汇通大厦(B):06-R１SLQ１:01】【VC4:01/VC12:15(3-5-1)】【12616-中国建设银行股份有限公司上海市分行信息技术部(B):05-OI２D:01】<br/>→【12616-中国建设银行股份有限公司(B):03-EFS:01】<br/><br/>====================<br/>【1422-新黄浦(F)--2744-金桥(B)/155M0001】高阶通道路由为：<br/>【【1422-新黄浦汇聚主架(B):30-SL６４:01】【VC4:23】】【2006-新黄埔核心主架(C):20-JL６４:01】<br/>→【【2006-新黄埔核心主架(C):36-JL６４:01】【VC4:34】】【2007-金桥核心主架(C):33-JL６４:01】<br/>→【【2007-金桥核心主架(C):19-JQ１６:03】【VC16:01/VC4:03】】【2744-金桥汇聚主架(B):05-SLQ１６:04】<br/><br/><br/><br/><br/><br/><br/><br/>备注：<br/>A端端口下联业务： <br/>Z端端口下联业务： <br/>";
            var cirBizAlarmsTestData = [{
                id: "28285510",
                name: "DOWN_E1_AIS",
                severity: "次要",
                meCreateTime: 1407998777000,
                meName: "华为U2000XHP-3@2235-茂名核心扩1",
                deviceName: "2-PQ1-4",
                isAck: true,
                isBusiness: true,
                circuits: "21V101630@语音数字中继",
                customerGroups: "银行间市场清算所股份有限公司"
            }];
            var cirRouteTestData = {
                channels: [
                    {
                        text: "4-Q1SL4-1-VC4:1 VC12:26 <-> 4-N1SLQ4-3-VC4:1 VC12:26",
                        type: 0,
                        aend: {
                            meid: 14861254,
                            mename: "11776-中国工商银行股份有限公司上海市分行",
                            deviceType: "传输"
                        },
                        zend: {
                            meid: 14541654,
                            mename: "2744-金桥(低阶溢出)",
                            deviceType: "传输"
                        }
                    },
                    {
                        text: "5-N2SLQ16-4-VC4:3 VC12:24 <-> 19-Q16E-3-VC4:3 VC12:24",
                        type: 0,
                        aend: {
                            meid: 14541654,
                            mename: "2744-金桥(低阶溢出)",
                            deviceType: "传输"
                        },
                        zend: {
                            meid: 17759598,
                            mename: "2007-金桥",
                            deviceType: "传输"
                        }
                    },
                    {
                        text: "33-L64E-1-VC4:34 VC12:24 <-> 36-L64E-1-VC4:34 VC12:24",
                        type: 0,
                        aend: {
                            meid: 17759598,
                            mename: "2007-金桥",
                            deviceType: "传输"
                        },
                        zend: {
                            meid: 16727325,
                            mename: "2006-新黄浦核心环主",
                            deviceType: "传输"
                        }
                    },
                    {
                        text: "20-L64E-1-VC4:23 VC12:24 <-> 30-N1SL64-1-VC4:23 VC12:24",
                        type: 0,
                        aend: {
                            meid: 16727325,
                            mename: "2006-新黄浦核心环主",
                            deviceType: "传输"
                        },
                        zend: {
                            meid: 16077669,
                            mename: "1422-新黄浦",
                            deviceType: "传输"
                        }
                    },
                    {
                        text: " 12-T2SL64-1-VC4:34 VC12:4<->7-T2SL64-1-VC4:34 VC12:4 ",
                        type: 0,
                        aend: {
                            meid: 16077669,
                            mename: "1422-新黄浦",
                            deviceType: "传输"
                        },
                        zend: {
                            meid: 16347226,
                            mename: "1423-157地块",
                            deviceType: "传输"
                        }
                    },
                    {
                        text: "6-N2SLQ16-4-VC4:1 VC12:44 <-> 8-N2SLQ16-1-VC4:1 VC12:44",
                        type: 0,
                        aend: {
                            meid: 16347226,
                            mename: "1423-157地块",
                            deviceType: "传输"
                        },
                        zend: {
                            meid: 16434991,
                            mename: "2686-157地块汇聚层接入子架",
                            deviceType: "传输"
                        }
                    },
                    {
                        text: "13-N2SLQ16-4-VC4:1 VC12:44 <-> 11-N2SLQ16-1-VC4:1 VC12:44",
                        type: 0,
                        aend: {
                            meid: 16347226,
                            mename: "1423-157地块",
                            deviceType: "传输"
                        },
                        zend: {
                            meid: 16434991,
                            mename: "2686-157地块汇聚层接入子架",
                            deviceType: "传输"
                        }
                    },
                    {
                        text: "13-N1SLQ4-1-VC4:1 VC12:27 <-> 4-Q1SL4-1-VC4:1 VC12:27",
                        type: 0,
                        aend: {
                            meid: 16434991,
                            mename: "2686-157地块汇聚层接入子架",
                            deviceType: "传输"
                        },
                        zend: {
                            meid: 16180536,
                            mename: "10061-汇通大厦",
                            deviceType: "传输"
                        }
                    },
                    {
                        text: "6-R1SLQ1-1-VC4:1 VC12:15 <-> 5-OI2D-1-VC4:1 VC12:15",
                        type: 0,
                        aend: {
                            meid: 16180536,
                            mename: "10061-汇通大厦",
                            deviceType: "传输"
                        },
                        zend: {
                            meid: 16341187,
                            mename: "12616-中国建设银行股份有限公司上海市分行信息技术部",
                            deviceType: "传输"
                        }
                    }
                ],
                faultMes: [14861254],
                alarmMes: [14541654],
                ameid: 14861254,
                zmeid: 16341187
            };

            var portFlowCircuitsTestData = [{
                no:'21D006152',
                serviceType:'互联网普通专线接入',
                neInfo:'0309-MAN-SR3-MH-7609-S',
                portInfo:'GigabitEthernet2/2'
            },{
                no:'21D087397',
                serviceType:'互联网普通专线接入',
                neInfo:'0322-man-SR12-CHJ-NE40E-x8',
                portInfo:'GigabitEthernet2/0/9'
            }];

            var portFlowDailyTestData = {dataFlow:  [
                {
                    time: 1433174430000,
                    inFlow: 38879.732,
                    outFlow: 5234.292
                },
                {
                    time: 1433174730000,
                    inFlow: 35275.721,
                    outFlow: 4774.556
                },
                {
                    time: 1433175030000,
                    inFlow: 33654.563,
                    outFlow: 4405.773
                },
                {
                    time: 1433175330000,
                    inFlow: 31066.413,
                    outFlow: 4184.4
                },
                {
                    time: 1433175630000,
                    inFlow: 26554.677,
                    outFlow: 3864.493
                },
                {
                    time: 1433175930000,
                    inFlow: 30239.688,
                    outFlow: 4040.091
                },
                {
                    time: 1433176230000,
                    inFlow: 27393.601,
                    outFlow: 3597.432
                },
                {
                    time: 1433176530000,
                    inFlow: 23107.492,
                    outFlow: 3320.965
                },
                {
                    time: 1433176830000,
                    inFlow: 22052.063,
                    outFlow: 3069.778
                },
                {
                    time: 1433177130000,
                    inFlow: 22655.948,
                    outFlow: 3134.823
                },
                {
                    time: 1433177430000,
                    inFlow: 19071.259,
                    outFlow: 2956.267
                },
                {
                    time: 1433177730000,
                    inFlow: 19175.919,
                    outFlow: 2950.469
                },
                {
                    time: 1433178030000,
                    inFlow: 16112.792,
                    outFlow: 2707.679
                },
                {
                    time: 1433178330000,
                    inFlow: 15181.743,
                    outFlow: 2561.634
                },
                {
                    time: 1433178630000,
                    inFlow: 13825.978,
                    outFlow: 2233.161
                },
                {
                    time: 1433178930000,
                    inFlow: 12051.897,
                    outFlow: 2076.075
                },
                {
                    time: 1433179230000,
                    inFlow: 12330.447,
                    outFlow: 1917.931
                },
                {
                    time: 1433179530000,
                    inFlow: 13730.964,
                    outFlow: 2134.158
                },
                {
                    time: 1433179830000,
                    inFlow: 12356.903,
                    outFlow: 2037.979
                },
                {
                    time: 1433180130000,
                    inFlow: 10700.775,
                    outFlow: 1852.376
                },
                {
                    time: 1433180430000,
                    inFlow: 11639.411,
                    outFlow: 1868.674
                },
                {
                    time: 1433180730000,
                    inFlow: 11083.52,
                    outFlow: 1729.821
                },
                {
                    time: 1433181030000,
                    inFlow: 11421.478,
                    outFlow: 1832.351
                },
                {
                    time: 1433181330000,
                    inFlow: 10571.246,
                    outFlow: 1740.778
                },
                {
                    time: 1433181630000,
                    inFlow: 9078.991,
                    outFlow: 1619.883
                },
                {
                    time: 1433181930000,
                    inFlow: 10069.018,
                    outFlow: 1661.438
                },
                {
                    time: 1433182230000,
                    inFlow: 10767.56,
                    outFlow: 1696.482
                },
                {
                    time: 1433182530000,
                    inFlow: 8054.143,
                    outFlow: 1467.375
                },
                {
                    time: 1433182830000,
                    inFlow: 8631.885,
                    outFlow: 1488.337
                },
                {
                    time: 1433183130000,
                    inFlow: 11028.399,
                    outFlow: 1825.391
                },
                {
                    time: 1433183430000,
                    inFlow: 7744.602,
                    outFlow: 1730.285
                },
                {
                    time: 1433183730000,
                    inFlow: 8643.812,
                    outFlow: 1393.536
                },
                {
                    time: 1433184030000,
                    inFlow: 8330.132,
                    outFlow: 1359.694
                },
                {
                    time: 1433184330000,
                    inFlow: 6435.269,
                    outFlow: 1241.861
                },
                {
                    time: 1433184630000,
                    inFlow: 7173.117,
                    outFlow: 1225.279
                },
                {
                    time: 1433184930000,
                    inFlow: 9135.404,
                    outFlow: 1407.334
                },
                {
                    time: 1433185230000,
                    inFlow: 6146.666,
                    outFlow: 1120.272
                },
                {
                    time: 1433185530000,
                    inFlow: 7000.889,
                    outFlow: 1277.72
                },
                {
                    time: 1433185830000,
                    inFlow: 7448.794,
                    outFlow: 1250.914
                },
                {
                    time: 1433186130000,
                    inFlow: 6274.497,
                    outFlow: 1130.764
                },
                {
                    time: 1433186430000,
                    inFlow: 7117.438,
                    outFlow: 1224.347
                },
                {
                    time: 1433186730000,
                    inFlow: 7534.858,
                    outFlow: 1176.55
                },
                {
                    time: 1433187030000,
                    inFlow: 6445.159,
                    outFlow: 1136.362
                },
                {
                    time: 1433187330000,
                    inFlow: 7077.751,
                    outFlow: 1140.936
                },
                {
                    time: 1433187630000,
                    inFlow: 6522.688,
                    outFlow: 1158.263
                },
                {
                    time: 1433187930000,
                    inFlow: 6820.492,
                    outFlow: 1184.1
                },
                {
                    time: 1433188230000,
                    inFlow: 6215.718,
                    outFlow: 1089.162
                },
                {
                    time: 1433188530000,
                    inFlow: 7371.057,
                    outFlow: 1151.868
                },
                {
                    time: 1433188830000,
                    inFlow: 6209.36,
                    outFlow: 1154.365
                },
                {
                    time: 1433189130000,
                    inFlow: 6962.955,
                    outFlow: 1143.821
                },
                {
                    time: 1433189730000,
                    inFlow: 6123.505,
                    outFlow: 1086.532
                },
                {
                    time: 1433190030000,
                    inFlow: 5859.61,
                    outFlow: 1062.188
                },
                {
                    time: 1433190330000,
                    inFlow: 7260.342,
                    outFlow: 1265.409
                },
                {
                    time: 1433190630000,
                    inFlow: 5262.053,
                    outFlow: 1060.627
                },
                {
                    time: 1433190930000,
                    inFlow: 7033.793,
                    outFlow: 1238.433
                },
                {
                    time: 1433191230000,
                    inFlow: 7563.929,
                    outFlow: 1314.078
                },
                {
                    time: 1433191530000,
                    inFlow: 7217.845,
                    outFlow: 1254.212
                },
                {
                    time: 1433191830000,
                    inFlow: 6528.462,
                    outFlow: 1135.038
                },
                {
                    time: 1433192130000,
                    inFlow: 9771.612,
                    outFlow: 1374.567
                },
                {
                    time: 1433192430000,
                    inFlow: 6402.302,
                    outFlow: 1216.556
                },
                {
                    time: 1433192730000,
                    inFlow: 7106.52,
                    outFlow: 1280.454
                },
                {
                    time: 1433193030000,
                    inFlow: 8114.177,
                    outFlow: 1420.132
                },
                {
                    time: 1433193330000,
                    inFlow: 7694.858,
                    outFlow: 1415.557
                },
                {
                    time: 1433193630000,
                    inFlow: 7672.526,
                    outFlow: 1345.287
                },
                {
                    time: 1433193930000,
                    inFlow: 9782.521,
                    outFlow: 1502.615
                },
                {
                    time: 1433194230000,
                    inFlow: 8978.015,
                    outFlow: 1663.141
                },
                {
                    time: 1433194530000,
                    inFlow: 10728.724,
                    outFlow: 1884.807
                },
                {
                    time: 1433194830000,
                    inFlow: 10882.902,
                    outFlow: 1876.859
                },
                {
                    time: 1433195130000,
                    inFlow: 12094.898,
                    outFlow: 1899.726
                },
                {
                    time: 1433195430000,
                    inFlow: 11193.78,
                    outFlow: 1893.306
                },
                {
                    time: 1433195730000,
                    inFlow: 13166.788,
                    outFlow: 2150.358
                },
                {
                    time: 1433196030000,
                    inFlow: 12247.767,
                    outFlow: 2186.931
                },
                {
                    time: 1433196330000,
                    inFlow: 14782.523,
                    outFlow: 2527.615
                },
                {
                    time: 1433196630000,
                    inFlow: 17134.943,
                    outFlow: 2938.546
                },
                {
                    time: 1433196930000,
                    inFlow: 16617.163,
                    outFlow: 2844.09
                },
                {
                    time: 1433197230000,
                    inFlow: 22870.447,
                    outFlow: 3136.752
                },
                {
                    time: 1433197530000,
                    inFlow: 21286.652,
                    outFlow: 3206.194
                },
                {
                    time: 1433197830000,
                    inFlow: 20319.678,
                    outFlow: 3094.681
                },
                {
                    time: 1433198130000,
                    inFlow: 22643.766,
                    outFlow: 3462.93
                },
                {
                    time: 1433198430000,
                    inFlow: 21161.419,
                    outFlow: 3326.521
                },
                {
                    time: 1433198730000,
                    inFlow: 24394.433,
                    outFlow: 3661.534
                },
                {
                    time: 1433199030000,
                    inFlow: 23291.935,
                    outFlow: 3576.182
                },
                {
                    time: 1433199330000,
                    inFlow: 25441.817,
                    outFlow: 3756.307
                },
                {
                    time: 1433199630000,
                    inFlow: 24104.972,
                    outFlow: 3835.656
                },
                {
                    time: 1433199930000,
                    inFlow: 28073.288,
                    outFlow: 4238.735
                },
                {
                    time: 1433200230000,
                    inFlow: 31874.231,
                    outFlow: 4668.582
                },
                {
                    time: 1433200530000,
                    inFlow: 31157.871,
                    outFlow: 4743.08
                },
                {
                    time: 1433200830000,
                    inFlow: 30100.671,
                    outFlow: 4770.32
                },
                {
                    time: 1433201130000,
                    inFlow: 32479.063,
                    outFlow: 4876.936
                },
                {
                    time: 1433201430000,
                    inFlow: 31955.976,
                    outFlow: 5058.142
                },
                {
                    time: 1433201730000,
                    inFlow: 34843.33,
                    outFlow: 5649.871
                },
                {
                    time: 1433202030000,
                    inFlow: 38869.366,
                    outFlow: 6268.03
                },
                {
                    time: 1433202330000,
                    inFlow: 40323.602,
                    outFlow: 5973.978
                },
                {
                    time: 1433202630000,
                    inFlow: 44415.878,
                    outFlow: 6349.315
                },
                {
                    time: 1433202930000,
                    inFlow: 49562.679,
                    outFlow: 7039.856
                },
                {
                    time: 1433203230000,
                    inFlow: 52910.519,
                    outFlow: 7120.277
                },
                {
                    time: 1433203530000,
                    inFlow: 59112.296,
                    outFlow: 8012.557
                },
                {
                    time: 1433203830000,
                    inFlow: 71007.804,
                    outFlow: 9805.132
                },
                {
                    time: 1433204130000,
                    inFlow: 71295.904,
                    outFlow: 10158.594
                },
                {
                    time: 1433204430000,
                    inFlow: 82946.667,
                    outFlow: 12077.037
                },
                {
                    time: 1433204730000,
                    inFlow: 80093.507,
                    outFlow: 11702.062
                },
                {
                    time: 1433205030000,
                    inFlow: 93881.294,
                    outFlow: 13323.295
                },
                {
                    time: 1433205330000,
                    inFlow: 106805.184,
                    outFlow: 15004.657
                },
                {
                    time: 1433205630000,
                    inFlow: 114450.21,
                    outFlow: 16569.279
                },
                {
                    time: 1433205930000,
                    inFlow: 118249.793,
                    outFlow: 16857.988
                },
                {
                    time: 1433206230000,
                    inFlow: 123726.386,
                    outFlow: 18048.075
                },
                {
                    time: 1433206530000,
                    inFlow: 139046.572,
                    outFlow: 19946.737
                },
                {
                    time: 1433206830000,
                    inFlow: 135724.481,
                    outFlow: 19361.684
                },
                {
                    time: 1433207130000,
                    inFlow: 148842.114,
                    outFlow: 21261.503
                },
                {
                    time: 1433207430000,
                    inFlow: 164803.655,
                    outFlow: 23053.099
                },
                {
                    time: 1433207730000,
                    inFlow: 170542.357,
                    outFlow: 23973.533
                },
                {
                    time: 1433208030000,
                    inFlow: 163028.683,
                    outFlow: 22713.339
                },
                {
                    time: 1433208330000,
                    inFlow: 173798.322,
                    outFlow: 24076.38
                },
                {
                    time: 1433208630000,
                    inFlow: 162685.531,
                    outFlow: 23244.359
                },
                {
                    time: 1433208930000,
                    inFlow: 160914.705,
                    outFlow: 22735.347
                },
                {
                    time: 1433209230000,
                    inFlow: 168889.484,
                    outFlow: 24067.91
                },
                {
                    time: 1433209530000,
                    inFlow: 162994.797,
                    outFlow: 24387.357
                },
                {
                    time: 1433209830000,
                    inFlow: 166747.433,
                    outFlow: 24693.486
                },
                {
                    time: 1433210130000,
                    inFlow: 170903.524,
                    outFlow: 25070.147
                },
                {
                    time: 1433210430000,
                    inFlow: 171874.166,
                    outFlow: 25412.817
                },
                {
                    time: 1433210730000,
                    inFlow: 172474.889,
                    outFlow: 24528.854
                },
                {
                    time: 1433211030000,
                    inFlow: 184758.481,
                    outFlow: 26100.813
                },
                {
                    time: 1433211330000,
                    inFlow: 174995.152,
                    outFlow: 25223.896
                },
                {
                    time: 1433211630000,
                    inFlow: 176113.713,
                    outFlow: 25676.864
                },
                {
                    time: 1433211930000,
                    inFlow: 176920.676,
                    outFlow: 24997.065
                },
                {
                    time: 1433212230000,
                    inFlow: 182555.74,
                    outFlow: 25790.624
                },
                {
                    time: 1433212530000,
                    inFlow: 184459.489,
                    outFlow: 25465.152
                },
                {
                    time: 1433212830000,
                    inFlow: 185628.132,
                    outFlow: 26608.057
                },
                {
                    time: 1433213130000,
                    inFlow: 176214.985,
                    outFlow: 25594.539
                },
                {
                    time: 1433213430000,
                    inFlow: 178633.139,
                    outFlow: 24638.188
                },
                {
                    time: 1433213730000,
                    inFlow: 181489.293,
                    outFlow: 25522.062
                },
                {
                    time: 1433214030000,
                    inFlow: 174755.481,
                    outFlow: 24513.479
                },
                {
                    time: 1433214330000,
                    inFlow: 177402.052,
                    outFlow: 25856.496
                },
                {
                    time: 1433214630000,
                    inFlow: 187790.663,
                    outFlow: 25998.526
                },
                {
                    time: 1433214930000,
                    inFlow: 173298.687,
                    outFlow: 24388.891
                },
                {
                    time: 1433215230000,
                    inFlow: 175159.369,
                    outFlow: 24057.568
                },
                {
                    time: 1433215530000,
                    inFlow: 178102.653,
                    outFlow: 25095.489
                },
                {
                    time: 1433215830000,
                    inFlow: 160603.982,
                    outFlow: 23425.293
                },
                {
                    time: 1433216130000,
                    inFlow: 160458.714,
                    outFlow: 22694.778
                },
                {
                    time: 1433216430000,
                    inFlow: 150229.375,
                    outFlow: 22139.896
                },
                {
                    time: 1433216730000,
                    inFlow: 146898.978,
                    outFlow: 21405.994
                },
                {
                    time: 1433217030000,
                    inFlow: 149802.129,
                    outFlow: 21639.085
                },
                {
                    time: 1433217330000,
                    inFlow: 137794.722,
                    outFlow: 21286.744
                },
                {
                    time: 1433217630000,
                    inFlow: 135289.013,
                    outFlow: 19647.398
                },
                {
                    time: 1433217930000,
                    inFlow: 126192.85,
                    outFlow: 18524.651
                },
                {
                    time: 1433218230000,
                    inFlow: 113812.443,
                    outFlow: 16703.674
                },
                {
                    time: 1433218530000,
                    inFlow: 111974.999,
                    outFlow: 16786.139
                },
                {
                    time: 1433218830000,
                    inFlow: 111149.175,
                    outFlow: 16253.151
                },
                {
                    time: 1433219130000,
                    inFlow: 121604.801,
                    outFlow: 17547.004
                },
                {
                    time: 1433219430000,
                    inFlow: 116475.901,
                    outFlow: 16615.781
                },
                {
                    time: 1433219730000,
                    inFlow: 118858.379,
                    outFlow: 17272.427
                },
                {
                    time: 1433220030000,
                    inFlow: 117486.752,
                    outFlow: 17922.546
                },
                {
                    time: 1433220330000,
                    inFlow: 113841.721,
                    outFlow: 16865.34
                },
                {
                    time: 1433220630000,
                    inFlow: 119392.045,
                    outFlow: 17497.813
                },
                {
                    time: 1433220930000,
                    inFlow: 119121.274,
                    outFlow: 18038.744
                },
                {
                    time: 1433221230000,
                    inFlow: 115553.029,
                    outFlow: 17431.178
                },
                {
                    time: 1433221530000,
                    inFlow: 120587.7,
                    outFlow: 18217.612
                },
                {
                    time: 1433221830000,
                    inFlow: 125427.684,
                    outFlow: 18047.945
                },
                {
                    time: 1433222130000,
                    inFlow: 129035.67,
                    outFlow: 18514.52
                },
                {
                    time: 1433222430000,
                    inFlow: 127212.661,
                    outFlow: 18543.36
                },
                {
                    time: 1433222730000,
                    inFlow: 134406.272,
                    outFlow: 19446.728
                },
                {
                    time: 1433223030000,
                    inFlow: 137421.398,
                    outFlow: 19908.714
                },
                {
                    time: 1433223330000,
                    inFlow: 134760.608,
                    outFlow: 20188.415
                },
                {
                    time: 1433223630000,
                    inFlow: 145010.393,
                    outFlow: 20656.354
                },
                {
                    time: 1433223930000,
                    inFlow: 135730.543,
                    outFlow: 19892.507
                },
                {
                    time: 1433224230000,
                    inFlow: 148476.317,
                    outFlow: 21098.712
                },
                {
                    time: 1433224530000,
                    inFlow: 150371.196,
                    outFlow: 21273.32
                },
                {
                    time: 1433224830000,
                    inFlow: 150288.564,
                    outFlow: 21588.225
                },
                {
                    time: 1433225130000,
                    inFlow: 150063.589,
                    outFlow: 22096.57
                },
                {
                    time: 1433225430000,
                    inFlow: 154585.441,
                    outFlow: 22669.378
                }
            ]};

            //页面启动时查询客户组
            $scope.getCustomerGroups();
        }])
    .controller('BizStatusCirTextRouteInstanceCtrl', function ($scope, $modalInstance, bizStatusCirTextRoute) {
        $scope.circuitTextRoute = bizStatusCirTextRoute;
        $scope.ok = function () {
            $modalInstance.close();
        };
    });
