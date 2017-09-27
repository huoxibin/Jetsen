angular.module('jptp')
/**
×¨¹ñ
*/
.controller('ShopsCtrl', ["$scope","$rootScope","$timeout","$location","$state","ShopService",
    function ($scope, $rootScope,$timeout,$location, $state,ShopService) {

    $scope.$on('$ionicView.beforeEnter', function () {           
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    $scope.$on('jptp.shopsUpdated', function () {
        // $timeout(function() {
        $scope.shops = ShopService.getShops();
        $scope.$broadcast('scroll.refreshComplete');
        // }, 100);
    });

    ShopService.getShopList();
}])
.controller('ShopCtrl',["$scope","$rootScope","$timeout","$state","$stateParams","$ionicNavBarDelegate","ShopService", 
    function ($scope, $rootScope, $timeout,   
    $state,$stateParams,$ionicNavBarDelegate,
    ShopService) {

    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    $scope.$on('$ionicView.afterEnter', function () {

        document.addEventListener("deviceready", function () {
        }, false);

        $timeout(function () {
            $ionicNavBarDelegate.showBar(true);
            $ionicNavBarDelegate.title($scope.shop.shopInfo?$scope.shop.shopInfo.name:"");
        }, 100);
    });

    var id = $stateParams.id;
    $scope.currentColumnId = "";
    var loadData = function (reload) {
        ShopService.get(id, reload).$promise.then(function (r) {

            $scope.shop = r;

            if ($scope.shop && $scope.shop.shopInfo) {
                $scope.shop.shopInfo.shopCode = id;                
            }

            if ($scope.shop && $scope.shop.pageColumns && $scope.shop.pageColumns.length > 0 && $scope.shop.pageColumns[0].column) {
                $scope.currentColumnId = $scope.shop.pageColumns[0].column.id;
            }
            $scope.$broadcast('scroll.refreshComplete');
            $scope.finished = true;
        });
    };

    $scope.changeColumn = function (id) {
        $scope.currentColumnId = id;
    };

    $scope.doRefresh = function () {
        loadData(id,true);
    };

    loadData(id);
}]);
