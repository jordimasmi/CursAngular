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

awfApp.controller('homeController', function ($scope, awfSession, awfCoreConfig) {
    function init() {
        if (awfCoreConfig.doLogin)
            awfSession.login();
    }
    init();
});
