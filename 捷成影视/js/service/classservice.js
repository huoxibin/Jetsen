angular.module('jptp')
/**
获取分类数据，分类显示商品数据
*/
 .factory('ClassService', ["$resource", "$rootScope", "$log", "$q", "Storage", "ENV", function ($resource, $rootScope, $log, $q, Storage, ENV) {
     var classes;
     var goodsList = {};
     var keywords, catalogue, origin, publishDate, label;
     var pageSize = 12;

     var resource = $resource(ENV.api, null, {
         getClasses: {
             method: 'get',
             isArray:true,
             url: ENV.api + '/class'
         },
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
                 s: pageSize
             }
         }
     });
     return { 
         getClasses: function () {           
             var getDefer = $q.defer();

             if (classes != null) {
                 getDefer.resolve(classes);
             }
             else {
                 resource.getClasses({
                 }, function (response) {
                     classes = response;
                     getDefer.resolve(classes);
                 });
             }
             return {
                 $promise: getDefer.promise
             };
         },
         fetchTopGoods: function (k,c,o,p,l) {
             keywords = k;
             catalogue = c;
             origin = o;
             publishDate = p;
             label = l;

             var hasNextPage = true;
             resource.query({
                 keywords: keywords,
                 catalogue: catalogue,
                 label:label,
                 origin: origin,
                 publishDate: publishDate
             }, function (r) {
                 var docs = (r.response && r.response.docs) ? r.response.docs : [];
                 if (docs.length < pageSize) {
                     hasNextPage = false;
                 }
                 goodsList = {
                     'nextPage': 2,
                     'hasNextPage': hasNextPage,
                     'data': docs
                 };
                 $rootScope.$broadcast('jptp.classgoodsUpdated', goodsList.data);
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
                 s: pageSize
             }, function (r) {
                 nextPage++;
                 var docs = (r.response && r.response.docs) ? r.response.docs : [];
                 if (docs.length < pageSize || nextPage > 10) {
                     hasNextPage = false;
                 }
                 goodsData = goodsData.concat(docs);
                 goodsList = {
                     'nextPage': nextPage,
                     'hasNextPage': hasNextPage,
                     'data': goodsData
                 };

                 $rootScope.$broadcast('jptp.classgoodsUpdated', goodsList.data);
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