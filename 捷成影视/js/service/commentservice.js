angular.module('jptp')

 /**
 商品留言相关接口
 */
 .factory('CommentService',["$resource", "$rootScope", "$log", "$q", "Storage", "ENV", function ($resource, $rootScope, $log, $q, Storage, ENV) {
   
     var goodsCommentList = {};

     var resource = $resource(ENV.api, null, {
         //获取单个商品
         add: {
             method: 'post',           
             url: ENV.api + '/goodscomment/add/:goodsId',
             params: {
                 goodsId: '@goodsId',
                 msg: "@msg",                
                 userId: '@userId',
                 institutionId: '@institutionId'
             }
         },
         //查询商品留言列表
         query: {
             url: ENV.api + '/goodscomment/:id',
             method: 'get',
             isArray:true,
             params: {                 
                 id: '@id',
                 p: 0,
                 s: 10
             }
         }
     });
     return {    
         add: function (goodsId, msg, userId, institutionId) {
             var getDefer = $q.defer();

             resource.add({
                 goodsId: goodsId,
                 msg: msg,                 
                 userId: userId,
                 institutionId: institutionId
             }, function (response) {
                 getDefer.resolve(response);
             });

             return {
                 $promise: getDefer.promise
             };
         },
         fetchTopGoodsComment: function (id) {           

             var hasNextPage = true;
             resource.query({
                id:id
             }, function (r) {
                 if (r.length < 10) {
                     hasNextPage = false;
                 }
                 goodsCommentList = {
                     'nextPage': 1,
                     'hasNextPage': hasNextPage,
                     'data': r
                 };
                 $rootScope.$broadcast('jptp.goodsCommentUpdated', goodsCommentList.data);
             });
         },
         getGoodsComment: function (id) {
             return goodsCommentList.data;
         },
         increaseGoodsComment: function (id) {
             var nextPage = goodsCommentList.nextPage;
             var hasNextPage = goodsCommentList.hasNextPage;
             var goodsCommentData = goodsCommentList.data;
             resource.query({
                 id:id,
                 p: nextPage,
                 s: 10
             }, function (r) {
                 nextPage++;
                 if (r.length < 10 || nextPage > 10) {
                     hasNextPage = false;
                 }
                 goodsCommentData = goodsCommentData.concat(r);
                 goodsCommentList = {
                     'nextPage': nextPage,
                     'hasNextPage': hasNextPage,
                     'data': goodsCommentData
                 };

                 $rootScope.$broadcast('jptp.goodsCommentUpdated', goodsCommentList.data);
             });
         },
         hasNextPage: function () {
             if (goodsCommentList === undefined) {
                 return false;
             }
             return goodsCommentList.hasNextPage;
         }
     };
 }]);