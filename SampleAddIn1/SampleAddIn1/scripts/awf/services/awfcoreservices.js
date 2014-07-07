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

var awfCoreModule = angular.module('awfCore', ['mgcrea.ngStrap']);

awfCoreModule.value("awfCoreConfig",
    {
        appName: "awfApp-ApplicationName",
        useDevices: false,
        customerName: "DELSYS ADA, S.L."
    });

// --------------------------------------------------
// -                awfSession  Module              -
// --------------------------------------------------

awfCoreModule.factory('awfSession', function ($resource, $q, $http, $location, $rootScope, awfCoreConfig) {
    var session = $resource('/api/secured?format=json', {}, {
        get: { method: 'GET' }
    });

    //TODO: Utilitzar promises 
    session.login = function(successCallback) {
        var sessionData = session.get({}, function() {
            if (!session.isLoggedIn(sessionData)) {
                $location.path("/login");
            } else {
                $rootScope.session = sessionData;
                if (successCallback != undefined)
                    successCallback();
            }
        }, function (response) {
            console.log("AWF: Error in login service" +  response);
        });
    };


    session.isLoggedIn = function (sessionData) {
        return sessionData.userAuthId != undefined;
    };

    session.logout = function () {
        $http.get('/api/auth/logout').success(function () {
            $rootScope.session = null;
        });
    };


    return session;
});


// --------------------------------------------------
// -                awfAlerts  Module              -
// --------------------------------------------------

awfCoreModule.config(function($alertProvider) {
    angular.extend($alertProvider.defaults, {
        animation: 'am-fade-and-slide-top',
        placement: 'top',
        duration: 10
    });
});

awfCoreModule.factory('awfAlert', function ($alert) {
    var service = {};

    function alert(title, content, type) {
        return $alert({ title: title, content: '<br/>' + content, type: type, show: true });
    }

    service.error = function(title, content) {
        return alert(title, content, 'danger');
    };

    service.info = function (title, content) {
        return alert(title, content, 'info');
    };
    
    service.message = function (title, content) {
        return alert(title, content, 'success');
    };


    return service;
});

awfCoreModule.factory('awfModal',['$q','$modal', '$rootScope', function ($q, $modal, $rootScope) {
    var service = {};
    
    function deferModalResult(modal) {
        var deferred = $q.defer();


        modal.$promise.then(function () {
            modal.$scope.close = function (result) {
                modal.hide();
                deferred.resolve(result);
            };
        });

        return deferred.promise;
    }

    service.confirm = function(question) {
        return deferModalResult($modal({ backdrop: 'static', content: question || "N'estas segur?", template: '/Content/awf/views/modal-confirm.html', show: true }));
    };

    service.input = function (question) {
        var scope = $rootScope.$new();
        scope.inputValue = null;

        scope.inputKeyPressed = function(event) {
            if (event.keyCode == 13)
                this.close(this.inputValue);

        };
        scope.message = question || "Entra el valor"; 
        return deferModalResult($modal({ backdrop: 'static', scope: scope , template: '/Content/awf/views/modal-input.html', show: true }));
    };

    service.message = function(message) {
        $modal({ title: "Missatge d'aplicació", content: message, show: true });
    };

    return service;
}]);

// --------------------------------------------------
// -                awfCruds  Module              -
// --------------------------------------------------

awfCoreModule.factory('awfCrud', function($modal, $q, $rootScope) {
    var service = {};

    service.select = function(options) {
        var deferred = $q.defer();

        var newScope = $rootScope.$new();

        //TODO: Options: CloseOnSelect, MultiSelect, ...

        newScope.selectedItems = [];
        newScope.filterOptions = {
            filterText: "",
            useExternalFilter: false,
        };

        newScope.title = options.title;
        newScope.crudGridData = options.data;

        var columnDefs = null;
        if (options.columnHeaders) {
            columnDefs = options.columnHeaders.map(function(header) { return { displayName: header }; });
            if (options.data.length > 0) {
                var keys = Object.keys(options.data[0]);
                var cnt = 0;
                keys.forEach(function(key) {
                    if (cnt < columnDefs.length)
                        columnDefs[cnt++].field = key;
                });
            }
        }

        if (options.columnDefs)
            columnDefs = options.columnDefs;

        newScope.itemSelected = function() {
            deferred.resolve(newScope.selectedItems);
        };

        newScope.crudGridOptions = {
            data: 'crudGridData',
            selectedItems: newScope.selectedItems,
            multiSelect: false,
            showFilter: false,
            filterOptions: newScope.filterOptions,
            columnDefs: columnDefs
            //jqueryUITheme: true -> No funciona la selecció
        };

        $modal({ scope: newScope, template: '/Content/awf/views/templates/select-crud.html', show: true });
        return deferred.promise;
    };

    return service;
});


