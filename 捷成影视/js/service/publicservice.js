angular.module('jptp')
/**
获取文件配置及数据库配置信息
*/
 .factory('PublicService',["$resource", "$rootScope","$q","ENV", function ($resource, $rootScope,$q,ENV) {   
     var props = {};
     var config = {};

     var resource = $resource(ENV.api, null, {
         getSysConfig:{
             method: 'get',
             url: ENV.api + '/config',
             params: {
                 keys: '@keys'
             }
         },
         getProps: {
             method: 'get',             
             url: ENV.api + '/properties',
             params: {
                 propTypes: '@propTypes'
             }
         },
         getClasses: {
             method: 'get',
             url: ENV.api + '/classes/:id',
             isArray:true,
             params: {
                 id: '@id'
             }
         },
         getColumn: {
             method: 'get',             
             url: ENV.api + '/column',
             params: {
                 name: '@name'
             }
         }
     });
     return {
         //受控词
         getProp: function (type) {
             return props["prop-" + type];
         },
         getProps: function (names) {
           
             var getDefer = $q.defer();

             resource.getProps({
                 propTypes: names
             }, function (response) {
                 var propTypes = names.split(",");
                 for (var i = 0; i < propTypes.length; i++) {
                     var key = "prop-" + propTypes[i];
                     props[key] = response[key];
                 }

                 getDefer.resolve(props);
             });

             return {
                 $promise: getDefer.promise
             };
         },
         getConfig:function(name){
             return config[name];
         },
         getSysConfig: function (names) {

            var getDefer = $q.defer();

             resource.getSysConfig({
                 keys: names
             }, function (response) {
                 var configNames = names.split(",");
                 for (var i = 0; i < configNames.length; i++) {
                     var key =  configNames[i];
                     config[key] = response[key];
                 }

                 getDefer.resolve(props);
             });

             return {
                 $promise: getDefer.promise
             };
         },
         getClasses: function (pid) {

             var getDefer = $q.defer();
             resource.getClasses({
                 id: pid
             }, function (response) {                 
                 getDefer.resolve(response);
             });

             return {
                 $promise: getDefer.promise
             };
         },
         getColumn: function (name) {
             var getDefer = $q.defer();

             resource.getColumn({
                 name: name
             }, function (response) {
                 getDefer.resolve(response);
             });

             return {
                 $promise: getDefer.promise
             };
         }
     };
 }]);