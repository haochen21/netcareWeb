angular.module('netcareApp',['ngResource','ngRoute','uiNavMenu',
    'uiCheckbox','ngFootable', 'ngFootablePagination','ngHighchart','ui.select'])
    .config(function (socketServiceProvider) {
        socketServiceProvider.init();
    });