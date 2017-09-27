angular.module('jptp')

.controller('SearchCtrl', ["$scope", "$rootScope", "$log", "$timeout", "$ionicLoading", "$state", "GoodsService", "Storage",
    function ($scope, $rootScope, $log, $timeout,
    $ionicLoading,$state,GoodsService,Storage) {

    var searchHistoryKey = "search-history";
    //Storage.set(searchHistoryKey, []);
    var searchHistorys = Storage.get(searchHistoryKey) || [];
    $scope.loadMoreFlag = false;

    $scope.$on('$ionicView.beforeEnter', function () {         
        $rootScope.hideTabs = '';
    });

    $scope.$on('$ionicView.afterEnter', function () {
        document.addEventListener("deviceready", function () {            
        }, false);
        $timeout(function () {
            $scope.loadMoreFlag = true;
        }, 2000);
    });

    $scope.loadMore = function () {
      
        if ($scope.loadMoreFlag) {
            GoodsService.increaseGoods();
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');

        $scope.loadMoreFlag = false;
        $timeout(function () {
            $scope.loadMoreFlag = true;
        }, 2000);
    };

    $scope.moreDataCanBeLoaded = function () {       
        return GoodsService.hasNextPage();
    };

    $scope.goodsList = {};
    $scope.searchHistorys = searchHistorys;
    
    $scope.$on('jptp.goodsUpdated', function () {       
        $scope.goodsList = GoodsService.getGoods();
        $scope.$broadcast('scroll.refreshComplete');
    });

    $scope.doRefresh = function (query) {
        GoodsService.fetchTopGoods(query);
    };

    $scope.search = function (key) {
        
        if (key && key.length > 0) {
            $scope.query = key;
            var hasItem = false;
            for (var i = 0; i < searchHistorys.length; i++) {
                if (searchHistorys[i].keywords == key) {
                    hasItem = true;
                }
            }
            if (!hasItem) {
                var length = searchHistorys.unshift({ keywords: key });
                if (length > 10) {
                    searchHistorys.pop();
                }
            }
        }
        Storage.set(searchHistoryKey, searchHistorys);
        $scope.searchHistorys = searchHistorys;
        GoodsService.fetchTopGoods(key);
    };

    $scope.claerHistory = function () {
        searchHistorys = [];
        $scope.searchHistorys = [];
        Storage.set(searchHistoryKey, []);
        $scope.query = '';
    };
}]);
