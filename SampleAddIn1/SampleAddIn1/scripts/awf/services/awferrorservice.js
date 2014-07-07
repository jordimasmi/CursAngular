
awfApp.factory('awfError', function ($q, $rootScope, awfAlert) {
    var service = {};

    service.showError = function (description) {
        awfAlert.error("Error :", description);
    };

    service.handleError = function (errorResult) {
        //TODO Shadow, això ho hem passat aquí, és perquè l'Init té algun Get i no mostrar l'error si s'ha de fer login
        if (errorResult.status == 401) return;

        var result;
        if (errorResult.data != undefined)
            result = errorResult.data;
        else
            result = errorResult;

        var error = result.responseStatus;
        console.log(error);
        if (error) {
            if (error.message) //TODO: Comprovar que sigui una adaException
                service.showError(error.message);
        } else
            service.showError("Undefined error. Please see debug console.");
    };

    return service;

});

