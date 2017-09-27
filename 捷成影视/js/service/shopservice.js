angular.module('jptp')

 /**
 获取专柜数据
 */
 .factory('ShopService', ["$resource", "$rootScope", "$q", "ENV",function ($resource, $rootScope, $q, ENV) {
     var shops = {};
     var shop = {};

     var resource = $resource(ENV.api, null, {
         getShopList: {
             method: 'get',            
             url: ENV.api + '/shop'
         },
         getShop: {
             method: 'get',            
             url: ENV.api + '/shop/:id',
             params: {
                 "id":"@id"
             }
         }

     });
     return {
         getShops: function () {
             return shops;
         },        
         getShopList: function () {

             resource.getShopList({
             }, function (response) {
                 shops = response;
                 $rootScope.$broadcast('jptp.shopsUpdated');
             });
         },         
         get: function (id,reload) {
             var getDefer = $q.defer();

             if (shop[id] != null && shop[id].id === id && !reload) {
                 getDefer.resolve(shop[id]);
             }
             else{
                 resource.getShop({
                     id: id
                 }, function (response) {
                     shop[id] = {
                         id:id,
                         shopInfo: response["shopInfo"],
                         pageColumns: response["pageColumns"]
                     };
                     getDefer.resolve(shop[id]);
                });
             }
             return {
                 $promise: getDefer.promise
             };              
         }             
     };
 }]);