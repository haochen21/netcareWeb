cnc.bizFault = (function () {
	'use strict';

	var
		configMap = {
			main_html: String() + '<div class="cnc-panel customerTopo">' + '<div class="gallery-container">故障' + '</div>'
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
	bizFaultReceive = function (bizFault) {
		jqueryMap.$galleryPanel.append($('<div>' + bizFault.circuitNo + ' ' + bizFault.customerGroupName + ' ' + bizFault.beginTime + '</div>'));
	};

	//--------------------- 公共方法 --------------------------
	initModule = function ($container) {
		stateMap.$container = $container;
		$container.html(configMap.main_html);
		setJqueryMap();

		cnc.bizFaultTopic.subscribe(bizFaultReceive);
	};

	closeModule = function () {
		cnc.bizFaultTopic.unsubscribe(bizFaultReceive);
	};

	return {
		initModule: initModule,
		closeModule: closeModule
	};
})();

cnc.globalModel.panelDb.addPanel({
	panelId: 'bizFault',
	panel: cnc.bizFault
});