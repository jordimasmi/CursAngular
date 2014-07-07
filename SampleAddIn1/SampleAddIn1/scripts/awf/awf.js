/*****************************
**
** Copyright (C) 2008-2012 Delsys ADA, S.L. Todos los derechos reservados.
**
** Este archivo es parte de la suite Delsys ADA.
**
** Este código es propiedad de Delsys ADA, S.L y queda prohibida su distribución
** copia o modificación sin el permiso expreso de Delsys ADA, S.L.
**
** Autor: jfernandez@delsys.net
**
************************************************/

var awfApp = angular.module('awfApp', [
    'ngLocale',
    'ui.bootstrap.accordion',
    'ui.bootstrap.tpls',
    'ui.router',
    'ui.select2',
    'awfCore',
    'awfDirectives',
    'awfBusiness',
    'ngCookies',
    'ngAnimate',
    'ngSanitize',
    'mgcrea.ngStrap', // Angular-strap
    'ngResource', // $resource
    'angularSpinner',
    'LocalStorageModule',
    'mgcrea.ngStrap.helpers.dimensions',
    'ui.nestedSortable',
    'ui.sortable',
    'ngGrid',
    'ui.codemirror',
    'restangular']
);

// Configuracions Angular-strap

awfApp.config(function($tooltipProvider, $tabProvider) {
    angular.extend($tooltipProvider.defaults, {
        html: true
    });
    angular.extend($tabProvider.defaults, {
        animation: 'am-flip-x'
    });
});

// Estats predefinits

awfApp.settings = {
    viewsPath: "Content/app/views/",
    imagesPath: "Content/app/images/"
};

function defaultParams(item, stateName) {
    var stateParams = item.state || {};
    if (!stateParams.templateUrl)
        stateParams.templateUrl = awfApp.settings.viewsPath + stateName + ".html";
    if (!stateParams.controller)
        stateParams.controller = stateName + "Controller";
    if (!stateParams.url)
        stateParams.url = "/" + item.name;
    stateParams.description = item.description || "No description";
    return stateParams; 
}

awfApp.buildStates = function (stateProvider, urlRouterProvider, states, parent) {

    var res = []; 

    states.forEach(function (item) {
        
        var stateName = item.name;
        if (parent)
            stateName = parent.name + "." + item.name;
        var stateParams = defaultParams(item, stateName); 

        //console.log("Register state:", stateName, stateParams);
        stateProvider.state(stateName, stateParams);

        var childStates;
        if (item.states) { //Fills
            //TODO Shadow, mira-t'ho
            item.name = stateName;
            childStates = awfApp.buildStates(stateProvider, urlRouterProvider, item.states, item);
        }


        if (childStates)
            stateParams.states = childStates;

        res.push(stateParams);



        if (item.isDefault)
            urlRouterProvider.otherwise(stateParams.url);
    });
    return res; 
};

awfApp.setStates = function(stateProvider, urlRouterProvider, states) {
    awfApp.states = states;
    awfApp.buildStates(stateProvider, urlRouterProvider, states); 
};



awfApp.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $provide) {
    
    // register the interceptor as a service
    $provide.factory('jsonHttpInterceptor', function($q, $rootScope) {
        return {
            'request': function(config) {
                if (config.url.indexOf("json") != -1) {
                    $rootScope.loading = true;
                }
                return config || $q.when(config);
            },

            'requestError': function(rejection) {
                // do something on error
                /* if (canRecover(rejection)) {
                     return responseOrNewPromise
                 }*/
                return $q.reject(rejection);
            },

            'response': function(response) {
                if (response.config.url.indexOf("json") != -1) {
                    $rootScope.loading = false;
                }
                return response || $q.when(response);
            },

            'responseError': function(rejection) {
                /* if (canRecover(rejection)) {
                     return responseOrNewPromise
                 }*/
                $rootScope.handleError(rejection);
                $rootScope.loading = false;
                return $q.reject(rejection);
            }
        };
    });
    //Disable $http Cache in IE
    $provide.factory('noCacheInterceptor', function() {
        return {
            request: function (config) {
                if (config.method == 'GET') {
                    //Si ho fem per totes les crides hi ha problemes amb els templates empotrats.
                    if (config.url.indexOf('credentials') != -1 || config.url.indexOf('json') != -1) {
                        var separator = config.url.indexOf('?') === -1 ? '?' : '&';
                        config.url = config.url + separator + 'noCache=' + new Date().getTime();
                    }
                }
                return config;
            }
        };
    });

    $httpProvider.interceptors.push('jsonHttpInterceptor');
    $httpProvider.interceptors.push('noCacheInterceptor');


    $urlRouterProvider.otherwise("/home");
    $stateProvider
        .state('permissions', {
            url: '/permissions',
            templateUrl: 'Content/awf/views/permissions.html',
            controller: 'permissionsController'
        })
        .state('login', {
            url: "/login",
            templateUrl: "Content/awf/views/login.html",
            controller: "loginController"
        })
        .state('logout', {
            url: "/logout",
            templateUrl: "Content/awf/views/logout.html",
            controller: "logoutController"
        });

});


