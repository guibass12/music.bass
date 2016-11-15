musicbass.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider.state('public', {
        abstract: true,
        resolve: {
            isLogged: ["loginService", "$q", function(loginService, $q) {
                var deferred = $q.defer();
                loginService.isLogged().then(function() { //Verifica se está logado
                    return deferred.reject("ALREADY_LOGGED");
                }).catch(function() {
                    return deferred.resolve();
                });
                return deferred.promise;
            }]
                }
    }).state('home', {
        parent: "public",
        url: '/',
        views: {
            'layout@': {
                templateUrl: 'html-views/view-layout.html'
            },
            'header@home': {
                templateUrl: 'html-views/view-header.html'
            },
            'content@home': {
                templateUrl: 'html-views/view-content.html'
            },
        }
    }).state('home.sobre', {
        url: 'sobre',
        views: {
            'content@home': {
                templateUrl: 'html-views/view-sobre.html'
            },
        }
    }).state('home.contato', {
        url: 'contato',
        views: {
            'content@home': {
                templateUrl: 'html-views/view-contato.html'
            },
        }
    }).state('home.cadastro', {
        url: 'cadastro',
        views: {
            'content@home': {
                templateUrl: 'html-views/view-cadastro.html',
                controller: 'cadastroController'
            },
        }
    }).state('home.login', {
        url: 'login',
        views: {
            'content@home': {
                templateUrl: 'html-views/view-login.html',
                controller: 'loginController'
            },
        }
    });

    $stateProvider.state('private', {
        abstract: true,
        resolve: {
            isLogged: ["loginService", "$q", function(loginService, $q) {
                var deferred = $q.defer();

                loginService.isLogged().then(function() { //Verifica se está logado
                    return deferred.resolve();
                }).catch(function() {
                    return deferred.reject("AUTH_REQUIRED");
                });

                return deferred.promise;
            }]
        }
    }).state('private.home', {
        parent: "private",
        url: '/private',
        views: {
            'layout@': {
                templateUrl: 'html-views/view-layout.html'
            },
            'header@private.home': {
                templateUrl: 'html-views/view-header-private.html',
                controller: 'headerPrivateController'
            },
            'content@private.home': {
                templateUrl: 'html-views/view-content-private.html'
            },
        }
    });

}]);

musicbass.run(["$rootScope", "$state", function($rootScope, $state) {
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {

        switch (error) {
            case "AUTH_REQUIRED":
                $state.go("home.login");
                break;
            case "ALREADY_LOGGED":
                $state.go("private.home");
                break;

            default:
                break;
        }

    });
}]);