musicbass.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider.state('app', {
        abstract: true

    }).state('home', {
        parent: "app",
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
                templateUrl: 'html-views/view-login.html'
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
                $state.go("home");
                break;

            default:
                break;
        }

    });

    $rootScope
        .$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams) {
                //$("#ui-view").html("");
                //$(".page-loading").removeClass("hidden");
            });

    $rootScope
        .$on('$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams) {
                //debugger;
                //angular.element(element.getElementsByClassName("loading_router")).addClass("hide");

            });
}]);