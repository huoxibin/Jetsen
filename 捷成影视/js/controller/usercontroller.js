angular.module('jptp')

.controller('LoginCtrl',["$scope","$state","$rootScope","$timeout","$stateParams","$ionicHistory","$ionicPopup","UserService", 
    function ($scope, $state, $rootScope, $timeout,$stateParams,
    $ionicHistory, $ionicPopup, UserService) {

    $scope.$on('$ionicView.beforeEnter', function () {
        //$cordovaClipboard
        $rootScope.hideTabs = '';
    });
    
    var wxCode = $stateParams.code;

    if (wxCode && wxCode.length > 0) {
        UserService.wxlogin(wxCode, null, null).$promise.then(function (response) {
            if (response && response.loginId) {
                $state.go("tab.index");
            }
            else {
                $scope.appCode = response;
            }
        });
    }

    $scope.login = function (user) {
        if (user == null || user.username == "") {
            $ionicPopup.alert({
                template: '请输入帐号！',
                okText: '确定'
            });
            return;
        }
        if (user.password==null || user.password == "") {
            $ionicPopup.alert({
                template: '请输入密码！',
                okText: '确定'
            });
            return;
        }

        if ($scope.appCode && $scope.appCode.length > 0) {
            UserService.wxlogin($scope.appCode,user.username, user.password).$promise.then(function (response) {
                if (!response.result) {
                    $ionicPopup.alert({
                        template: response.msg,
                        okText: '确定'
                    });
                }
                else {
                    user.password = "";
                    $ionicHistory.clearHistory();
                    $state.go("tab.index");
                }
            });
        } else {
            UserService.login(user.username, user.password).$promise.then(function (response) {
                if (!response.result) {
                    $ionicPopup.alert({
                        template: response.msg,
                        okText: '确定'
                    });
                }
                else {
                    user.password = "";
                    $ionicHistory.clearHistory();
                    $state.go("tab.index");
                }
            });
        }
    };
}])
.controller('UserCtrl',["$scope","$rootScope","$state","UserService", function ($scope,$rootScope,$state,UserService) {

    $scope.$on('$ionicView.beforeEnter', function () {      
        $rootScope.hideTabs = '';
    });

    
    user = UserService.getCurrentUser();
    if (user == null || !user.loginId) {
        $state.go('tab.login');
        return;
    }

    $scope.userName = user.userName;
    $scope.loginId = user.loginId;
    $scope.isSale = user.userType != 0 && (user.institutionType == 0 || user.institutionType == 2);

    UserService.getHistory().$promise.then(function (response) {
        $scope.historys = response;
    });
}])
.controller('UserInfoCtrl', ["$scope", "$state", "$rootScope", "$timeout", "$ionicPopup", "$log", "UserService",
    function ($scope, $state, $rootScope, $timeout,
    $ionicPopup, $log, UserService) {

    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    $scope.$on('$ionicView.afterEnter', function () {
        document.addEventListener("deviceready", function () {
        }, false);
    });

    $scope.$on('$ionicView.beforeLeave', function () {
    });

    $scope.user = UserService.getCurrentUser();


    if ($scope.user.userType == 0) {
        $scope.userTypeName = "管理帐户";
    } else if ($scope.user.userType == 1) {
        if ($scope.user.institutionType == 0) {
            $scope.userTypeName = "机构卖家";
        } else {
            $scope.userTypeName = "机构买家";
        }
    }
    else if ($scope.user.userType == 2) {
        if ($scope.user.institutionType == 0) {
            $scope.userTypeName = "机构卖家";
        } else {
            $scope.userTypeName = "机构买家";
        }
    }

    $scope.logout = function (user) {
        UserService.logout().$promise.then(function (response) {
            $state.go("tab.index");
        });
    };
}])
.controller('SettingCtrl',["$scope","$rootScope","$state","$ionicPopover","UserService","ENV",
    function ($scope,$rootScope,
    $state, $ionicPopover, UserService, ENV) {

    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.hideTabs = 'tabs-item-hide';
    });
      
    $scope.currentVersion = ENV.version;

    $ionicPopover.fromTemplateUrl('views/popover/exitpopover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    })

    $scope.showExitPop = function ($event) {
        $scope.popover.show($event);        
    }

    $scope.logout = function () {
        $scope.popover.hide();
        UserService.logout().$promise.then(function (response) {
            $state.go("tab.index");
        });
    };

    $scope.hasExit = ionic.Platform.isAndroid() && navigator.app;

    $scope.exitApp = function () {
        $scope.popover.hide();
        ionic.Platform.exitApp();        
    };
}])
.controller('FavoriteCtrl',["$scope","$rootScope","$timeout","$ionicLoading","$ionicPopup","$ionicPopover","$log","UserService", 
    function ($scope, $rootScope, $timeout,
    $ionicLoading, $ionicPopup, $ionicPopover, $log, UserService) {

    $scope.$on('$ionicView.beforeEnter', function () {      
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    user = UserService.getCurrentUser();
    if (user == null || !user.loginId) {
        $state.go('tab.login');
        return;
    }

    UserService.getFavorite().$promise.then(function (response) {
        $scope.favorite = response;
    });

    /**
    $ionicPopover.fromTemplateUrl('views/popover/deletepopover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    })
    $scope.showMenuPop = function ($event,deleteId) {
        $scope.popover.show($event);
    }*/

    $scope.deleteConfirm = function (id) {
        
        var confirmPopup = $ionicPopup.confirm({
            title: '',
            template: '确定删除?',
            okText: '确定',
            cancelText: '取消'
        });
        confirmPopup.then(function (res) {
            if (res) {
                UserService.deleteFavorite(id).$promise.then(function (response) {
                    $ionicLoading.show({ template: '已删除', duration: 500 });
                    UserService.getFavorite().$promise.then(function (response) {
                        $scope.favorite = response;
                    });
                });
            } else {
            }
        });
    };
}])
.controller('HistoryCtrl',["$scope","$state","$rootScope","$timeout","$log","UserService", 
    function ($scope, $state, $rootScope, $timeout,
    $log, UserService) {

    $scope.$on('$ionicView.beforeEnter', function () {       
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    user = UserService.getCurrentUser();
    if (user == null || !user.loginId) {
        $state.go('tab.login');
        return;
    }

    UserService.getHistory().$promise.then(function (response) {
        $scope.historys = response;
    });
}])
.controller('CartCtrl',["$scope","$state","$rootScope","$timeout","$stateParams","$ionicLoading","$ionicPopup","$log","UserService",
    function ($scope, $state, $rootScope, $timeout,
    $stateParams,$ionicLoading, $ionicPopup, $log, UserService) {

    $scope.$on('$ionicView.beforeEnter', function () {      
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    user = UserService.getCurrentUser();
    if (user == null || !user.loginId) {
        $state.go('tab.login');
        return;
    }

    UserService.getCart().$promise.then(function (response) {
        $scope.cart = response;
    });
   
    $scope.deleteConfirm = function (id) {

        var confirmPopup = $ionicPopup.confirm({
            title: '',
            template: '确定删除?',
            okText: '确定',
            cancelText: '取消'
        });
        confirmPopup.then(function (res) {
            if (res) {
                UserService.deleteCart(id).$promise.then(function (response) {
                    $ionicLoading.show({ template: '已删除', duration: 500 });
                    UserService.getCart().$promise.then(function (response) {
                        $scope.cart = response;
                    });
                });
            } else {
            }
        });
    };

    $scope.deleteGoods = function(){
        var checkIds = [];
        var length = $scope.cart.items.length;
        for (var i = 0; i < length; i++) {
            var item = $scope.cart.items[i];
            if (item.checked) {
                checkIds.push(item.id);
            }
        }

        if (checkIds.length > 0) {
            var deletedCount = 0;
            for (var i = 0; i < checkIds.length; i++) {
                UserService.deleteCart(checkIds[i]).$promise.then(function (response) {                    
                    deletedCount++;
                    if (deletedCount == checkIds.length) {
                        $ionicLoading.show({ template: '已删除', duration: 500 });
                        UserService.getCart().$promise.then(function (response) {
                            $scope.cart = response;
                        });
                    }
                });
            }
            
        } else {
            $ionicLoading.show({ template: '请选择', duration: 500 });
        }
    };

    $scope.toOrder = function () {
        var checkIds = [];
        var length = $scope.cart.items.length;
        for (var i = 0; i < length; i++) {
            var item = $scope.cart.items[i];
            if (item.checked) {
                checkIds.push(item.id);
            }
        }

        if (checkIds.length > 0) {
            UserService.toOrder(checkIds.join(",")).$promise.then(function (response) {
                $state.go('tab.user-orders');
            });
        } else {
            $ionicLoading.show({ template: '请选择', duration: 500 });
        }
    };

    $scope.checkAll = function () {
        var length = $scope.cart.items.length;
        for (var i = 0; i < length; i++) {
            var item = $scope.cart.items[i];           
            item.checked = $scope.isCheckAll;
        }
    };
    $scope.checkChanged = function () {      
        var length = $scope.cart.items.length;
        var hasNoChecked = false;
        for (var i = 0; i < length; i++) {
            var item = $scope.cart.items[i];
            if (!item.checked) {
                hasNoChecked = true;
                break;
            }
        }

        $scope.isCheckAll = !hasNoChecked;
    };
}])
.controller('OrdersCtrl',["$scope","$state","$rootScope","$timeout","$ionicNavBarDelegate","$stateParams","$log","UserService","OrderService",
    function ($scope, $state, $rootScope, $timeout,
    $ionicNavBarDelegate, $stateParams, $log, UserService, OrderService) {

    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    $scope.$on('$ionicView.afterEnter', function () {
        document.addEventListener("deviceready", function () {
        }, false);

        $timeout(function () {
            $ionicNavBarDelegate.title($scope.isSale ? "订单管理" : "我的订单");
        }, 100);

        $timeout(function () {
            $scope.loadMoreFlag = true;
        }, 2000);
    });

    $scope.loadMoreFlag = false;
    $scope.orders = {};
    
    user = UserService.getCurrentUser();
    if (user == null || !user.loginId) {
        $state.go('tab.login');
        return;
    }

    $scope.currentStatus = -1;
    $scope.isSale = $stateParams.isSale=="1";

    if ($scope.isSale) {        

        $scope.loginId = user.loginId;
        $scope.saleName = user.userName;

        $scope.orderStatus = [
            { name: "全部", value: -1 },
            { name: "待确认", value: 2 },
            { name: "待发货", value: 5 },
            { name: "待结束", value: 7 },
            { name: "已完成", value: 8 }
        ];
    } else {
        $scope.orderStatus = [
                { name: "全部", value: -1 },
                { name: "待审核", value: 0 },
                { name: "待付款", value: 4 },
                { name: "待付尾款", value: 6 },
                { name: "已完成", value: 8 }
        ];        
    }

     $scope.loadMore = function () {        
         if ($scope.orders && $scope.orders.items.length > 0 && $scope.loadMoreFlag) {
             OrderService.increaseOrders();
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');

        $scope.loadMoreFlag = false;
        $timeout(function () {
            $scope.loadMoreFlag = true;
        }, 2000);
     };

     $scope.$on('jptp.ordersUpdated', function () {
         $scope.orders = OrderService.getOrders();
         $scope.$broadcast('scroll.refreshComplete');
     });

    $scope.moreDataCanBeLoaded = function () {
        return OrderService.hasNextPage();
    };

    $scope.doRefresh = function () {
        OrderService.fetchTopOrders($scope.currentStatus, $scope.isSale);
    };

    $scope.changeStatus = function (state) {
        $scope.currentStatus = state;
        $scope.doRefresh();
    };

    $scope.doRefresh();
}])
.controller('OrderCtrl',["$scope","$state","$rootScope","$timeout","$stateParams","$log","UserService","OrderService", 
    function ($scope, $state, $rootScope, $timeout,
    $stateParams,$log, UserService, OrderService) {

    $scope.$on('$ionicView.beforeEnter', function () {        
        $rootScope.hideTabs = 'tabs-item-hide';
    });  

    user = UserService.getCurrentUser();
    if (user == null || !user.loginId) {
        $state.go('tab.login');
        return;
    }

    $scope.institutionId = user.institutionId;

    var id = $stateParams.id;
    var isSaleParam = { "isSale": $stateParams.isSale };

    OrderService.get(id).$promise.then(function (response) {
        $scope.order = response;
    });

    $scope.commitOrder = function () {
        OrderService.commitOrder(id).$promise.then(function (response) {
            $state.go('tab.user-orders', isSaleParam);
        });
    };

    $scope.cancelOrder = function () {
        OrderService.cancelOrder(id).$promise.then(function (response) {
            $state.go('tab.user-orders', isSaleParam);
        });
    };

    $scope.confirmOrder = function () {
        OrderService.confirmOrder(id).$promise.then(function (response) {
            $state.go('tab.user-orders', isSaleParam);
        });
    };

    $scope.deliveryOrder = function () {
        OrderService.deliveryOrder(id).$promise.then(function (response) {
            $state.go('tab.user-orders', isSaleParam);
        });
    };

    $scope.finishOrder = function () {
        OrderService.finishOrder(id).$promise.then(function (response) {
            $state.go('tab.user-orders', isSaleParam);
        });
    };

    $scope.paydownOrder = function () {
        OrderService.paydownOrder(id).$promise.then(function (response) {
            $state.go('tab.user-orders', isSaleParam);
        });
    };

    $scope.payendOrder = function () {
        OrderService.payendOrder(id).$promise.then(function (response) {
            $state.go('tab.user-orders', isSaleParam);
        });
    };
}]);
