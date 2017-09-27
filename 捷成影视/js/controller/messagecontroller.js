angular.module('jptp')

 .controller('MessagesCtrl',["$scope","$rootScope","$timeout","amMoment","MessageService",
    function ($scope, $rootScope, $timeout, amMoment,MessageService) {
    
     $scope.$on('$ionicView.beforeEnter', function () {
         $rootScope.hideTabs = 'tabs-item-hide';
     });

     amMoment.changeLocale('zh-cn');

     $scope.currentType = MessageService.getCurrentType();
     
     $scope.changeType = function (type) {         
         MessageService.setCurrentType(type);
         $scope.currentType = MessageService.getCurrentType();
     };

     $scope.doRefresh = function () {
         MessageService.fetchTopMessages();
     };

     $scope.loadMore = function () {
         MessageService.increaseMessages();
         $scope.$broadcast('scroll.infiniteScrollComplete');
     };

     $scope.moreDataCanBeLoaded = function () {
         return MessageService.hasNextPage();
     };

     MessageService.fetchTopMessages();

     $scope.$on('jptp.messagesUpdated', function () {
         // $timeout(function() {
         $scope.messages = MessageService.getMessages();
         $scope.$broadcast('scroll.refreshComplete');
         // }, 100);
     });
 }])
  .controller('MessageCtrl', ["$scope","$rootScope","$state","$timeout","amMoment","$stateParams","MessageService",
    function ($scope, $rootScope, $state, $timeout,amMoment,
    $stateParams, MessageService) {

      $scope.finished = false;

      $scope.$on('$ionicView.afterEnter', function () {
          document.addEventListener("deviceready", function () {
          }, false);
      });

      amMoment.changeLocale('zh-cn');

      var id = $stateParams.id;
     
      MessageService.get(id).$promise.then(function (r) {

          $scope.finished = true;
          $scope.message = r;
      });

      var halfHeight = null;
      $scope.getHalfHeight = function () {
          if (ionic.Platform.isAndroid()) return 0;
          if (!halfHeight) {
              halfHeight = (document.documentElement.clientHeight / 2) - 200;
          }
          return halfHeight;
      };
  }]);