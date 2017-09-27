angular.module('jptp')

.controller('ViewCtrl',["$scope","$rootScope","$log","$timeout","$ionicPopover","$ionicModal","$ionicLoading","amMoment",
    "$location", "$stateParams", "$state", "$ionicHistory", "GoodsService", "UserService", "CommentService", "$sce",
    function ($scope, $rootScope, $log, $timeout,
    $ionicPopover, $ionicModal, $ionicLoading,amMoment,
    $location, $stateParams, $state,   $ionicHistory,
    GoodsService, UserService, CommentService, $sce) {

    $scope.finished = false;

    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.hideTabs = 'tabs-item-hide';
    });   

    user = UserService.getCurrentUser();
    if (user == null || !user.loginId) {
        $state.go('tab.login');
        return;
    }

    var id = $stateParams.id;

    amMoment.changeLocale('zh-cn');

    GoodsService.get(id, user.userId, user.institutionId).$promise.then(function (r) {
        
        $scope.goods = r;
        if (r.goods) {
            CommentService.fetchTopGoodsComment(id);
            $scope.isSelfGoods = user.institutionId == r.goods.institutionId;
            $scope.finished = true;
        }
    });

    GoodsService.getLikeGoods(id).$promise.then(function (r) {           
        $scope.likeGoods = r;
    });

    $scope.loadMore = function () {
        CommentService.increaseGoodsComment(id);
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $scope.moreDataCanBeLoaded = function () {
        return CommentService.hasNextPage();
    };

    $scope.$on('jptp.goodsCommentUpdated', function () {
        $scope.goosComments = CommentService.getGoodsComment();
        $scope.$broadcast('scroll.refreshComplete');
    });

    $scope.getTypeObjects = function (type) {
        var objects = goods.goodsObjects;
        var results = [];
        if (objects) {
            for (var i = 0; i < objects.length; i++) {
                if (objects[i].contentType == type) {
                    results.push(objects[i]);
                }
            }
        }
        return results;
    };

    $scope.favorite = function () {
        if ($scope.goods.goods && user.institutionId != $scope.goods.institutionId) {
            UserService.addFavorite($scope.goods.goods.id, $scope.goods.goods.name).$promise.then(function (r) {
                $scope.goods.isFavorite = true;
                $scope.goods.goods.favoriteNumber = $scope.goods.goods.favoriteNumber + 1;
                $ionicLoading.show({ template: '收藏成功', duration: 500 });
            });
        }
    };

    $scope.addToCart = function () {
        if ($scope.goods.goods && user.institutionId != $scope.goods.institutionId) {
            UserService.addToCart($scope.goods.goods.id, $scope.goods.goods.name).$promise.then(function (r) {
                $ionicLoading.show({ template: '已添加到购物车', duration: 500 });
            });
        }
    };

    $scope.sendMessage = function (msg) {
        if (!msg) {
            return;
        }
        CommentService.add($scope.goods.goods.id, msg, user.loginId, user.institutionId).$promise.then(function (r) {            
            $ionicLoading.show({ template: '留言已发出', duration: 500 });           
            CommentService.fetchTopGoodsComment($scope.goods.goods.id);
        });        
    };

    $scope.playerType = ionic.Platform.isAndroid() ? 1 : 0;

    //对于android来说，video加载后并不会自动播放且没有播放按钮，所以需要自己提供一个播放按钮
    $scope.showModal = function (fileUrl) {
        //$scope.modal = $ionicModal.fromTemplateUrl(templateUrl,{
        //    scope: $scope,
        //    animation: 'slide-in-up'
        //});
        //.then(function (modal) {
        //    $scope.modal = modal;
        //    $scope.modal.show();
        //});

        //$scope.modal = $ionicModal.fromTemplate("<div class='modal transparent fullscreen-player' style='z-index:0' ng-click='closeModal()'><iframe  x-webkit-airplay='allow' onunload='alert()'  src='" + fileUrl + "' class='centerme' allowfullscreen frameborder=0></iframe></div>", {
        $scope.modal = $ionicModal.fromTemplate("<div class='modal transparent fullscreen-player' ng-click='closeModal()'><video  x-webkit-airplay='allow'  src='" + fileUrl + "' class='centerme' controls='controls' autoplay ></video></div>", {
            scope: $scope,
            animation: 'slide-in-up'
        });
        $scope.modal.show();
        
    }
   
    $scope.closeModal = function () {
        $scope.modal.hide();
        $scope.modal.remove()
    };
    
    $scope.trustSrc = function (src) {
        return $sce.trustAsResourceUrl(src);
    };

    $scope.playVideo = function ($event) {

        var filePath = $scope.getFileUrl();
        if (!filePath) {
            if( $scope.goods.goods.type==0){
                $ionicLoading.show({ template: '找不到文件', duration: 500 });
            }
            return;
        }

        $scope.showModal(filePath);
    };

    $scope.playFile = function (fileName) {
        var fileUrl = $scope.getClipUrl(fileName);
        if (!fileUrl) {
            return;
        }        
        $scope.showModal($scope.trustSrc(fileUrl));
    };

    //附件是否可播文件，是则播放
    $scope.getClipUrl = function (fileName) {

        if (!fileName || fileName.lastIndexOf(".mp4") < 0) {
            return null;
        }

        var filePath = $rootScope.getConfig('ptp_file_url');
        return filePath + fileName;
    };

    //寻找商品中的视频
    $scope.getFileUrl = function () {       
        var objLength = $scope.goods.goodsObjects.length;
        var fileName;
        for (var i = 0; i < objLength; i++) {
            var file = $scope.goods.goodsObjects[i].destFileName;
            if (file && file.lastIndexOf(".mp4") > 0) {
                fileName = file;
                break;
            }
        }

        if (!fileName) {
            return null;
        }

        var filePath = $rootScope.getConfig('ptp_file_url');
        return filePath + fileName;
    };

    $scope.getBaiduUrl = function (url) {
        if (!url) {
            return "#";
        }
        return "lib/baidut5player/video.html?url=" + url;
    };
}])
.controller('VideoCtrl', ["$scope", "$rootScope", "$log", "$timeout", "$stateParams", "$state", "GoodsService", "UserService",
    function ($scope, $rootScope, $log, $timeout,
    $stateParams, $state,GoodsService, UserService) {

    $scope.finished = false;


    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    $scope.$on('$ionicView.afterEnter', function () {
        document.addEventListener("deviceready", function () {
        }, false);       
    });

    user = UserService.getCurrentUser();
    if (user == null || !user.loginId) {
        $state.go('tab.login');
        return;
    }
    $scope.fileUrl = $stateParams.url;
}]);