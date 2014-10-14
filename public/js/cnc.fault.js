cnc.bizFault = (function () {
	'use strict';

	var
		configMap = {
			main_html: String() + '<div class="cnc-panel fault">' + '<div class="gallery-container">故障' + '</div>'
		},
		stateMap = {
			$container: undefined
		},
		jqueryMap = {},
		initModule, closeModule, setJqueryMap,
		bizFaultReceive;

	//--------------------- DOM 操作方法 --------------------
	setJqueryMap = function () {
		var
			$container = stateMap.$container;

		jqueryMap = {
			$galleryPanel: $container.find('.gallery-container')
		};
	};

	//--------------------- EVENT 操作方法 --------------------
	bizFaultReceive = function (fault) {
        var meCreateTime = new Date();
        meCreateTime.setTime(fault.meCreateTime);
		jqueryMap.$galleryPanel.append($('<div>' + fault.no + ' ' + fault.customerGroupInfo + ' ' + meCreateTime.Format("yyyy-MM-dd hh:mm:ss") +' ' +fault.operation + '</div>'));
	};

	//--------------------- 公共方法 --------------------------
	initModule = function ($container) {
		stateMap.$container = $container;
		$container.html(configMap.main_html);
		setJqueryMap();

		cnc.faultSocket.subscribe(bizFaultReceive);
	};

	closeModule = function () {
		cnc.faultSocket.unsubscribe(bizFaultReceive);
	};

	return {
		initModule: initModule,
		closeModule: closeModule
	};
})();

cnc.globalModel.panelDb.addPanel({
	panelId: 'fault',
	panel: cnc.fault
});