angular.module('jptp')

 /**
 获取首页数据
 */
 .factory('IndexService', ["$resource", "$rootScope","ENV",function ($resource, $rootScope,ENV) {
     var posters = {};
     var messages = {};
     var pageColumns = {};
     var classes = {};

     var resource = $resource(ENV.api, null, {
         getIndexData: {
             method: 'get',
             url: ENV.api + '/index'
         }        
     });
     return {
         getPosters: function () {
             return posters;
         },
         getMessages: function () {
             return messages;
         },
         getPageColumns: function () {
             return pageColumns;
         },
         getClasses: function () {             
             return classes;
         },
         getData: function () {
             resource.getIndexData({
             }, function (response) {

                 posters = response.posters,
                 messages = response.messages,
                 pageColumns = response.pageColumns,
                 classes = response.classes

                 $rootScope.$broadcast('jptp.indexUpdated');
             });
         }         
     };
 }]);