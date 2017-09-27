angular.module('jptp')

.factory('OrderService', ["ENV", "$resource", "$rootScope", "$q", "UserService", "Storage", function (ENV, $resource,$rootScope, $q, UserService, Storage) {

    var orders = {};
    var pageSize = 10;
    var state,isSale;

    var resource = $resource(ENV.api, null, {
        get: {
            method: 'get',
            url: ENV.api + '/order/:id',
            params: {
                id: '@id'
            }
        },
        getOrders: {
            method: 'get',
            url: ENV.api + '/orders/:id',
            params: {
                id: '@id',
                orderStatus:-1,
                p:0,
                s:pageSize
            }
        },
        commitOrder: {
            method: 'post',
            url: ENV.api + '/order/:id/commit',
            params: {
                id: '@id',
                userId: '@userId',
                institutionId: '@institutionId'
            }
        },
        cancelOrder: {
            method: 'post',
            url: ENV.api + '/order/:id/cancel',
            params: {
                id: '@id',
                userId: '@userId',
                institutionId: '@institutionId'
            }
        },
        confirmOrder: {
            method: 'post',
            url: ENV.api + '/order/:id/confirm',
            params: {
                id: '@id',
                userId: '@userId',
                institutionId: '@institutionId'
            }
        },
        deliveryOrder: {
            method: 'post',
            url: ENV.api + '/order/:id/delivery',
            params: {
                id: '@id',
                userId: '@userId',
                institutionId: '@institutionId'
            }
        },
        finishOrder: {
            method: 'post',
            url: ENV.api + '/order/:id/finish',
            params: {
                id: '@id',
                userId: '@userId',
                institutionId: '@institutionId'
            }
        },
        paydownOrder: {
            method: 'post',
            url: ENV.api + '/order/:id/paydown',
            params: {
                id: '@id',
                userId: '@userId',
                institutionId: '@institutionId'
            }
        },
        payendOrder: {
            method: 'post',
            url: ENV.api + '/order/:id/payend',
            params: {
                id: '@id',
                userId: '@userId',
                institutionId: '@institutionId'
            }
        }
    });

    return {
        get: function (id) {
            var getDefer = $q.defer();
            resource.get({
                id: id
            }, function (response) {
                getDefer.resolve(response);
            });

            return {
                $promise: getDefer.promise
            };
        },        
        fetchTopOrders: function (s,i) {
            state = s;
            isSale = i;
            var user = UserService.getCurrentUser();
            var hasNextPage = true;
            
            resource.getOrders({
                id: user.institutionId,
                isSale:isSale?1:0,
                orderStatus:state
            }, function (r) {
                var items = (r.items) ? r.items : [];
                if (items.length < pageSize) {
                    hasNextPage = false;
                }
                orders = {
                    'nextPage': 1,
                    'hasNextPage': hasNextPage,
                    'data': { orderCounts: r.orderCounts, items: items }
                };
                $rootScope.$broadcast('jptp.ordersUpdated', orders.data);
            });
        },
        getOrders: function () {
            return orders.data;
        },
        increaseOrders: function () {
            var nextPage = orders.nextPage;
            var hasNextPage = orders.hasNextPage;
            var ordersData = orders.data.items;
            var user = UserService.getCurrentUser();
            
            resource.getOrders({
                id: user.institutionId,
                isSale:isSale?1:0,
                orderStatus:state,
                p: nextPage,
                s: pageSize
            }, function (r) {
                nextPage++;
                var items = (r.items) ? r.items : [];
                if (items.length < pageSize || nextPage > 10) {
                    hasNextPage = false;
                }                
                ordersData = ordersData.concat(items);
                orders = {
                    'nextPage': nextPage,
                    'hasNextPage': hasNextPage,
                    'data': { orderCounts: r.orderCounts, items: ordersData }
                };

                $rootScope.$broadcast('jptp.ordersUpdated', orders.data);
            });
        },
        hasNextPage: function () {
            if (orders === undefined) {
                return false;
            }
            return orders.hasNextPage;
        },
        commitOrder: function (id) {
            var user = UserService.getCurrentUser();
            var resourceDefer = $q.defer();
            resource.commitOrder({
                id:id,
                userId: user.userId,
                institutionId: user.institutionId               
            }, function (response) {
                resourceDefer.resolve(response);
            });

            return {
                $promise: resourceDefer.promise
            };
        },
        cancelOrder: function (id) {
            var user = UserService.getCurrentUser();
            var resourceDefer = $q.defer();
            resource.cancelOrder({
                id: id,
                userId: user.userId,
                institutionId: user.institutionId
            }, function (response) {
                resourceDefer.resolve(response);
            });

            return {
                $promise: resourceDefer.promise
            };
        },
        confirmOrder: function (id) {
            var user = UserService.getCurrentUser();
            var resourceDefer = $q.defer();
            resource.confirmOrder({
                id: id,
                userId: user.userId,
                institutionId: user.institutionId
            }, function (response) {
                resourceDefer.resolve(response);
            });

            return {
                $promise: resourceDefer.promise
            };
        },
        deliveryOrder: function (id) {
            var user = UserService.getCurrentUser();
            var resourceDefer = $q.defer();
            resource.deliveryOrder({
                id: id,
                userId: user.userId,
                institutionId: user.institutionId
            }, function (response) {
                resourceDefer.resolve(response);
            });

            return {
                $promise: resourceDefer.promise
            };
        },
        finishOrder: function (id) {
            var user = UserService.getCurrentUser();
            var resourceDefer = $q.defer();
            resource.finishOrder({
                id: id,
                userId: user.userId,
                institutionId: user.institutionId
            }, function (response) {
                resourceDefer.resolve(response);
            });

            return {
                $promise: resourceDefer.promise
            };
        },
        paydownOrder: function (id) {
            var user = UserService.getCurrentUser();
            var resourceDefer = $q.defer();
            resource.paydownOrder({
                id: id,
                userId: user.userId,
                institutionId: user.institutionId
            }, function (response) {
                resourceDefer.resolve(response);
            });

            return {
                $promise: resourceDefer.promise
            };
        },
        payendOrder: function (id) {
            var user = UserService.getCurrentUser();
            var resourceDefer = $q.defer();
            resource.payendOrder({
                id: id,
                userId: user.userId,
                institutionId: user.institutionId
            }, function (response) {
                resourceDefer.resolve(response);
            });

            return {
                $promise: resourceDefer.promise
            };
        }
    };
}]);
