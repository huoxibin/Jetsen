angular.module('jptp')

.factory('Storage', function () {
    //"use strict";
    return {
        set: function (key, data) {
            return window.localStorage.setItem(key, window.JSON.stringify(data));
        },
        get: function (key) {

            return window.JSON.parse(window.localStorage.getItem(key));
        },
        remove: function (key) {
            return window.localStorage.removeItem(key);
        }
    };
})
.factory('UserService',["ENV", "$resource", "$q","Storage", function (ENV, $resource, $q, Storage) {
    var storageKey = 'user';
    var resource = $resource(ENV.api + '/accesstoken');
    var userResource = $resource(ENV.api + '/user/:loginname', {
        loginname: ''
    });
    var user = Storage.get(storageKey) || {};

    var resource = $resource(ENV.api, null, {
        login: {
            method: 'post',
            url: ENV.api + '/login',
            params: {
                name: '@name',
                password: '@password'
            }
        },
        wxlogin: {
            method: 'post',
            url: ENV.api + '/wxlogin',
            params: {
                code: '@code',
                name: '@name',
                password: '@password'
            }
        },
        get: {
            method: 'get',
            url: ENV.api + '/user/:id',
            params: {
                id: '@id'
            }
        },
        getHistory: {
            method: 'get',
            url: ENV.api + '/history/:id',
            isArray: true,
            params: {
                id: '@id'
            }
        },
        getFavorite: {
            method: 'get',
            url: ENV.api + '/favorite/:id',
            params: {
                id: '@id'
            }
        },
        getCart: {
            method: 'get',
            url: ENV.api + '/cart/:id',
            params: {
                id: '@id'
            }
        },
        addToCart: {
            method: 'post',
            url: ENV.api + '/cart/add',
            params: {
                userId: '@userId',
                institutionId: '@institutionId',
                goodsId: '@goodsId',
                goodsName: '@goodsName'
            }
        },
        deleteCart: {
            method: 'get',
            url: ENV.api + '/cart/:id/delete',
            params: {
                id: '@id'
            }
        },
        toOrder: {
            method: 'post',
            url: ENV.api + '/cart/toorder',
            params: {
                ids: '@ids',
                userId: '@userId',
                institutionId: '@institutionId'
            }
        },
        addFavorite: {
            method: 'post',
            url: ENV.api + '/favorite/add',
            params: {
                userId: '@userId',
                institutionId: '@institutionId',
                goodsId: '@goodsId',
                goodsName: '@goodsName'
            }
        },
        deleteFavorite: {
            method: 'get',
            url: ENV.api + '/favorite/:id/delete',
            params: {
                id: '@id'
            }
        }
    });

    return {
        login: function (username, password) {
            var loginDefer = $q.defer();
            resource.login({
                name: username,
                password: password
            }, function (response) {

                loginDefer.resolve(response);

                if (response.result) {
                    user = response.t;
                    Storage.set(storageKey, user);
                }
            });

            return {
                $promise: loginDefer.promise
            };
        },
        wxlogin: function (code, username, password) {
            var loginDefer = $q.defer();
            resource.wxlogin({
                code: code,
                name: username,
                password: password
            }, function (response) {

                loginDefer.resolve(response);

                if (response.result) {
                    user = response.t;
                    if (user.loginId) {
                        Storage.set(storageKey, user);
                    }
                }
            });

            return {
                $promise: loginDefer.promise
            };
        },
        logout: function () {
            user = {};
            Storage.remove(storageKey);

            var logoutDefer = $q.defer();
            logoutDefer.resolve(null);

            return {
                $promise: logoutDefer.promise
            };
        },
        getCurrentUser: function () {
            return user;
        },
        getFavorite: function () {
            var getDefer = $q.defer();
            resource.getFavorite({
                id: user.userId
            }, function (response) {
                getDefer.resolve(response);
            });

            return {
                $promise: getDefer.promise
            };
        },
        getHistory: function () {
            var getDefer = $q.defer();
            resource.getHistory({
                id: user.userId
            }, function (response) {
                getDefer.resolve(response);
            });

            return {
                $promise: getDefer.promise
            };
        },
        getCart: function () {
            var getDefer = $q.defer();
            resource.getCart({
                id: user.userId,
            }, function (response) {
                getDefer.resolve(response);
            });

            return {
                $promise: getDefer.promise
            };
        },
        addFavorite: function (goodsId, goodsName) {
            var resourceDefer = $q.defer();
            resource.addFavorite({
                userId: user.userId,
                institutionId: user.institutionId,
                goodsId: goodsId,
                goodsName: goodsName
            }, function (response) {
                resourceDefer.resolve(response);
            });

            return {
                $promise: resourceDefer.promise
            };
        },
        addToCart: function (goodsId, goodsName) {
            var resourceDefer = $q.defer();
            resource.addToCart({
                userId: user.userId,
                institutionId: user.institutionId,
                goodsId: goodsId,
                goodsName: goodsName
            }, function (response) {
                resourceDefer.resolve(response);
            });

            return {
                $promise: resourceDefer.promise
            };
        },
        toOrder: function (ids) {
            var resourceDefer = $q.defer();
            resource.toOrder({
                ids: ids,
                userId: user.userId,
                institutionId: user.institutionId
            }, function (response) {
                resourceDefer.resolve(response);
            });

            return {
                $promise: resourceDefer.promise
            };
        },
        deleteFavorite: function (id) {
            var resourceDefer = $q.defer();
            resource.deleteFavorite({
                id: id
            }, function (response) {
                resourceDefer.resolve(response);
            });

            return {
                $promise: resourceDefer.promise
            };
        },
        deleteCart: function (id) {
            var resourceDefer = $q.defer();
            resource.deleteCart({
                id: id
            }, function (response) {
                resourceDefer.resolve(response);
            });

            return {
                $promise: resourceDefer.promise
            };
        }
    };
}])
.factory('Settings',["ENV", "$resource", "Storage", function (ENV, $resource, Storage) {
    var storageKey = 'settings';
    var settings = Storage.get(storageKey) || {
        sendFrom: true,
        showAvatar: true,
        version: ENV.version
    };
    return {
        getSettings: function () {
            return settings;
        },
        setSettings: function (key, value) {
            settings[key] = value;
        },
        save: function (settings) {
            Storage.set(storageKey, settings);
        }
    };
}]);