// --------------------------------------------------
// -                awfDesktop  Module              -
// --------------------------------------------------

awfCoreModule.factory('awfDesktop', function (awfCoreConfig, awfAddin) {
    var service = {
        modules : []
    };
        

    service.setStates = function(states, appSettings) {
        states.forEach(function(item) {
            if (item.module) {
                var desktopModule = item.module;
                desktopModule.state = item.name;
                desktopModule.img = appSettings.imagesPath + desktopModule.img;
                desktopModule.name = awfAddin.addinName(item);
                service.modules.push(desktopModule);
            }
        });
    };

    return service; 
});


// --------------------------------------------------
// -                awfAddin  Module                -
// --------------------------------------------------

awfCoreModule.factory('awfAddin', function ($resource, $q, awfCoreConfig, Restangular) {

    var service = {};
        
    //TODO: Move to Restangular 
    service.register = function (addinCode, addinName) {
        var deferred = $q.defer();
        var registerResource = $resource('/api/json/oneway/SystemAddinRegister');
        var registeredAddin = new registerResource({
            code: addinCode,
            description: addinName
        });
        registeredAddin.$save(
            function (result) { deferred.resolve(result); },
            function (error) { deferred.reject(error); });
        return deferred.promise;
    };

    var devicesRest = Restangular.withConfig(function(restangularConfigurer) {
        restangularConfigurer.setBaseUrl('/api/SystemDevices');
    });

    service.devices = {
        scanners: devicesRest.all('Scanners'),
        scanner: function (code) { return devicesRest.one('Scanner', code); },
        weightIndicators: devicesRest.all('WeightIndicators'),
        weightIndicator: function (code) { return devicesRest.one('WeightIndicator', code); },
        printers: devicesRest.all('Printers'),
        printer: function (code) { return devicesRest.one('Printer', code); }
    };

    service.addinName = function (state) {
        return awfCoreConfig.appName + '-' + state.name;
    };

    return service;
});

// --------------------------------------------------
// -               awfReport Service Module         -
// --------------------------------------------------
awfCoreModule.factory('awfReport', function(Restangular) {
    var service = {};

    service.rest = Restangular.withConfig(function(restangularConfigurer) {
        restangularConfigurer.setBaseUrl('/api/SystemReport');
    });

    function reportData(parameters) {
        return this.post('Data',parameters);
    }
    
    function parameterLookupData(code) {
        return this.one('LookupData', code);
    }

    function reportParameters() {
        var res = this.all('Parameters');
        res.lookupData = parameterLookupData;
        return res; 
    }

    service.updateReport = function(report) {
        //TODO: Refactor this backend should be better: We shound do report.patch() ... see Restangular.addRequestInterceptor in awf.js 
        return service.report(report.pk).patch(report);
    };

    service.reports = service.rest.all('Reports');
    service.report = function(pkReport) {
        var res = service.rest.one('Report', pkReport);
        res.parameters = reportParameters;
        res.data = reportData;
        
        return res; 
    };

    return service; 
}); 

// --------------------------------------------------
// -                awfPrint Service Module         -
// --------------------------------------------------
awfCoreModule.factory('awfPrint', function(Restangular) {
    var service = {}; 
    
    service.rest = Restangular.withConfig(function(restangularConfigurer) {
        restangularConfigurer.setBaseUrl('/api/SystemPrint');
    });

    service.formats = service.rest.all('Formats');
    service.format = function (pkFormat) {
        return service.rest.one(pkFormat);
    };
    
    service.sendPrintJob = function() {
        return service.rest.all('SendPrintJob');
    };

    service.jobStatus = function(serverHost, printJobId) {
        return service.rest.one('Host', serverHost).one("JobStatus", printJobId);
    };

    /*service.startPrint = 

    service.PrintJob = function(printerConfig) {
        
    }*/

    service.Printer = function (printerCode) {
        this.currentPrintJob = {
            printerCode: printerCode,
            variables : {}
        };

        this.setPrinterConfig = function(printerConfig) {
            this.currentPrintJob.printerConfig = printerConfig;
        };
        
        this.setFormatCode = function(code) {
            this.currentPrintJob.formatCode = code;
        }; 

        this.setLabelStream = function(label) {
            this.currentPrintJob.format = {
                labelStream : label                      
            }; 
        };

        this.setVariables = function(vars) {
            this.currentPrintJob.variables = vars; 
        };
        //TODO: setVariable, getVariable

        this.send = function () {
            var that = this; 
            return service.sendPrintJob().post(this.currentPrintJob).then(function(result) {
                that.currentPrintJob = result;
            });
        };

        this.startPrint = function () {
            this.currentPrintJob.operation = 'StartPrint';
            return this.send();
        };

        this.print = function (copies) {
            if (!copies)
                copies = 1; 
            this.currentPrintJob.operation = 'Print';
            this.currentPrintJob.Copies = copies;
            return this.send();
        };

        this.endPrint = function() {
            this.currentPrintJob.operation = 'EndPrint';
            return this.send();
        };

        this.status = function () {
            var that = this; 
            return service.jobStatus(this.currentPrintJob.serverHost, this.currentPrintJob.jobId).get().then(function(result) {
                if (result)
                    that.currentPrintJob.status = result; 
            });
        };
    };
    
    return service;
}); 