//****---------------------------------  Interceptors  ----------------------------------------****

//TODO: Documentar camps extesos d'interceptors de restAngular.
// Base Application initializations 
awfApp.run(function ($rootScope, awfDesktop, awfError, awfBootstrap, awfCoreConfig, awfAddin, uiSelect2Config, Restangular) {

    // TODO: Move do awf 
    function requestInterceptor(element, operation) {
        $rootScope.loading = true;

        if (operation === "post" || operation === "put" || operation === "patch" || operation === "delete")
            element.body = angular.copy(element);

        if (element)
            element.addin = awfAddin.addinName($rootScope.$state); 

        return element;
    };

    function responseInterceptor(element) {
        $rootScope.loading = false;
        return element;
    };

    function init() {
        Restangular.addRequestInterceptor(requestInterceptor);
        Restangular.addResponseInterceptor(responseInterceptor);

        awfDesktop.setStates(awfApp.states, awfApp.settings);

        //DEPRECATED!!! utilitzar directament awfError.handleError
        $rootScope.handleError = awfError.handleError;
        $rootScope.adaApp = awfCoreConfig;

        //TODO: Utilitzar un modul, awdHeader i un controller awf.
        if ($rootScope.adaApp.desktop)
            $rootScope.adaApp.desktop.currentDesktopName = "Escritorio 0";

        //Configuració per defecte de Select2
        uiSelect2Config.formatNoMatches = function (term) { return "<b>No hay resultados para:</b> " + term; };

        awfBootstrap.init(awfCoreConfig.doLogin);
    }

    init();
});


//****---------------------------------  Controllers  ----------------------------------------****

awfApp.controller('awfDesktopController', function($scope, awfDesktop) {
    $scope.adaModules = awfDesktop.modules;
});

awfApp.controller('permissionsController', function ($scope, $state, coreUserRolesService) {

    var currentUser;

    function mapAppRolesForSelect(roles) {
        return roles.map(function (appRole) {
            return { id: appRole.pk, text: appRole.rol.description + " / " + appRole.app.description, pk: appRole.pk };
        });
    }
    
    function loadRoles() {

        coreUserRolesService.appRoles.getList().then(function(roles) {
            var select2Roles = mapAppRolesForSelect(roles); 
            select2Roles.forEach(function(appRole) {
                $scope.form.appRolSelectOptions.data.push(appRole); 
            });
        });
    }
    
    function userSelected(user) {
        if (!user) return;
        if (currentUser && currentUser.rolesChanged) {
            var roles = $scope.form.selectedAppRoles;
            if (roles) {
                currentUser.saveRoles(roles);
                currentUser.rolesChanged = false;
            }
        } 
        $scope.form.selectedAppRoles = null;
        currentUser = coreUserRolesService.usuario(user);
        currentUser.appRoles.getList().then(function (roles) {
            $scope.form.selectedAppRoles = mapAppRolesForSelect(roles);
        });
    }

    $scope.rolesChanged = function () {
        if (!currentUser) return;
        currentUser.rolesChanged = true;
    };

    $scope.saveRoles = function() {
        var roles = $scope.form.selectedAppRoles;
        if (!roles || !currentUser || !currentUser.rolesChanged) return;
        currentUser.saveRoles(roles);
        currentUser.rolesChanged = false;
    };

    $scope.goHome = function() {
        $state.go('home');
    };

    function init() {
        $scope.data = {
            users: coreUserRolesService.usuarios.getList().$object
        };

        $scope.form = {
            selectedUser : null, 
            selectedAppRoles : null
        };

        $scope.form.selectUsersOptions = {            
        };
        
        $scope.form.appRolSelectOptions = {
            multiple: true,
            data: []
        };

        $scope.$watch('form.selectedUser', userSelected);

        loadRoles(); 
    }

    init();
});

