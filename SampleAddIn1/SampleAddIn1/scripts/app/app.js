/****************************************************************************
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
****************************************************************************/


//****---------------------------------  App Config  ----------------------------------------****

var appConfig = {
    appName: "awfApp-ApplicationName",
    appTitle: "Ada Web Framework",
    useDevices: true,
    customerName: "DELSYS ADA, S.L.",
    desktop: {
        headerVisible: true,
        footerVisible: true,
        desktopOptions: true,
        logo: 'Content/awf/images//logo.png'
    },
    doLogin: true,
    defaultLogin: {
        userName: "admin",
        password: "delsys",
        allowChangeSettings: true,
        settings: {
            terminal: "1",
            activeDirectory: "true",
            domainServer: "",
            organizationUnitName: "",
            domainController: ""
        }
    }
};


angular.module('LocalStorageModule').value('prefix', appConfig.appName);
awfCoreModule.value("awfCoreConfig", appConfig);

awfApp.config(function ($stateProvider, $urlRouterProvider) {
    /*
      Objecte estat: 
      {
        name: 'home',
        default: true, //Indica la ruta per defecte
        state: {
            url: //Per convenció /<name>
            templateUrl: // Per convencio: controller = <name>.html
            controller: //Per convencio: controller = <name>Controller
            //...
            },
        states : [], //Estats fills (El mateix que states)
        module: { //=> Te presencia al llistat de mòduls o addins
            title: "Titol del mòdul",
            description: "Descripció ",
            img: "docs.png",
            dbRegister: false //Indica si registra l'Addin a la BD.
        }
    }*/

    var states = [
        { name: 'home', isDefault: true }, //TODO: Moure a awf 
        { name: 'moduleGestioStock', module: { title: "Consulta Stock", img: "modul1.png" } }
    ];
               
    awfApp.setStates($stateProvider, $urlRouterProvider, states);
});

//****---------------------------------  App RUN  ----------------------------------------****

awfApp.run(function () {
    //Inicialitzacions d'aplicació.
});

