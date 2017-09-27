angular.module('jptp')

 /**
 首页页面控制
 */
.controller('IndexCtrl',["$scope","$rootScope","$log","$timeout","$ionicHistory","$state","$ionicSlideBoxDelegate","IndexService","UserService", 
    function ($scope, $rootScope, $log, $timeout, $ionicHistory, $state, $ionicSlideBoxDelegate,
    IndexService,UserService) {   

    $scope.finished = false;

    $scope.$on('$ionicView.beforeEnter', function () {    
        $rootScope.hideTabs = '';
    });

    $scope.$on('$ionicView.afterEnter', function () {
        //document.addEventListener("deviceready", function () {           
        //}, false);
        $timeout(function () {
            //$ionicSlideBoxDelegate.update();
            //$ionicSlideBoxDelegate.shouldEnable = true;
        }, 2000);
    });

    IndexService.getData();

    $scope.$on('jptp.indexUpdated', function () {
        // $timeout(function() {
        $scope.classes = [{ id: "b5518ecc-72b4-4f52-83a1-78eb4096d551", name: "电影" },
        { id: "ec0dfbae-81bd-4496-9ba8-7ac6888641a0", name: "电视剧" },
        { id: "cfaaa967-6d74-4a3e-b086-e245462b7d35", name: "动漫" },
        { id: "e6e89c19-aa9f-4540-a2b9-6a490538ea57", name: "科教" },
        { id: "7fe01e21-850f-4d47-a254-5742b758050d", name: "其它" }]; //IndexService.getClasses();
        
        var posters = IndexService.getPosters();
        for (var i = 0; i < posters.length; i++) {
            if (posters[i].posterType == 0) {
                $scope.firstPoster = posters[i];
                break;
            }
        }

        $scope.posters = posters;
        $scope.messages = IndexService.getMessages();
        $scope.pageColumns = IndexService.getPageColumns();

        $scope.finished = true;

        $scope.$broadcast('scroll.refreshComplete');
        // }, 100);
    });
    
    var halfHeight = null;
    $scope.getHalfHeight = function () {
        if (ionic.Platform.isAndroid()) return 0;
        if (!halfHeight) {
            halfHeight = (document.documentElement.clientHeight / 2) - 200;
        }
        return halfHeight;
    };

    $scope.doRefresh = function () {
        IndexService.getData();
    };
}]);
