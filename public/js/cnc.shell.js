cnc.shell = (function () {
	var
		configMap = {
			main_html: String()
			  +'<nav id="main-navbar" class="navbar navbar-inverse navbar-fixed-top" role="navigation">'
			    +'<button type="button" id="main-menu-toggle">'
			      +'<i class="navbar-icon fa fa-bars icon"></i>'
			    +'</button>'
			    +'<div class="navbar-inner">'
			      +'<!-- Main navbar header -->'
			      +'<div class="navbar-header">'
			      +'<div class="navbar-brand">'
			        +'<div><img src="../img/main-navbar-logo.png"></div>'
					    +'NetCare'
				    +'</div>'
   				  +'<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#main-navbar-collapse">'
			        +'<i class="navbar-icon fa fa-bars"></i>'
			      +'</button>'
			      +'</div> <!-- / .navbar-header -->'
			      +'<div class="collapse navbar-collapse" id="main-navbar-collapse">'
			        +'<ul class="nav navbar-nav navbar-right">'
			          +'<li class="nav-icon-btn nav-icon-btn-info dropdown click-menu">'
			            +'<a href="#" class="dropdown-toggle" data-toggle="dropdown">'
									  +'<span class="label"></span>'
									  +'<i class="nav-icon fa fa-tasks"></i>'
									  +'<span class="small-screen-text">菜单</span>'
								  +'</a>'
			            +'<div class="dropdown-menu widget-notifications">'
			              +'<div class="notifications-list" id="main-navbar-notifications"></div>'
			            +'</div>'
			          +'</li>'
			          +'<li class="nav-icon-btn nav-icon-btn-danger dropdown alarm">'
			            +'<a href="#notifications" class="dropdown-toggle" data-toggle="dropdown">'
									  +'<i class="label fa fa-times"></i>'
									  +'<i class="nav-icon fa fa-bell"></i>'
									  +'<span class="small-screen-text">告警</span>'
								  +'</a>'
			            +'<div class="dropdown-menu widget-notifications no-padding">'
			              +'<div class="notifications-list">'
			                +'<div class="notification">'
											  +'<div class="notification-title text-danger">UP_E1_AIS</div>'
											    +'<div class="notification-description">华为U2000XHP-3@2656-市北汇聚环扩展子架: <strong>3-PQ1-31</strong></div>'
											    +'<div class="notification-ago">2013-12-06 15:36:40</div>'
											    +'<div class="notification-icon fa fa-bell-o alarm-cirtical"></div>'
										    +'</div> <!-- / .notification -->'
			                  +'<div class="notification">'
											  +'<div class="notification-title text-danger">DOWN_E1_AIS</div>'
											    +'<div class="notification-description">华为城域网@10422-市北3500-17-1:<strong>11-N2EGS2-1</strong>.</div>'
											    +'<div class="notification-ago">2012-09-07 18:04:16</div>'
											    +'<div class="notification-icon fa fa-bell-o alarm-major"></div>'
										    +'</div> <!-- / .notification -->'
			              +'</div>'
			              +'<a href="#" class="notifications-link">更多告警</a>'
			            +'</div>'
			          +'</li>'
			          +'<li class="nav-icon-btn nav-icon-btn-danger dropdown fault">'
			            +'<a href="#notifications" class="dropdown-toggle" data-toggle="dropdown">'
									  +'<i class="label fa fa-times"></i>'
									  +'<i class="nav-icon fa fa-joomla"></i>'
									  +'<span class="small-screen-text">故障</span>'
								  +'</a>'
			            +'<div class="dropdown-menu widget-notifications">'
			              +'<div class="notifications-list"></div>'
			              +'<a href="#" class="notifications-link">更多故障</a>'
			            +'</div>'
			          +'</li>'
			          +'<li class="dropdown user-menu">'
			            +'<a href="#"  class="dropdown-toggle" data-toggle="dropdown">'
			              +'<span class="glyphicon glyphicon-user"></span><span>陈昊</span>'
			            +'</a>'
			            +'<div class="dropdown-menu widget-notifications">'
			              +'<div class="notifications-list">'
			                +'<div class="notification fault">'
			                  +'<div class="notification-title">故障接收</div>'
			                  +'<div class="notification-switcher">'
			                    +'<input type="checkbox" data-size="small">'
			                  +'</div>'
			                +'</div>'
			                +'<div class="notification alarm">'
			                  +'<div class="notification-title">告警接收</div>'
			                  +'<div class="notification-switcher">'
			                    +'<input type="checkbox" data-size="small">'
			                  +'</div>'
			                +'</div>'
			                +'<div class="notification text-center logout">'
			                  +'<a href="#">'
			                    +'<span class="notification-title fa fa-power-off">&nbsp;&nbsp;&nbsp;&nbsp;注销</span>'
			                  +'</a>'
			                +'</div>'
			              +'</div>'
                  +'</div>'
			          +'</li>'
			        +'</ul>'
			      +'</div>'
			    +'</div>'
			  +'</nav>'
			  +'<aside id="mainMenu" class="fixed">'
          +'<nav class="main-menu-wrapper">'
            +'<div class="main-menu-shortcuts">'
              +'<button type="button" class="btn btn-success tooltip-success one" data-toggle="tooltip" data-placement="bottom">1</button>'
              +'<button type="button" class="btn btn-info tooltip-info two" data-toggle="tooltip" data-placement="bottom">2</button>'
              +'<button type="button" class="btn btn-primary tooltip-primary three" data-toggle="tooltip" data-placement="bottom">3</button>'
              +'<button type="button" class="btn btn-warning tooltip-warining four" data-toggle="tooltip" data-placement="bottom">4</button>'
            +'</div>'
          +'</nav>'
        +'</aside>'
			  +'<div class="main-panel">'
          +'<span class="closeBtn"><i class="pull-right fa fa-times-circle fa-lg"></i></span>'
          +'<div class="main-panel-content"></div>'
        +'</div>'
		},
		stateMap = {
			$container: null,
      isMenuOpen : false,
      menuId : ''
		},
		jqueryMap = {},
		setJqueryMap,initModule,initShell,clickMenuItem,openOrCloseMainMenu,
	  openOrCloseMainMenu,openPanel,setInitMenus,setClickMenuNum,initBackToTop,
		closeMainPanel,clickNavBarMenu,setClickMenuColor,changeFaultStatus,
		openFaultPanel,faultReceive,changeAlarmStatus,logOut;

	//--------------------- BEGIN DOM METHODS --------------------
	setJqueryMap = function () {
		var $container = stateMap.$container;
		jqueryMap = {
			$container: $container,
			$menu_btn: $container.find('#main-menu-toggle'),
            $mainMenuPanel: $container.find('.main-menu-wrapper'),
			$mainPanel: $container.find('.main-panel'),
            $mainPanelCloseBtn:$container.find('.main-panel > span.closeBtn'),
            $mainPanelContent: $container.find('.main-panel-content'),
			$clickMenuNum:$container.find('.click-menu>a>.label'),
			$clickMenuList:$container.find('.click-menu .notifications-list'),
			$faultCheck:$container.find('.user-menu .fault .notification-switcher>input'),
			$faultContainer:$container.find('.navbar-nav .fault'),
			$faultList:$container.find('.navbar-nav .fault .notifications-list'),
			$faultOpenPanel:$container.find('.navbar-nav .fault .notifications-link'),
			$faultStatus:$container.find('.navbar-nav .fault >a >.label'),
			$alarmCheck:$container.find('.user-menu .alarm .notification-switcher>input'),
			$alarmContainer:$container.find('.navbar-nav .alarm'),
			$alarmStatus:$container.find('.navbar-nav .alarm >a >.label'),
			$logout:$container.find('.user-menu .logout > a')
		};
	};

	initShell = function(){
		stateMap.$container.empty();
		stateMap.$container.html(configMap.main_html);
		setJqueryMap();

		jqueryMap.$mainMenuPanel.append(cnc.globalModel.systemMenu.menuHtml);
		jqueryMap.$mainMenuNav = jqueryMap.$container.find('.main-menu-nav');

		setInitMenus();
		initBackToTop();

		$.gevent.subscribe(jqueryMap.$faultStatus, 'faultStatus', changeFaultStatus);
        cnc.faultSocket.subscribe(faultReceive);
		jqueryMap.$faultCheck.bootstrapSwitch();
		jqueryMap.$faultCheck.on('switchChange.bootstrapSwitch', function(event, state) {
			if(state){
				cnc.faultSocket.connect();
			}else{
				cnc.faultSocket.disConnect();
			}
        });
        var faultState = false;
        if(cnc.globalModel.operator.setting){
            faultState = cnc.globalModel.operator.setting.fault;
        }
		jqueryMap.$faultCheck.bootstrapSwitch().bootstrapSwitch('state', faultState);

		jqueryMap.$alarmCheck.bootstrapSwitch();
		jqueryMap.$alarmCheck.on('switchChange.bootstrapSwitch', function(event, state) {
            $.gevent.publish('alarmStatus', state);
        });

		jqueryMap.$menu_btn.bind('click', openOrCloseMainMenu);
		jqueryMap.$mainMenuPanel.bind('click',clickMenuItem);
		jqueryMap.$mainPanelCloseBtn.bind ('click',closeMainPanel);
		jqueryMap.$clickMenuList.bind ('click',clickNavBarMenu);
		jqueryMap.$faultOpenPanel.bind('click',openFaultPanel)
		jqueryMap.$logout.bind ('click',logOut);


		$.gevent.subscribe(jqueryMap.$alarmStatus, 'alarmStatus', changeAlarmStatus);
	};

	/*根据页面id打开页面*/
	openPanel = function (menuId, menuName, isInit,callback) {
		jqueryMap.$mainPanelCloseBtn.css('visibility','visible');

		//如果选择菜单等于当前页面,返回不做处理
		if (stateMap.menuId === menuId){
			if(callback)  callback();
			return;
		}

		//保存当前页面 并在db中更新
		var currPanel = jqueryMap.$mainPanelContent.find(">.cnc-panel");
	  if (currPanel.length) {
			currPanel.detach();
			//在Db中查找当前页面
			var currPanelDb = cnc.globalModel.panelDb.getClickPanel(stateMap.menuId);
			if (currPanelDb) {
				cnc.globalModel.panelDb.updateClickPanel(stateMap.menuId,currPanel);
			}
		}

		stateMap.menuId = menuId;

		//如果页面在click-panel-db中存在，从click-panel-db中获取页面,进行替换
		var hasOpenPanelDb =  cnc.globalModel.panelDb.getClickPanel(menuId);
		if (hasOpenPanelDb) {
			jqueryMap.$mainPanelContent.append(hasOpenPanelDb.content);
			setClickMenuColor(menuId);
			if(callback)  callback();
			return;
		}

		var menuPanelDb = cnc.globalModel.panelDb.getPanel(menuId);
		if (menuPanelDb) {
			menuPanelDb.panel.initModule(jqueryMap.$mainPanelContent);
			currPanel = jqueryMap.$mainPanelContent.find(">.cnc-panel");
			cnc.globalModel.panelDb.addClickPanel({
				name: stateMap.menuId,
				content: currPanel
			});
			var navMenuItemHtml = '<div class="notification" data-menuid="' + menuId + '"><div class="notification-title">'+menuName+'</div><div class="notification-icon fa fa-check"></div></div>';
		  var navMenuItem = $(navMenuItemHtml);
		  if(isInit){
	      jqueryMap.$clickMenuList.prepend(navMenuItem);
		  }else{
			  jqueryMap.$clickMenuList.append(navMenuItem);
		  }
		  setClickMenuColor(menuId);
		  setClickMenuNum();
		}
		if(callback)  callback();
	};

	//显示默认初如化页面
  setInitMenus = function (){
    var initMenusJson = [
		  {
		  	menuId: "portal",
				menuName: "首页"
			},
			{
				menuId: "customerTopo",
				menuName: "客户拓扑"
			}
    ];
    if(initMenusJson){
      for(var i = initMenusJson.length;i > 0;i--){
        var menuJson = initMenusJson[i-1];
        openPanel(menuJson.menuId,menuJson.menuName,true);
      }
    }
  };

	initBackToTop = function () {
		var $backToTop = $('<a>', {
			id: 'back-to-top',
			href: '#top'
		});
		var $icon = $('<i>', {
			class: 'fa fa-chevron-up'
		});

		$backToTop.appendTo('body');
		$icon.appendTo($backToTop);

		$backToTop.hide();

		$(window).scroll(function () {
			if ($(this).scrollTop() > 150) {
				$backToTop.fadeIn();
			} else {
				$backToTop.fadeOut();
			}
		});

		$backToTop.click(function (e) {
			e.preventDefault();
			$('body, html').animate({
				scrollTop: 0
			}, 600);
		});
	};

	setClickMenuNum = function(){
		jqueryMap.$clickMenuNum.text(''+cnc.globalModel.panelDb.getClickPanelNum());
	};

	setClickMenuColor = function(clickMenuId){
		jqueryMap.$clickMenuList.find('.notification.check').removeClass('check');
		jqueryMap.$clickMenuList.find('.notification').each(function() {
      var menuId = $(this).data('menuid');
			if(menuId === clickMenuId){
				$(this).addClass('check');
				return;
			}
    });
	};
	//--------------------- END DOM METHODS ----------------------


	//------------------- BEGIN EVENT HANDLERS -------------------

	/*菜单元素click事件处理*/
	clickMenuItem = function (event) {
		//获取最接近的<a/>
		var $aItem = $(event.target).closest('a');
		if (!$aItem || $aItem.length === 0) {
			return fasle;
		}
		var $parentUlItem = $aItem.closest('ul');

		//叶子菜单处理后直接返回
		if (!$aItem.hasClass('main-menu-parent')) {
			//装载页面
			var panelId = $aItem.data('panelid');
			if (panelId) {
				openPanel(panelId, $aItem.text(), false,openOrCloseMainMenu);
			}
			jqueryMap.$mainMenuNav.find("> .open > .main-submenu").each(function() {
        $(this).find("> .open > .main-submenu").each(function() {
          $(this).slideUp(200).parent().toggleClass('open');
        });
        $(this).slideUp(200).parent().toggleClass('open');
      });
			return false;
		}

		//展开的菜单点击关闭,关闭这个菜单及它的子菜单
		if ($aItem.parent().hasClass('open')) {
			$parentUlItem.find('.main-submenu').each(function () {
				$(this).slideUp(200);
			});
			$aItem.parent().toggleClass('open');
			return false;
		}

		if ($parentUlItem.hasClass('main-menu-nav')) {
			//第一级菜单,关闭已打开菜单
			$parentUlItem.find('> .open > .main-submenu').each(function () {
				$(this).find('> .open > .main-submenu').each(function () {
					$(this).slideUp(200).parent().toggleClass('open');
				});
				$(this).slideUp(200).parent().toggleClass('open');
			});
			jqueryMap.$mainMenuPanel.removeClass('open');
		} else if ($parentUlItem.parent().parent().hasClass('main-menu-nav')) {
			//如果是第二级菜单，关闭同一级的已打开菜单
			var $parent_parentUlItem = $parentUlItem.closest('ul');
			$parent_parentUlItem.find('> .open > .main-submenu').each(function () {
				$(this).slideUp(200).parent().toggleClass('open');
			});
		}

		var subMenuItem = $aItem.next().get(0);
		$(subMenuItem).slideDown(200).parent().toggleClass('open');

		return false;
	};

	/*打开或关闭菜单界面*/
	openOrCloseMainMenu = function () {
		jqueryMap.$menu_btn.toggleClass('click');
		if (stateMap.isMenuOpen) {
			if (!stateMap.isMenuOpen) return false;
			stateMap.isMenuOpen = false;
			jqueryMap.$mainMenuPanel.removeClass('open-all');
			return false;
		} else {
			if (stateMap.isMenuOpen) return false;
			stateMap.isMenuOpen = true;
			jqueryMap.$mainMenuPanel.addClass('open-all');
			return false;
		}
	};

	/*点击 X按钮　关闭页面*/
	closeMainPanel = function () {
		//从click-panel-db中删除
	  cnc.globalModel.panelDb.getPanel(stateMap.menuId).panel.closeModule();
	  cnc.globalModel.panelDb.removeClickPanel(stateMap.menuId);

		//从面板菜单中删除
		jqueryMap.$clickMenuList.find("> .notification").each(function () {
			var menuId = $(this).data("menuid");
			if (menuId === stateMap.menuId) {
				$(this).remove();
			}
		});
		jqueryMap.$mainPanelContent.empty();
		stateMap.menuId = "";

		//从click-panel-db中获取最后一个面板，显示
		var lastClickPanel = cnc.globalModel.panelDb.lastClickPanel();
		if (lastClickPanel) {
			stateMap.menuId = lastClickPanel.name;
			jqueryMap.$mainPanelContent.append(lastClickPanel.content);
		} else {
			jqueryMap.$mainPanelCloseBtn.css('visibility','hidden');
		}
		setClickMenuNum();
		return false;
	};

	/*系统菜单下拉面板选择*/
  clickNavBarMenu = function (event){
    var $item = $(event.target).closest('.notification');
    var menuId = $item.data('menuid');
    openPanel(menuId);
		//这里不能stopPropagation,bootstrap获取不到事件
  };

	/*改变业务故障消息接收状态图标*/
	changeFaultStatus = function(event,state){
		if(state){
			jqueryMap.$faultStatus.removeClass('fa-times');
			jqueryMap.$faultStatus.addClass('fa-level-down');
			jqueryMap.$faultContainer.removeClass('nav-icon-btn-danger');
			jqueryMap.$faultContainer.addClass('nav-icon-btn-success');
		}else{
			jqueryMap.$faultStatus.removeClass('fa-level-down');
			jqueryMap.$faultStatus.addClass('fa-times');
			jqueryMap.$faultContainer.removeClass('nav-icon-btn-success');
			jqueryMap.$faultContainer.addClass('nav-icon-btn-danger');
		}
	};

	openFaultPanel = function(event){
	  openPanel('fault','故障');
	};

	faultReceive = function(fault){
        var meCreateTime = new Date();
        meCreateTime.setTime(fault.meCreateTime);
		var $notification = $('<div class="notification"></div>');
		var $title = $('<div class="notification-title text-danger"></div>')
		  .text(fault.no);
		var $description = $('<div class="notification-description"></div>')
		  .text(fault.customerGroupInfo);
		var $ago = $('<div class="notification-ago"></div>')
		  .text(meCreateTime.Format("yyyy-MM-dd hh:mm:ss"));
		var $icon = $('<div class="notification-icon fa fa-lightbulb-o bg-info"></div>');
		if(fault.operation === 'NEW')
			$icon.addClass('bg-danger');
		else if (fault.state === 'UPDATE')
			$icon.addClass('bg-info');
	    $notification.append($title);
		$notification.append($description);
		$notification.append($ago);
		$notification.append($icon);

		var $list = jqueryMap.$faultList.find('.notification');
		if($list.length>3){
			$list.first().remove();
		}
		jqueryMap.$faultList.append($notification);
	};

	/*改变告警消息接收状态图标*/
	changeAlarmStatus = function(event,state){
		if(state){
			jqueryMap.$alarmStatus.removeClass('fa-times');
			jqueryMap.$alarmStatus.addClass('fa-level-down');
			jqueryMap.$alarmContainer.removeClass('nav-icon-btn-danger');
			jqueryMap.$alarmContainer.addClass('nav-icon-btn-success');
		}else{
			jqueryMap.$alarmStatus.removeClass('fa-level-down');
			jqueryMap.$alarmStatus.addClass('fa-times');
			jqueryMap.$alarmContainer.removeClass('nav-icon-btn-success');
			jqueryMap.$alarmContainer.addClass('nav-icon-btn-danger');
		}
	};

	logOut = function(){
		cnc.modelSecurity.logOut();
        jqueryMap.$logout.attr( "href","/");
	};
	//-------------------- END EVENT HANDLERS --------------------


	//------------------- BEGIN PUBLIC METHODS -------------------
	initModule = function ($container) {
		stateMap.$container = $container;
		$.gevent.subscribe(stateMap.$container, 'system-init-success', initShell);
	};
	return {
		initModule: initModule
	};
	//------------------- END PUBLIC METHODS ---------------------
}());