angular.module("jptp.config", [])
    .constant("ENV", {
        // "name": "production",
        "accessToken": '',
        "debug": false,
        "title":"捷成影视",
        "api": "http://192.168.8.178:8080/jptp/api/v1",
        //"api": "http://www.jetsenmedia.com/api/v1",
        "appleId": 'id981408438',
        'version': '1.0.1'
    })
;