// --------------------------------------------------
// -                awfAcf Module                   -
// --------------------------------------------------

//TODO: GetFormats 
awfCoreModule.factory('awfAcf', function(awfAddin, $rootScope, Restangular, $q, awfAlert) {
    var acfService = {};

    acfService.devices = {
        printers: [],
        defaultPrinter: {},
        weightIndicators: [],
        defaultWeightIndicator: {},
        scanners: [],
        defaultScanner: {}
    };


    function portTypeFromString(portTypeString) {
        var res = -1; 
        if (portTypeString.indexOf('SerialPort') != -1)
            res = AdaACF.EnPortType.SerialPort;
        else if (portTypeString.indexOf('TcpPort') != -1) 
            res = AdaACF.EnPortType.TcpIpPort;
        else if (portTypeString.indexOf('FilePort') != -1) 
            res = AdaACF.EnPortType.FileChannelPort;
        else if (portTypeString.indexOf('VirtualInputPort') != -1) 
            res = AdaACF.EnPortType.VirtualInputPort;
            
        return res; 
    }

    //Crea un deviceClient per la deviceConfig
    function newDeviceClient(deviceConfig) {
        var deviceClient = new AdaACF.AcfDeviceClient(deviceConfig.serverHost, deviceConfig.serverPort, acfService.debugMode);
        deviceClient.Error = acfService.acfError;
        return deviceClient;
    }
        
    function newPort(deviceConfig) {
        var port = deviceConfig.port;
        port.portType = portTypeFromString(port.__type);
        if (port.portType != -1)
            port.description = AdaACF.PortTypes[port.portType].name;
        return port; 
    }
        
    acfService.acfError = function (description) {
        console.log("ACF Error: ->" + description);
        //$rootScope.showError("ACF Error:" + description);
    };

    acfService.debugMode = false;
    acfService.showLogs = false; 

    acfService.logMessage = function(message) {
        if (acfService.debugMode || acfService.showLogs)
            console.log(message);
    };

    //TODO: Use promises here ?
    acfService.openWeightIndicator = function (deviceConfig) {
        if (deviceConfig.connect) {
            var deviceClient = newDeviceClient(deviceConfig);
            var port = newPort(deviceConfig);
            deviceClient.code = deviceConfig.code;

            deviceClient.receiveHandler = function (result) {
                acfService.logMessage("Weight indicator receive handler(" + deviceClient.code + ")");
                deviceClient.weight = result;
                acfService.logMessage(deviceClient.weight);
                if (deviceClient.onWeight)
                    deviceClient.onWeight(deviceClient.weight);
            };

            acfService.logMessage("Openning weight indicator->");
            acfService.logMessage(deviceConfig);

            try {
                deviceClient.openWeightDevice(port, deviceConfig.intDeviceType, deviceClient.receiveHandler);
                if (acfService.devices.weightIndicators.length == 0)
                    acfService.devices.defaultWeightIndicator = deviceClient;
                acfService.devices.weightIndicators.push(deviceClient);
            } catch (error) {
                awfAlert.error(error); 
            }
        }
    };

    acfService.openPrinterDevice = function(deviceConfig) {
        var deviceClient = newDeviceClient(deviceConfig);
        var port = newPort(deviceConfig);
        if (deviceConfig.connect) {
            try {
                deviceClient.openPrinterDevice(port, deviceConfig.intDeviceType);
                if (acfService.devices.printers.length == 0)
                    acfService.devices.defaultPrinter = deviceClient;
                acfService.devices.printers.push(deviceClient);
            } catch (error) {
                awfAlert.error(error);
            }
        }
    };

    acfService.openScanner = function (deviceConfig) {
        var deviceClient = newDeviceClient(deviceConfig);
        var port = newPort(deviceConfig);
        if (deviceConfig.connect) {
            deviceClient.receiveHandler = function (result) {
                console.log("Default scanner receive handler: " + result);
                deviceClient.scan = result;
                acfService.logMessage(deviceClient.scan);
                if (deviceClient.onScan)
                    deviceClient.onScan(deviceClient.scan);
            };
            try {
                deviceClient.openScannerDevice(port, deviceConfig.intDeviceType);
                if (acfService.devices.scanners.length == 0)
                    acfService.devices.defaultScanner = deviceClient;
                acfService.devices.scanners.push(deviceClient);
            } catch (error) {
                awfAlert.error(error);
            }
        }
    };

    function loadDevices(resource, destination, deviceClass) {
        var promise = resource.getList();
        promise.then(function (result) {
            result.forEach(function (item) {
                item.deviceClass = deviceClass;
                item.port = newPort(item);
                destination.push(item);
            });
        });
        return promise; 

    }

    acfService.EnDeviceClass = {        
        WeightIndicator : { id: 0, description: "Weight Indicator" }, 
        Printer : { id: 1, description: "Printer"}, 
        Scanner : { id: 2, description: "Scanner"}
    };

    acfService.initDevices = function() {
        console.log("Initializing ACF Devices!");
        var promises = [];
        acfService.weightIndicatorsConfig = []; 
        acfService.printersConfig = [];
        acfService.scannersConfig = [];
        
        promises.push(loadDevices(awfAddin.devices.weightIndicators, acfService.weightIndicatorsConfig, acfService.EnDeviceClass.WeightIndicator));
        promises.push(loadDevices(awfAddin.devices.printers, acfService.printersConfig, acfService.EnDeviceClass.Printer ));
        promises.push(loadDevices(awfAddin.devices.scanners, acfService.scannersConfig, acfService.EnDeviceClass.Scanner ));

        $q.all(promises).then(function () {
            acfService.weightIndicatorsConfig.forEach(acfService.openWeightIndicator);
            //acfService.printersConfig.forEach(acfService.openPrinterDevice); (Printers now use PrintSpool Only)
            acfService.scannersConfig.forEach(acfService.openScanner);
            acfService.devicesInitialized = true;
            $rootScope.$broadcast('onDevicesInitialized');
        });
        


        //TODO: Utilitzar Promises ?
/*        awfAddin.devices.queryWeightIndicatorsConfig(function(weightIndicators) {
            weightIndicators.forEach(acfService.openWeightIndicator);
            awfAddin.devices.queryPrintersConfig(function(printers) {
                printers.forEach(acfService.openPrinterDevice);
                awfAddin.devices.queryScannersConfig(function(scanners) {
                    scanners.forEach(acfService.openScanner);
                    acfService.devicesInitialized = true;
                    $rootScope.$broadcast('onDevicesInitialized');
                });
            });
        });*/
    };
        
    acfService.whenDevicesInitialized = function (handler) {
        if (acfService.devicesInitialized)
            handler();
        else
            $rootScope.$on('onDevicesInitialized', handler);
    };

    return acfService; 
});


