angular.module('jptp')

.factory('MessageService',["$resource", "$rootScope", "$q","Storage", "ENV", function ($resource, $rootScope, $q,Storage, ENV) {
   
    messages = {};
    message = null;
    currentType = "行业动态";

    var resource = $resource(ENV.api, {}, {
        query: {
            url: ENV.api + '/message',
            isArray: true,
            method: 'get',
            params: {
                type: '@type',
                p: 0,
                s:20
            }
        },
        get: {
            method: 'get',
            url: ENV.api + '/message/:id', params: {
                id: '@id'                
            }
        }
    });

    return {
        fetchTopMessages: function () {
           
            var hasNextPage = true;
            resource.query({
                type: currentType
            }, function (r) {                
                if (r.length < 20) {
                    hasNextPage = false;
                }
                messages[currentType] = {
                    'nextPage': 1,
                    'hasNextPage': hasNextPage,
                    'data': r
                };                
                $rootScope.$broadcast('jptp.messagesUpdated', messages[currentType].data);              
            });
        },
        getMessages: function () {
            return messages[currentType].data;
        },
        setCurrentType: function (type) {
            currentType = type;
            this.fetchTopMessages();           
        },
        getCurrentType: function () {
            return currentType;
        },
        increaseMessages: function () {
            var nextPage = messages[currentType].nextPage;
            var hasNextPage = messages[currentType].hasNextPage;
            var messagesData = messages[currentType].data;
            resource.query({
                type: currentType,
                p: nextPage,
                s: 20

            }, function (r) {              
                nextPage++;
                if (r.length < 20 || nextPage > 10) {
                    hasNextPage = false;
                }
                messagesData = messagesData.concat(r);
                messages[currentType] = {
                    'nextPage': nextPage,
                    'hasNextPage': hasNextPage,
                    'data': messagesData
                };

                $rootScope.$broadcast('jptp.messagesUpdated', messages[currentType].data);
            });
        },
        getMessage:function(){
            return message;
        },
        get: function (id) {
            var getDefer = $q.defer();

            if (message != null && message.id === id) {
                getDefer.resolve(message);
            }
            else{
                resource.get({
                    id: id
                }, function (response) {
                    message = response;
                    getDefer.resolve(message);
                });
            }
            return {
                $promise: getDefer.promise
            };              
        },        
        hasNextPage: function () {
            if (messages[currentType] === undefined) {
                return false;
            }
            return messages[currentType].hasNextPage;
        }
    };
}]);
