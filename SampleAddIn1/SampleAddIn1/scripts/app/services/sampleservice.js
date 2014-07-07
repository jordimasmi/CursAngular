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
'use strict';


awfApp.factory('sampleService', function ($resource, $q, $rootScope, Restangular) {
    
    var baseUrl = '/json/reply/Portal';
    var oneWayUrl = '/json/oneway/Portal';

    var rest = Restangular.withConfig(function (restangularConfigurer) {
        restangularConfigurer.setBaseUrl('Portal');
    });

    var service = {
        articulos: rest.all('Pastas'),
    };

    return service; 
});


