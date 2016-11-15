musicbass.factory("userService", ["$q", "$timeout", "$firebaseObject", "$firebaseArray",
    function($q, $timeout, $firebaseObject, $firebaseArray) {


        return {
            /* createUser: function(data) {
                 var user = $firebaseObject(ref.child(data.CPF));
                 user.CPF = data.CPF;
                 user.Credencial = data.Credencial;
                 user.DataNasc = data.DataNasc.toISOString();
                 user.Email = data.Email;
                 user.Nome = data.Nome;
                 user.NomeMae = data.NomeMae;
                 user.NomePai = data.NomePai;
                 user.RG = data.RG;
                 user.RGUF = data.RGUF;
                 user.Funcao = data.Funcao;
                 user.PhotoURL = data.PhotoURL;

                     return user.$save();
             },*/
            createUser: function(data) {
                var ref = firebase.database().ref('usuarios/' + data.CPF);
                return ref.set(data);
            },
            getUser: function(cpf) {
                var deferred = $q.defer();
                var ref = firebase.database().ref('usuarios/' + cpf);
                var obj = $firebaseObject(ref);
                obj.$loaded().then(function(a) {
                    return deferred.resolve(a);
                });

                return deferred.promise;
            },
            photoProfileUpload: function(file, uid) {
                var storageRef = firebase.storage().ref("images/credenciais/" + uid + ".jpg");
                return storageRef.put(file);
            }
        }

    }
]);

musicbass.factory("localidadeService", ["$q", "$firebaseArray",
    function($q, $firebaseArray) {
        var regioesCache;
        var estadosCache;
        var distritosCache = [];

        var ref = firebase.database().ref();
        return {
            getRegioes: function() {
                var deferred = $q.defer();
                var distritosRef = ref.child('distrito_igrejas');
                var regioesRef = ref.child('regioes_brasil');
                var list = $firebaseArray(regioesRef.orderByChild('Ativo').equalTo(true));
                list.$loaded().then(function(a) {
                    return deferred.resolve(a);
                });
                return deferred.promise;
            },
            getEstados: function() {
                var deferred = $q.defer();
                if (estadosCache) {
                    return $q.when(estadosCache);
                } else {
                    var estadosRef = ref.child('estados_brasil');
                    estadosRef.once('value').then(function(e) {
                        estadosCache = e;
                        return deferred.resolve(e);
                    });
                }
                return deferred.promise;
            },
            getCidades: function(EstadoID) {
                var cidadesRef = ref.child('cidades/' + EstadoID);
                var list = $firebaseArray(cidadeRef);
                var deferred = $q.defer();
                list.$loaded().then(function(a) {
                    return deferred.resolve(a);
                });
                return deferred.promise;
            },

            getDistritos: function(EstadoId) {

                var deferred = $q.defer();

                var distritosRef = ref.child('distrito_igrejas');
                var list = $firebaseArray(distritosRef.orderByChild('EstadoId').equalTo(EstadoId));
                list.$loaded().then(function(a) {

                    return deferred.resolve(a);
                });

                return deferred.promise;
            },

            consultarCEP: function(cep) {
                return $http.get('https://viacep.com.br/ws/' + cep + '/json/');
            }
        };
    }
]);

musicbass.factory("funcoesService", ["$q", "$firebaseArray",
    function($q, $firebaseArray) {
        var ref = firebase.database().ref('funcoes');
        var list = $firebaseArray(ref);
        return {
            getFuncoes: function() {
                var deferred = $q.defer();
                list.$loaded().then(function(a) {
                    return deferred.resolve(a);
                });
                return deferred.promise;
            }
        }
    }
]);

musicbass.factory("igrejasService", ["$q", "$firebaseArray",
    function($q, $firebaseArray) {
        var ref = firebase.database().ref();
        return {
            getIgrejas: function(DistritoId) {
                var deferred = $q.defer();
                var igrejasRef = ref.child('igrejas');
                var list = $firebaseArray(igrejasRef.orderByChild('DistritoId').equalTo(DistritoId));
                list.$loaded().then(function(a) {
                    return deferred.resolve(a);
                });
                return deferred.promise;
            }
        }
    }
]);

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