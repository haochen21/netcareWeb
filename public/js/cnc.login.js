cnc.login = (function () {
	var
		configMap = {
			main_html: String()
			  +'<div class="panel panel-primary fadeInUp animation-delay2 cnc-login-container">'
			    +'<div class="panel-heading text-center">客户网管系统</div>'
			    +'<div class="panel-body">'
			      +'<image class="cnc-login-img bounceIn animation-delay2" src="img/photo.png">'
			      +'<form role="form">'
			        +'<div class="form-group bounceIn animation-delay4 loginName">'
                +'<label for="cns-login-name" class="sr-only">用户名</label>'
                +'<div class="input-group">'
			            +'<div class="input-group-addon"><i class="fa fa-user fa-fw"></i></div>'
			            +'<input type="text" class="form-control" id="cns-login-name" placeholder="用户名">'			          
			          +'</div>'
			          +'<p class="help-block hidden cnc-login-errorMsg"></p>'
			        +'</div>'
			        +'<div class="form-group bounceIn animation-delay4 password">'
                +'<label for="cns-login-password" class="sr-only">密码</label>'
                +'<div class="input-group">'
			            +'<div class="input-group-addon"><i class="fa fa-key fa-fw"></i></div>'
			            +'<input type="password" class="form-control" id="cns-login-password" placeholder="密   码">'			          
			          +'</div>'	
			          +'<p class="help-block hidden cnc-login-errorMsg">密码不正确</p>'
			        +'</div>'			        
			        +'<button type="submit" data-loading-text="登录中..." class="btn btn-primary btn-block bounceIn animation-delay6">'
                  +'登&nbsp;&nbsp;&nbsp;录'
              +'</button>'	
              +'<label class="cnc-login-remember bounceIn animation-delay6">'
                + '<input id="cns-login-check" type="checkbox" value="yes" checked="checked">'
                + '<span class="custom-checkbox padding-6"></span>在这台电脑免登录'
              +'</label>'                
  		      +'</form>'
			    +'</div>' 
			    +'<div class="panel-footer hidden text-center bounceIn animation-delay10">'
			      +'<a href="" class="btn btn-link">使用其它帐户登录</a>' 
			    +'</div>'
			  +'</div>'			   
		},
		stateMap = {
			$container: null
		},
		jqueryMap = {},
		tasks = [],
		completedTasks = 0,	
		setJqueryMap,initModule,login,loginNameError,passwordError,
		checkIfComplete,getGlobalModel;

	//--------------------- BEGIN DOM METHODS --------------------
	setJqueryMap = function () {
		var $container = stateMap.$container;
		var $loginPanel = $container.find('.cnc-login-container');
		jqueryMap = {
			$container: $container,
			$loginPanel:$loginPanel,
			$loginImg: $loginPanel.find('.cnc-login-img'),
			$panelBody: $loginPanel.find('.panel-body'),
			$form: $loginPanel.find('form'),
			$loginName: $loginPanel.find('#cns-login-name'),
			$loginNameError: $loginPanel.find('.loginName .cnc-login-errorMsg'),
			$password: $loginPanel.find('#cns-login-password'),
			$passwordError: $loginPanel.find('.password .cnc-login-errorMsg'),
			$persistent: $loginPanel.find('#cns-login-check'),
			$submit: $loginPanel.find('button[type="submit"]'),
			$panelFooter: $loginPanel.find('.panel-footer')
		};
	};
	//--------------------- END DOM METHODS ----------------------


	//------------------- BEGIN EVENT HANDLERS -------------------
	login = function () {
		var loginName = jqueryMap.$loginName.val();
		var password = jqueryMap.$password.val();
		jqueryMap.$loginNameError.addClass('hidden');
		jqueryMap.$passwordError.addClass('hidden');
		jqueryMap.$panelFooter.addClass('hidden');
		var persistent = false;
		if (jqueryMap.$persistent.is(':checked') === true) {
			persistent = true;
		}
		var loginData = {
			"loginName": loginName,
			"password": password,
			"persistent": persistent,
			"submit": jqueryMap.$submit
		}
		cnc.modelSecurity.login(loginData);
		return false;
	};

	loginNameError = function (event, data) {
		var name = jqueryMap.$loginName.val();
		jqueryMap.$loginName.val('');
		jqueryMap.$loginNameError.text(name + ' 用户名不存在');
		jqueryMap.$loginNameError.removeClass('hidden');
		return false;
	};

	passwordError = function (event) {
		jqueryMap.$password.val('');
		jqueryMap.$passwordError.removeClass('hidden');
	}
	
	checkIfComplete = function () {
		completedTasks++;
		if (completedTasks == tasks.length) {
			console.log("checkIfComplete.....");
			jqueryMap.$panelBody.empty();
			jqueryMap.$panelBody.append(jqueryMap.$loginImg);
			jqueryMap.$panelBody.append(jqueryMap.$form);
			$.gevent.publish('system-init-success', "");
		}
	};

	getGlobalModel = function (event,data) {
		completedTasks = 0;
		jqueryMap.$form.detach();
		
		var ball_html =  String()      
      +'<div id="followingBallsG">'
        +'<div id="followingBallsG_1" class="followingBallsG"></div>'
        +'<div id="followingBallsG_2" class="followingBallsG"></div>'
        +'<div id="followingBallsG_3" class="followingBallsG"></div>'
        +'<div id="followingBallsG_4" class="followingBallsG"></div>'
      +'</div>';
		jqueryMap.$panelBody.append($(ball_html));
		
		var permissionNoty = jqueryMap.$panelBody.noty({
			text: '正在获取权限数据!',
			layout: "center",
			type: "information"
		});
		tasks.push({notyId:permissionNoty,task:cnc.modelSecurity.getPermissions});
		
		var customerGroupNoty = jqueryMap.$panelBody.noty({
			text: '正在获取客户数据!',
			layout: "center",
			type: "information"
		});
		tasks.push({notyId:customerGroupNoty,task:cnc.modelSecurity.getCustomerGroups});
		
		var systemMenuNoty = jqueryMap.$panelBody.noty({
			text: '正在获取菜单数据!',
			layout: "center",
			type: "information"
		});
		tasks.push({notyId:systemMenuNoty,task:cnc.modelSecurity.getSystemMenus});
    
		
		for (var task in tasks) {
			var notyId = tasks[task].notyId;
			tasks[task].task(notyId,checkIfComplete);
		}
	};
	//-------------------- END EVENT HANDLERS --------------------


	//------------------- BEGIN PUBLIC METHODS -------------------
	initModule = function ($container) {
		stateMap.$container = $container;
		$container.html(configMap.main_html);
		setJqueryMap();

		if(cnc.globalModel.operator.loginName){
			jqueryMap.$loginName.val(cnc.globalModel.operator.loginName);
		}	
		if (cnc.globalModel.operator.persistent) {			
			jqueryMap.$password.val(cnc.globalModel.operator.password);
			var loginData = {
			  "loginName": cnc.globalModel.operator.loginName,
			  "password": cnc.globalModel.operator.password,
			  "persistent": cnc.globalModel.operator.persistent,
			  "submit": jqueryMap.$submit
			}
			cnc.modelSecurity.login(loginData);
		}
		
		jqueryMap.$form.bind('submit', login);
		$.gevent.subscribe(jqueryMap.$loginNameError, 'login-fail-nameError', loginNameError);
		$.gevent.subscribe(jqueryMap.$passwordError, 'login-fail-passwordError', passwordError);
		$.gevent.subscribe(jqueryMap.$panelBody, 'login-success', getGlobalModel);
	};
	return {
		initModule: initModule
	};
	//------------------- END PUBLIC METHODS ---------------------
}());