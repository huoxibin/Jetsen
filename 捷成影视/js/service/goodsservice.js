angular.module('jptp')

 /**
 商品相关接口
 */
 .factory('GoodsService', ["$resource", "$rootScope", "$log", "$q", "Storage","ENV",function ($resource, $rootScope, $log, $q, Storage, ENV) {
     var goodsInfo;
     var goodsList = {};
     var keywords, catalogue, origin, publishDate, label;

     var resource = $resource(ENV.api, null, {
         //获取单个商品
         get: {
             method: 'get',
             url: ENV.api + '/view/:id',
             params: {
                 id: "@id",
                 userId: '@userId',
                 institutionId: '@institutionId'
             }
         },
         getLikeGoods: {
             method: 'get',
             url: ENV.api + '/goodslike/:id',
             params: {
                 id: "@id"
             }
         },
         //查询商品列表
         query: {
             url: ENV.api + '/search',
             method: 'get',
             params: {
                 keywords: '@keywords',
                 catalogue: '@catalogue',
                 label: '@label',
                 origin: '@origin',
                 publishDate: '@publishDate',
                 p: 1,
                 s: 10
             }
         }
     });
     return {
         get: function (id, userId, institutionId) {
             var getDefer = $q.defer();

             if (goodsInfo !== undefined && goodsInfo.id === id) {
                 getDefer.resolve(goodsInfo);
             }
             else {
                 resource.get({
                     id: id,
                     userId: userId,
                     institutionId: institutionId
                 }, function (response) {
                     goodsInfo = { goods: response.goods, goodsObjects: response.goodsObjects, isFavorite: response.isFavorite==1};
                     getDefer.resolve(goodsInfo);
                 });
             }
             return {
                 $promise: getDefer.promise
             };
         },
         getLikeGoods: function (id) {
             var getDefer = $q.defer();

             resource.getLikeGoods({
                 id: id
             }, function (r) {
                 var docs = (r.response && r.response.docs) ? r.response.docs : [];
                 getDefer.resolve(docs);
             });
             return {
                 $promise: getDefer.promise
             };
         },
         fetchTopGoods: function (k, c, o, p, l) {
             keywords = k;
             catalogue = c;
             origin = o;
             publishDate = p;
             label = l;

             var hasNextPage = true;
             resource.query({
                 keywords: keywords,
                 catalogue: catalogue,
                 label: label,
                 origin: origin,
                 publishDate: publishDate
             }, function (r) {
                 var docs = (r.response && r.response.docs) ? r.response.docs : [];
                 if (docs.length < 10) {
                     hasNextPage = false;
                 }
                 goodsList = {
                     'nextPage': 2,
                     'hasNextPage': hasNextPage,
                     'data': docs
                 };
                 $rootScope.$broadcast('jptp.goodsUpdated', goodsList.data);
             });
         },
         getGoods: function () {
             return goodsList.data;
         },
         increaseGoods: function () {

             var nextPage = goodsList.nextPage;
             var hasNextPage = goodsList.hasNextPage;
             var goodsData = goodsList.data;
             resource.query({
                 keywords: keywords,
                 catalogue: catalogue,
                 origin: origin,
                 publishDate: publishDate,
                 p: nextPage,
                 s: 10
             }, function (r) {
                 nextPage++;
                 var docs = (r.response && r.response.docs) ? r.response.docs : [];
                 if (docs.length < 10 || nextPage > 10) {
                     hasNextPage = false;
                 }
                 goodsData = goodsData.concat(docs);
                 goodsList = {
                     'nextPage': nextPage,
                     'hasNextPage': hasNextPage,
                     'data': goodsData
                 };

                 $rootScope.$broadcast('jptp.goodsUpdated', goodsList.data);
             });
         },
         hasNextPage: function () {
             if (goodsList === undefined) {
                 return false;
             }
             return goodsList.hasNextPage;
         }
     };
 }]);