// --------------------------------------------------
// -                awfUtils Module                 -
// --------------------------------------------------

awfCoreModule.factory('awfUtils', function () {
    var utils = {};
        
    utils.formatJsonDate = function (jsonDate, format) {
        if (format == undefined)
            format = "L";
        return moment(jsonDate).format(format);
    };
        
    //http://www.december.com/html/spec/esccodes.html
    utils.excapedUrlParam = function (urlParam) {
        return urlParam.replace("/", "%2F");
    };

    utils.unescapedUrlParam = function (urlParam) {
        return urlParam.replace("%2F", "/");
    };

    return utils;
});


// --------------------------------------------------
// -                awfBootstrap Module             -
// --------------------------------------------------

awfCoreModule.factory('awfBootstrap', function ($rootScope, $state, awfDesktop, awfSession, awfAddin, awfAcf, awfCoreConfig) {
    var bootstrap = {};

    function initLocales() {
        moment.lang('es');

        $rootScope.dateRangePickerLocale = {
            applyLabel: 'Aplicar',
            cancelLabel: 'Cancelar',
            fromLabel: 'Desde',
            toLabel: 'Fins',
            weekLabel: 'S',
            customRangeLabel: 'Rang a mida',
            daysOfWeek: moment()._lang._weekdaysMin.slice(),
            monthNames: moment()._lang._monthsShort.slice(),
            firstDay: 1
        };

        /*<!-- You can use the global $strapConfig to set defaults -->
        app.value('$strapConfig', {
            datepicker: {
                language: 'fr',
                format: 'M d, yyyy'
            }
        });*/
    }

    function registerModule(module) {
        console.log("Registering module", module);
        //awfAddin.register(module.name, module.title);
    }

    bootstrap.login = function () {
        awfSession.login(function () {
            console.log("Logged in");

            awfDesktop.modules.forEach(function (module) {
                if (module.dbRegister)
                    registerModule(module);

            });
            if (awfCoreConfig.useDevices)
                awfAcf.initDevices();


            //TODO: Register all modules with dbRegister = true (See states)
        });
    };

    bootstrap.init = function(doLogin) {
        console.log("Bootstrapping AWF.");
        console.log("App name is:" + awfCoreConfig.appName);
        initLocales();
        bootstrap.login();
        $rootScope.$state = $state;
    };

    return bootstrap;

});