awfApp.controller('loginController', function ($scope, $cookies, $http, $location, $rootScope, localStorageService,
        awfAlert, awfBootstrap, awfCoreConfig) {

    init();

    function loadSetting(key, defaultValue) {
        var storedValue = localStorageService.get(key);
        return storedValue || defaultValue;
    }


    function loadSettings() {
        var settings = $scope.settings;
        settings.terminal = loadSetting("terminal", settings.terminal);
        settings.activeDirectory = loadSetting("activeDirectory", settings.activeDirectory);
        settings.domainServer = loadSetting("domainServer", settings.domainServer);
        settings.organizationUnitName = loadSetting("organizationUnitName", settings.organizationUnitName);
        settings.domainController = loadSetting("domainController", settings.domainController);
    }

    function init() {
        $scope.userName = "admin";
        $scope.password = "";
        $scope.allowChangeSettings = true,
        $scope.settings = {
            terminal: "",
            activeDirectory: false, 
            domainServer: "",
            organizationUnitName: "",
            domainController: ""
        };
        var defaultLogin = awfCoreConfig.defaultLogin; 
        if (defaultLogin) {
            $scope.settings = defaultLogin.settings;
            $scope.userName = defaultLogin.userName;
            $scope.password = defaultLogin.password;
            $scope.allowChangeSettings = defaultLogin.allowChangeSettings;
        }
            

        $scope.loginButtonClass = '';
        loadSettings();
        if (!awfCoreConfig.doLogin)
            $location.path("/");
    }

    $scope.saveSettings = function () {
        localStorageService.set("terminal", $scope.settings.terminal);
        localStorageService.set("activeDirectory", $scope.settings.activeDirectory );
        if ($scope.settings.activeDirectory) {
            localStorageService.set("domainServer", $scope.settings.domainServer);
            localStorageService.set("organizationUnitName", $scope.settings.organizationUnitName);
            localStorageService.set("domainController", $scope.settings.domainController);
        }
        $scope.settings.active = false; //TODO: Close popup
    };

    $scope.login = function () {
        $scope.loginButtonClass = 'glyphicon glyphicon-refresh login-icon spin';
        var credentials = { "userName": $scope.userName, "password": $scope.password, "RememberMe": false };

        //TODO: Canviar-ho per Service 
        var url = '/api/auth/credentials?Terminal=' + $scope.settings.terminal;
        if ($scope.settings.activeDirectory == "true") {
            url += "&DomainServer=" + $scope.settings.domainServer + "&OU=" + $scope.settings.organizationUnitName + "&DC=" + $scope.settings.domainController; 
        }

        $http.post(url, credentials).
            success(function (data, status, headers, config) {
                awfBootstrap.login();
                $location.path("/");
                $location.replace();
                $scope.loginButtonClass = '';
            }).
            error(function (data, status, headers, config) {
                //TODO: Posar una pestanya de més info.
                console.log(data);
                var errorString;
                if (data.responseStatus.message)
                    errorString = data.responseStatus.message;
                else
                    errorString = "Nombre de usuario o contraseña incorrecta"; 
                awfAlert.error("Error iniciando sesión:", errorString);
                $scope.loginButtonClass = '';
            });
    };
});

awfApp.controller('logoutController', function ($scope, $state, awfSession) {
    awfSession.logout();
    $scope.logoutMessage = "Logged out";
    $state.go("login");
});

