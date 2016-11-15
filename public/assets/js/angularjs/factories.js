musicbass.factory("loginService", ["$http", "$q", "$location", "sessionService", "$httpParamSerializerJQLike",
    function($http, $q, $location, sessionService, $httpParamSerializerJQLike) {
        return {
            login: function(data) {

                return $http.post(_config.serverURL + _config.serverPORT + _config.tokenEndPoint,
                    $httpParamSerializerJQLike(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            },
            isLogged: function() {
                if (!sessionService.get("tokenData")) return $q.reject("error");
                var url = _config.serverURL + _config.serverPORT + _config.API_URL + '/usuarios/islogged';

                return $http.get(_config.serverURL + _config.serverPORT + _config.API_URL + '/usuarios/islogged', { headers: { 'Authorization': 'Bearer ' + JSON.parse(base64_decode(sessionService.get("tokenData"))).access_token } });
            },
            logout: function(scope) {
                sessionStorage.removeItem("tokenData");
                scope.isLogged = false;
                $location.path('/home');
            }
        }
    }
]);

musicbass.factory("DataContext", ["$http", "sessionService", function($http, sessionService) {
    return {
        Usuarios: {
            getUserByEmail: function(email) {
                return $http.get(_config.serverURL + _config.serverPORT + _config.API_URL + '/usuarios/email/' + email + '/');
            },
            createUsuario: function(usuario) {
                return $http.post(_config.serverURL + _config.serverPORT + _config.API_URL + '/usuarios',
                    JSON.stringify(usuario)
                );
            }
        },
        tokenData: {
            data: {},
            setToken: function(data) {
                this.data["Expired"] = data.Expired;
                this.data["Issued"] = data.Issued;
                this.data["access_token"] = data.access_token;
                this.data["expires_in"] = data.expires_in;
                this.data["token_type"] = data.token_type;
                this.data["Nome"] = data.nome;
                sessionService.set("tokenData", base64_encode(JSON.stringify(this.data)));
            },
            getToken: function() {
                return this.data;
            }
        },
    };
}]);

musicbass.factory('sessionService', function() {
    return {
        set: function(key, value) {
            return sessionStorage.setItem(key, value);
        },
        get: function(key) {
            return sessionStorage.getItem(key);
        },
        destroy: function(key) {
            return sessionStorage.removeItem(key);
        }
    };
})

musicbass.factory("helperService", [
    function() {

        return {
            isEmail: function(email) {
                return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(email);
            },
            isNullOrEmpty: function(value) {
                return !value;
            },
            isValidCEP: function(value) {
                if (this.isNullOrEmpty(value)) return false;
                if (value.length < 8) return false;

                return true;
            },
            getNameInitials: function(name) {
                if (!this.isNullOrEmpty(name)) {
                    var arrName = name.split(" ");
                    var initials = arrName[0].charAt(0);
                    initials += arrName[arrName.length - 1].charAt(0);
                    return initials;
                } else {
                    return "";
                }
            },

            base64toBlob: function(base64Data) {
                var arr = base64Data.split(','),
                    contentType = arr[0].match(/:(.*?);/)[1];


                var sliceSize = 1024;
                var byteCharacters = atob(arr[1]);
                var bytesLength = byteCharacters.length;
                var slicesCount = Math.ceil(bytesLength / sliceSize);
                var byteArrays = new Array(slicesCount);

                for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                    var begin = sliceIndex * sliceSize;
                    var end = Math.min(begin + sliceSize, bytesLength);

                    var bytes = new Array(end - begin);
                    for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                        bytes[i] = byteCharacters[offset].charCodeAt(0);
                    }
                    byteArrays[sliceIndex] = new Uint8Array(bytes);
                }
                return new Blob(byteArrays, { type: contentType });
            }
        }
    }
]);