musicbass.controller('cadastroController', ["$scope", "DataContext",

    function contentController($scope, DataContext) {

        $scope.createUsuario = function(usuario) {
            usuario.NivelId = 1;

            DataContext.Usuarios.createUsuario(usuario).then(function(res) {

            });



        }
    }
]);