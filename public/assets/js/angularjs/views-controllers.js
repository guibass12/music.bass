musicbass.controller('cadastroController', ["$scope", "$uibModal", "DataContext", function contentController($scope, $uibModal, DataContext) {

    $scope.erro = false;
    $scope.success = false;
    $scope.createModel = {
        Nome: "André Evangelista",
        Email: "andreluisce@gmail.com",
        Senha: "alce6582",
        ConfirmaSenha: "alce6582"
    };

    $scope.createUsuario = function(usuario) {
        $scope.erro = false;
        $scope.success = false;

        usuario.NivelId = 1;
        var loadingAlert = $uibModal.open({
            templateUrl: 'html-templates/message-boxes/loading-alert.html',
            backdrop: 'static',
            keyboard: false
        });
        DataContext.Usuarios.createUsuario(usuario).then(function(res) {
            $scope.success = true;

            $scope.createModel = {
                Nome: "",
                Email: "",
                Senha: "",
                ConfirmaSenha: ""
            };

        }).catch(function(e) {
            $scope.erro = true;
            $scope.errorMsg = e.data;
        }).finally(function() {
            loadingAlert.close();

            $scope.formCreateLogin.$setPristine();
            $scope.formCreateLogin.$setUntouched();
        });
    };
}]);

musicbass.controller('headerPrivateController', ["$scope", "$state", "sessionService", function contentController($scope, $state, sessionService) {

    $scope.user = JSON.parse(base64_decode(sessionService.get("tokenData")));

    $scope.logout = function() {
        sessionService.destroy("tokenData");
        $state.go("home");
    }

}]);

musicbass.controller('loginController', ["$scope", "$uibModal", "$state", "loginService", "DataContext", function loginController($scope, $uibModal, $state, loginService, DataContext) {
    $scope.errorOnLogin = false;
    $scope.loginModel = {
        grant_type: "password",
        UserName: "",
        Password: ""
    };

    $scope.login = function(data) {
        $scope.errorOnLogin = false;
        var loadingAlert = $uibModal.open({
            templateUrl: 'html-templates/message-boxes/loading-alert.html',
            backdrop: 'static',
            keyboard: false
        });

        loginService.login(data).then(function(msg) {
            if (msg.data && msg.data.access_token) {
                msg.data["Issued"] = msg.data[".issued"];
                msg.data["Expired"] = msg.data[".expires"];
                DataContext.tokenData.setToken(msg.data);
                loadingAlert.close();
                $state.go("private.home");

            } else {
                $scope.errorOnLogin = true;
                $scope.loginModel = {
                    grant_type: "password",
                    UserName: "",
                    Password: ""
                };
            }
        }).catch(function(e) {
            $scope.errorOnLogin = true;

        }).finally(function() {
            loadingAlert.close();

            $scope.loginForm.$setPristine();
            $scope.loginForm.$setUntouched();
        });;
    }
}]);