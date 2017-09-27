/**
 * 路由
 */
angular.module('jptp.router', [])
    .config(['$provide', '$stateProvider', '$urlRouterProvider', function ($provide, $stateProvider, $urlRouterProvider) {
        $stateProvider
          .state('tab', {
              url: "/tab",
              abstract: true,
              templateUrl: "views/tabs.html"
          })

        .state('tab.index', {
            url: '/index',
            views: {
                'tab-index': {
                    templateUrl: 'views/tab.index.html',
                    controller: 'IndexCtrl'
                }
            }
        })
        .state('tab.search', {
            url: '/search',
            views: {
                'tab-search': {
                    templateUrl: 'views/tab.search.html',
                    controller: 'SearchCtrl'
                }
            }
        })
        .state('tab.class', {
            url: '/class',
            views: {
                'tab-class': {
                    templateUrl: 'views/tab.class.html',
                    controller: 'ClassCtrl'
                }
            }
        })
        .state('tab.class-view', {
            url: '/classview/:id?name',
            views: {
                'tab-class': {
                    templateUrl: 'views/classview.html',
                    controller: 'ClassViewCtrl'
                }
            }
        })        
        .state('tab.view', {
            url: '/view/:id',
            views: {
                'tab-index': {
                    templateUrl: 'views/view.html',
                    controller: 'ViewCtrl'
                }
            }
            //,resolve: {
            //    validater: ['$state', function ($state) {
            //        $state.go('tab.login'); return false;
            //    }]
            //}
        })
        .state('tab.video', {
            url: '/video?url',
            views: {
                'tab-index': {
                    templateUrl: 'views/video.html',
                    controller: 'VideoCtrl'
                }
            }
        })
        .state('tab.shops', {
            url: '/shops',
            views: {
                'tab-index': {
                    templateUrl: 'views/shops.html',
                    controller: 'ShopsCtrl'
                }
            }
        })
        .state('tab.index-shop', {
            url: '/shop/:id',
            views: {
                'tab-index': {
                    templateUrl: 'views/shop.html',
                    controller: 'ShopCtrl'
                }
            }
        })
        .state('tab.login', {
            url: '/login?code',
            views: {
                'tab-user': {
                    templateUrl: 'views/login.html',
                    controller: 'LoginCtrl'
                }
            }
        })
        .state('tab.user-info', {
            url: '/info',
            views: {
                'tab-user': {
                    templateUrl: 'views/userinfo.html',
                    controller: 'UserInfoCtrl'
                }
            }
        })
        .state('tab.user', {
            url: '/user',
            views: {
                'tab-user': {
                    templateUrl: 'views/tab.user.html',
                    controller: 'UserCtrl'
                }
            }
        })
        .state('tab.user-favorite', {
            url: '/favorite',
            views: {
                'tab-user': {
                    templateUrl: 'views/favorite.html',
                    controller: 'FavoriteCtrl'
                }
            }
        })
        .state('tab.user-cart', {
            url: '/cart',
            views: {
                'tab-user': {
                    templateUrl: 'views/cart.html',
                    controller: 'CartCtrl'
                }
            }
        })
        .state('tab.user-history', {
            url: '/history',
            views: {
                'tab-user': {
                    templateUrl: 'views/history.html',
                    controller: 'HistoryCtrl'
                }
            }
        })
        .state('tab.user-orders', {
            url: '/orders?isSale',
            views: {
                'tab-user': {
                    templateUrl: 'views/orders.html',
                    controller: 'OrdersCtrl'
                }
            }
        })
        .state('tab.user-order', {
            url: '/order/:id?isSale',
            views: {
                'tab-user': {
                    templateUrl: 'views/order.html',
                    controller: 'OrderCtrl'
                }
            }
        })
        .state('tab.user-setting', {
            url: '/setting',
            views: {
                'tab-user': {
                    templateUrl: 'views/setting.html',
                    controller: 'SettingCtrl'
                }
            }
        })
        .state('tab.msglist', {
            url: '/msglist',
            views: {
                'tab-index': {
                    templateUrl: 'views/msglist.html',
                    controller: 'MessagesCtrl'
                }
            }
        })
        .state('tab.msgview', {
            url: '/msgview/:id',
            views: {
                'tab-index': {
                    templateUrl: 'views/msgview.html',
                    controller: 'MessageCtrl'
                }
            }
        });

        $urlRouterProvider.otherwise('/tab/index');
    }]);