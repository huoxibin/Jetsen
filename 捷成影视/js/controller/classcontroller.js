angular.module('jptp')
/**
分类页面控制
*/
.controller('ClassCtrl', ["$scope", "$rootScope", "$state","ClassService","PublicService",function ($scope, $rootScope, $state,
    ClassService,PublicService) {

    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.hideTabs = '';
    });

    $scope.$on('$ionicView.afterEnter', function () {
        //document.addEventListener("deviceready", function () {           
        //}, false);
    });

    ClassService.getClasses().$promise.then(function (r){
        $scope.classes = r;
    });

    $scope.getRightBorder = function (index) {
        return (index % 3 == 2 ? 0 : 1);
    }

    PublicService.getColumn("热门推荐").$promise.then(function (data) {
        $scope.pageColumn = data;
    });
}])
/**
分类详细页面控制
*/
.controller('ClassViewCtrl',["$scope","$rootScope","$timeout","$stateParams","$state","$ionicNavBarDelegate","ClassService","PublicService",
    function ($scope, $rootScope, $timeout,$stateParams,
    $state,$ionicNavBarDelegate,ClassService,PublicService) {

    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.hideTabs = 'tabs-item-hide';
        //$rootScope.shopBack = $ionicNavBarDelegate.showBackButton();
    });

    $scope.$on('$ionicView.afterEnter', function () {
        document.addEventListener("deviceready", function () {
        }, false);

        $timeout(function () {
            $ionicNavBarDelegate.showBar(true);            
            $ionicNavBarDelegate.title($stateParams.name);
        }, 100);

        $timeout(function () {
            $scope.loadMoreFlag = true;
        }, 2000);
    });

    var id = $stateParams.id;
    $scope.keywords = "";    
    $scope.origin = "";
    $scope.publishDate = "";
    $scope.label = "";   
    $scope.catalogue = id;
    $scope.loadMoreFlag = false;
    $scope.goodsList = [];

    $scope.doRefresh = function () {
        ClassService.fetchTopGoods($scope.keywords, $scope.catalogue, $scope.origin, $scope.publishDate, $scope.label);
    };

    $scope.searchDate = function (date) {
        $scope.publishDate = date;
        $scope.doRefresh();
    };

    $scope.searchOrigin = function (origin) {
        $scope.origin = origin;
        $scope.doRefresh();
    };

    $scope.searchLabel = function (label) {
        $scope.label = label;
        $scope.doRefresh();
    };

    $scope.loadMore = function () {        
        if ($scope.goodsList.length > 0 && $scope.loadMoreFlag) {
            ClassService.increaseGoods();
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');

        $scope.loadMoreFlag = false;
        $timeout(function () {
            $scope.loadMoreFlag = true;
        }, 2000);
    };

    $scope.moreDataCanBeLoaded = function () {
        return ClassService.hasNextPage();
    };

    $scope.$on('jptp.classgoodsUpdated', function () {        
        $scope.goodsList = ClassService.getGoods();
        $scope.$broadcast('scroll.refreshComplete');
    });

    PublicService.getProps("6,5").$promise.then(function () {
        $scope.publishDates = PublicService.getProp(6);
        $scope.origins = PublicService.getProp(5);
    });

    PublicService.getClasses(id).$promise.then(function (r) {
        $scope.classes = r;       
    });

    $scope.doRefresh();

    var halfHeight = null;
    $scope.getHalfHeight = function () {
        if (ionic.Platform.isAndroid()) return 0;
        if (!halfHeight) {
            halfHeight = (document.documentElement.clientHeight / 2) - 200;
        }
        return halfHeight;

    };
}]);
