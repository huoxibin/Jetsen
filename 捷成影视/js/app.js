
angular.module('jptp', ['ionic', 'ngCordova', 'ngResource',
  'angularMoment','jptp.router', 'jptp.filters', 'jptp.directives',
  'jptp.config','jptp.pluginServices',
])

.run(["$ionicPlatform","$rootScope","$state","$ionicLoading","$log","$ionicHistory","$document","ENV","amMoment","ToastService","SplashscreenService","PublicService",
    function ($ionicPlatform, $rootScope, $state, $ionicLoading, $log, $ionicHistory,$document,ENV,
  amMoment, ToastService, SplashscreenService, PublicService) {

    $ionicPlatform.ready(function () {       
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        // 隐藏启动画面
        //SplashscreenService.hide();

        // set moment locale
        amMoment.changeLocale('zh-cn');
    });

    // 双击退出
    // document.addEventListener('backbutton'
    $ionicPlatform.registerBackButtonAction(function (e) {
        if ($state.includes('tab.index')) {
            if ($rootScope.backButtonPressedOnceToExit) {               
                ionic.Platform.exitApp();
            } else {
                $rootScope.backButtonPressedOnceToExit = true;
                $ionicLoading.show({ template: '再按一次退出系统', duration: 500 });
                setTimeout(function () {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
            }
        } else if ($state.includes('tab.user') || $state.includes('tab.search') || $state.includes('tab.class')) {
            $state.go('tab.index');
        }
        else if ($ionicHistory.backView()) {
            $rootScope.goback();
        }
        else if ($state.includes('tab.view')) {            
            history.go(-1);
        }
        else {
            if ($rootScope.backButtonPressedOnceToExit) {               
                ionic.Platform.exitApp();
            }
            $rootScope.backButtonPressedOnceToExit = true;

            setTimeout(function () {
                $rootScope.backButtonPressedOnceToExit = false;
            }, 501);
        }
        e.preventDefault();
        return false;
    }, 101);

    var errorMsg = {
        0: '网络出错啦，请再试一下',
        'wrong accessToken': '授权失败'
    };

    $rootScope.requestErrorHandler = function (options, callback) {
        return function (response) {
            var error;
            if (response.data && response.data.error_msg) {
                error = errorMsg[response.data.error_msg];
            } else {
                error = errorMsg[response.status] || 'Error: ' + response.status + ' ' + response.statusText;
            }
            var o = options || {};
            angular.extend(o, {
                template: error,
                duration: 1000
            });
            $ionicLoading.show(o);
            return callback && callback();
        };
    };

    $rootScope.goto = function (url, params) {
        $state.go(url, params);
    };

    $rootScope.goback = function () {       
        if ($ionicHistory.backView()) {
            var backViewName = $ionicHistory.backView().stateName;
            if (backViewName == "tab.view") {
                var currentViewName = $ionicHistory.currentView().stateName;
                if (currentViewName.indexOf("-") > 0) {
                    $state.go(currentViewName.split("-")[0]);
                }
                else {
                    $state.go('tab.index');
                }

            } else {
                $ionicHistory.goBack();
            }
        }
        else if ($state.includes('tab.view')) {
            history.go(-1);
        }
    };

    PublicService.getSysConfig("ptp_file_url");
    $rootScope.getConfig = PublicService.getConfig;

    $rootScope.$on('$ionicView.afterEnter', function (ev, data) {
        if (ENV.title) {
            $document[0].title = ENV.title;
        }
    });
}])
.config(['$ionicConfigProvider', '$sceDelegateProvider', function ($ionicConfigProvider, $sceDelegateProvider) {

    $ionicConfigProvider.tabs.style('standard');
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.backButton.icon('ion-ios-arrow-back');//'ion-ios-arrow-thin-left'
    //$ionicConfigProvider.views.transition('no');
    $ionicConfigProvider.views.swipeBackEnabled(false);
    //$sceDelegateProvider.resourceUrlWhitelist(['self', new RegExp('^(http[s]?):\/\/jptp\.oss\-cn\-beijing\.aliyuncs\.com/.+$')]);
}]);

