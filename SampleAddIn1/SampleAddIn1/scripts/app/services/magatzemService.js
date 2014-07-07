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


awfApp.factory('magatzemService', function ($resource, $q, $rootScope, Restangular) {
    
    var rest = Restangular.withConfig(function (restangularConfigurer) {
        restangularConfigurer.setBaseUrl('/api/BusinessDiet');
    });

    var service = {
        articulos: rest.all('Articulos'),
    };

    return service; 
});


