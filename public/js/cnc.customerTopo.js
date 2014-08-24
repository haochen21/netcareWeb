cnc.customerTopo = (function () {
	'use strict';

	var
		configMap = {
			main_html: String() 
			  + '<div class="cnc-panel customerTopo">'
			    + '<div class="gallery-container">客户拓扑' 
			    + '</div>'
			         +'<div>portal100</br>portal99</br>portal98</br>portal97</br>portal96</br>portal95</br>portal94</br>93</br>1</br>1</br>1</br>1</br>1</br>1</br>1</br>1</br>1</br>1</br>1</br>1</br>1</br>1</br>1</br>1</br>1</br>1</br>1</br>1</br>1</br>1</br>11</br>10</br>9</br>8</br>7</br>6</br>5</br>4</br>3</br>2</br>1</br>0</br></div>'
			  + '</div>'
		},
		stateMap = {
			$container: undefined
		},
		jqueryMap = {},
		initModule, closeModule, setJqueryMap,
		initCustomerTopo;

	//--------------------- DOM 操作方法 --------------------
	setJqueryMap = function () {
		var
			$container = stateMap.$container;

		jqueryMap = {
			$galleryPanel: $container.find('.gallery-container')
		};
	};
	
	//--------------------- EVENT 操作方法 --------------------


	//--------------------- 公共方法 --------------------------
	initModule = function ($container) {
		stateMap.$container = $container;
		$container.html(configMap.main_html);
		setJqueryMap();
	};

	closeModule = function () {

	};

	return {
		initModule: initModule,
		closeModule: closeModule
	};
})();

cnc.globalModel.panelDb.addPanel({
	panelId: 'customerTopo',
	panel: cnc.customerTopo
});