cnc.globalModel = (function () {
	'use strict';

	var
		stateMap = {
			storage: null
		},
		initModule, operator, systemMenu, customerGroups, panelDb;

	//用户数据,用户名，权限，页面配置等
	operator = (function () {
		var initModule;

		initModule = function () {
			if (stateMap.storage.getItem('operatorJson')) {
				var operatorJson = stateMap.storage.getItem('operatorJson');
				var operatorObj = JSON.parse(operatorJson);
				for (var key in operatorObj) {
					if (Object.prototype.hasOwnProperty.call(operatorObj, key)) {
						this[key] = operatorObj[key];
					}
				}
			}
		};

		return {
			initModule: initModule
		};
	})();

	customerGroups = (function () {
		var _db = TAFFY();
		var insert, remove, update, findOne, findAll, isInDb;

		insert = function (customerGroup) {
			_db.insert(customerGroup);
		};

		remove = function (id) {
			return _db({
				id: id
			}).remove();
		};

		update = function (id, value) {
			_db({
				id: id
			}).update(value);
		};

		findOne = function (name) {
			return _db({
				name: {
					like: name
				}
			});
		};

		findAll = function () {
			return _db();
		};

		isInDb = function (id) {
			return _db({
				id: id
			}).count();
		};

		return {
			insert: insert,
			remove: remove,
			update: update,
			findAll: findAll,
			isInDb: isInDb,
			findOne: findOne
		};
	})();

	systemMenu = (function () {
		var _db = TAFFY();
		var add, findById, menuHtml, initMenuHtml, initSubMenu;

		add = function (menus) {
			for (var i = 0; i < menus.length; i++) {
				_db.insert(menus[i]);
			}
		};

		initMenuHtml = function () {
			var $menuHtml = $('<ul class="main-menu-nav slim"></ul>');
			_db().each(function (val) {
				var $liItem = $('<li/>');
				var $aItem = $('<a/>').attr('href', '#');
				//菜单对应的面板ID
				if (val.id !== undefined)
					$aItem.data('panelid', val.id);

				if (val.icon) {
					var $iItem = $('<i/>', {
						'class': val.icon
					});
					$aItem.append($iItem);
				}

				if (val.name) {
					var $nameItem = $('<span/>', {
						'class': 'menu-text',
						'text': val.name
					});
					$aItem.append($nameItem);
				}
				$liItem.append($aItem);

				//如果有二级菜单
				if (val.submenus) {
					$aItem.addClass('main-menu-parent');
					var $bItem = $('<b/>', {
						'class': 'arrow fa fa-angle-down'
					});
					$aItem.append($bItem);

					var $subMenuItem = initSubMenu(val.submenus, true);
					$liItem.append($subMenuItem);
				}
				$menuHtml.append($liItem);
			});
			this.menuHtml = $menuHtml;
		};

		initSubMenu = function (submenus, secondLevel) {
			var $menuItem = $('<ul/>', {
				'class': 'main-submenu'
			});
			$.each(submenus, function (key, val) {
				var $liItem = $('<li/>');
				var $aItem = $('<a/>').attr('href', '#');
				if (val.id !== undefined)
					$aItem.data('panelid', val.id);
				if (secondLevel) {
					$aItem.append($('<i/>', {
						'class': 'fa fa-angle-double-right'
					}));
				}
				if (val.name !== null) {
					var $nameItem = $('<span/>', {
						'class': 'menu-text',
						'text': val.name
					});
					$aItem.append($nameItem);
				}
				$liItem.append($aItem);

				if (val.submenus) {
					$aItem.addClass('main-menu-parent');
					var $bItem = $('<b/>', {
						'class': 'arrow fa fa-angle-down'
					});
					$aItem.append($bItem);

					var $subMenuItem = initSubMenu(val.submenus, false);
					$liItem.append($subMenuItem);
				}
				$menuItem.append($liItem);
			});
			return $menuItem;
		};

		return {
			add: add,			
			initMenuHtml: initMenuHtml,
			menuHtml: menuHtml
		};
	})();

	panelDb = (function () {
		var panels = TAFFY();
		var clickPanels = TAFFY();

		var addPanel = function (panel) {
			panels.insert(panel);
		};

		var getPanel = function (panelId) {
			return panels({
				panelId: panelId
			}).first();
		};

		var addClickPanel = function (panel) {
			clickPanels.insert(panel);
		};

		var updateClickPanel = function (menuId, panel) {
			clickPanels({
				name: menuId
			}).update({
				content: panel
			});
		};

		var getClickPanel = function (menuId) {
			return clickPanels({
				name: menuId
			}).first();
		};

		var lastClickPanel = function () {
			return clickPanels().last();
		};

		var removeClickPanel = function (menuId) {
			return clickPanels({
				name: menuId
			}).remove();
		};

		var getClickPanelNum = function () {
			return clickPanels().count();
		};

		return {
			addPanel: addPanel,
			getPanel: getPanel,
			addClickPanel: addClickPanel,
			updateClickPanel: updateClickPanel,
			getClickPanel: getClickPanel,
			getClickPanelNum: getClickPanelNum,
			lastClickPanel: lastClickPanel,
			removeClickPanel: removeClickPanel
		};
	})();

	initModule = function ($container) {
		stateMap.storage = window.localStorage;
		operator.initModule();
	};

	return {
		initModule: initModule,
		operator: operator,
		customerGroups: customerGroups,
		systemMenu: systemMenu,
		panelDb: panelDb
	};

})();