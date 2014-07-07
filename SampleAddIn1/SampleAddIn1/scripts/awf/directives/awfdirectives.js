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

/* AWF Directives */

angular.module('awfDirectives', []).
    directive('myLoadingSpinner', function() {
        return {
            restrict: 'A',
            replace: true,
            transclude: true,
            scope: {
                loading: '=myLoadingSpinner'
            },
            templateUrl: 'templates/loading.html',
            link: function(scope, element, attrs) {
                var spinner = new Spinner().spin();
                var loadingContainer = element.find('.my-loading-spinner-container')[0];
                loadingContainer.appendChild(spinner.el);
            }
        };
    })
    .directive('file', function() {
        return {
            scope: {
                file: '='
            },
            link: function(scope, el, attrs) {
                el.bind('change', function(event) {
                    var files = event.target.files;
                    var file = files[0];
                    scope.file = file ? file : undefined;
                    scope.$apply();
                });
            }
        };
    })
//DEPRECATED
    .directive("controlGroup", function() {
        //See also: http://aboutcode.net/2013/07/13/twitter-bootstrap-control-group-directive-for-angularjs.html
        return {
            template: '<div class="control-group">\
                    <label class="control-label" for="{{for}}">{{label}}</label>\
                    <div class="controls" ng-transclude></div>\
                </div>',

            replace: true,
            transclude: true,

            scope: {
                label: "@" // Gets the string contents of the `label` attribute.
            },

            link: function(scope, element) {
                // The <label> should have a `for` attribute that links it to the input.
                // Get the `id` attribute from the input element
                // and add it to the scope so our template can access it.
                var id = element.find(":input").attr("id");
                scope.for = id;
            }
        };
    })
    //Syntax Hightlight dels pre
    .directive('prettyprint', function() {
        return {
            restrict: 'C',
            link: function postLink(scope, element, attrs) {
                element.html(prettyPrintOne(element[0].innerHTML, undefined, true));
            }
        };
    })
    .directive('awfShowonhoverparent',
        function() {
            return {
                link: function(scope, element, attrs) {
                    element.hide();
                    element.parent().bind('mouseenter', function() {
                        element.show();
                    });
                    element.parent().bind('mouseleave', function() {
                        element.hide();
                    });
                }
            };
        })
    .directive('awfInitFocus', function() {
        return {
            restrict: 'A', // only activate on element attribute
            link: function(scope, element, attrs) {
                element.focus();
                /*element.bind('click', function() {
                    this.select();
                });*/
                /*$(element).on('click', function() {
                    $(this).select();
                });*/
            }
        };
    })
    .directive('awfSelectOnClick', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                    this.select();
                });
                /*Using jquery:  $(element).on('click', function() {
                    $(this).select();
                });*/
            }
        };
    })
    .directive('awfWeightDisplay', function(awfAcf, $rootScope) {
        var currentScope; 

        var configDefaults = {
            units: 'Kg',
            showTareControls: true,
            showAcceptButton: true,
            numDecimals: 2,
            allowManualInput: true
            /*
            darkBackground: true,
            allowConfigure: false,
            statusIndicator: true,
            showConfig: true,
            allowManualInput: true*/
        };
        
        function setConfigDefaults(config) {
            Object.keys(configDefaults).forEach(function(key) {
                if (config[key] == undefined)
                    config[key] = configDefaults[key];
            });
        }
        
        function getConfigAttributes(attrs, config) {
            angular.forEach([
                       'units',
                       'showTareControls',
                       'showAcceptButton',
                       'allowManualInput',
                       'numDecimals'
            ], function (key) {
                if (angular.isDefined(attrs[key]))
                    config[key] = attrs[key];
            });
        }
        
        function init(scope) {
            scope.currentTare = 0; 
        }

        var directive = {
            restrict: 'A',
            scope: {
                code: '=',
                weight: '=ngModel',
                onAccept: '&onAccept',
                mConfig: '=awfWeightDisplay'
            },
            templateUrl: '/awf-directives/weight-display.tpl.html',
            link: function (scope, element, attrs) {
                init(scope);

                currentScope = scope;
                initWeightIndicator();

                scope.onWeightAccepted = function () {
                    scope.onAccept({ weight: scope.weight });
                };

                if (attrs.awfWeightDisplay)
                    scope.config = scope.mConfig;
                else
                    scope.config = {};
                setConfigDefaults(scope.config);
                getConfigAttributes(attrs, scope.config);
            },
        };


        function weightReceived(weight) {
            currentScope.weight = weight;
            currentScope.$apply('weight');
        }
        
        function initWeightIndicator() {

            if (!awfAcf.devicesInitialized) {
                awfAcf.whenDevicesInitialized(initWeightIndicator);
                return;
            }

            if (awfAcf.devices.weightIndicators.length == 0 || awfAcf.devices.defaultWeightIndicator == undefined)
                return;

            var wi = awfAcf.devices.defaultWeightIndicator;
            wi.onWeight = weightReceived;
        }


        return directive; 
    })
    .directive('awfDeviceConfig', function () {
        var directive = {
            restrict: 'A',
            scope: {
                config: '=ngModel',
                readOnly: '@'
            },
            templateUrl: '/awf-directives/device-config.tpl.html',
            link: function (scope, element, attrs) {

                if (!attrs.buttonClass)
                    scope.buttonClass = "btn btn-link btn-lg white";
                else
                    scope.buttonClass = attrs.buttonClass; 
            }
        };
        return directive;
    })
    .directive('awfLed', function() {
        var directive = {
            restrict: 'A',
            scope: {
                status: '=ngModel'
            },
            templateUrl: '/awf-directives/led.tpl.html',
            link: function (scope, element, attrs) {
                scope.ledClass = function() {
                    var res = 'awf-led';
                    if (scope.status)
                        res += ' green';
                    else
                        res += ' red';

                    return res;
                };
            }
        };
        return directive; 
    })
    .directive('awfWeightIndicator', function (awfAcf) {

        var configDefaults = {
            darkBackground: true,
            allowConfigure: false,
            showStatus: true,
            showConfig: true,
        };

        function setConfigDefaults(config) {
            Object.keys(configDefaults).forEach(function (key) {
                if (config[key] == undefined)
                    config[key] = configDefaults[key];
            });
        }

        function getConfigAttributes(attrs, config) {
            angular.forEach([
                       'darkBackground',
                       'showStatus',
                       'showConfig',
                       'allowConfigure'
            ], function (key) {
                if (angular.isDefined(attrs[key]))
                    config[key] = attrs[key];
            });
        }
        
        
        function initDevices(scope) {
            //TODO: S'ha d'agafar el del codi.
            scope.defaultWeightIndicatorConfig = awfAcf.weightIndicatorsConfig[0];
            scope.defaultWeightIndicator = awfAcf.devices.defaultWeightIndicator;
        }

        var directive = {
            restrict: 'A',
            scope: {
                code: '=',
                weight: '=ngModel',
                onAccept: '&onAccept',
                mConfig: '=awfWeightIndicator'
            },
            templateUrl: '/awf-directives/weight-indicator.tpl.html',
            link: function (scope, element, attrs) {

                scope.$on('onDevicesInitialized', function() {
                    initDevices(scope);
                } );

                scope.onWeightAccepted = function (weight) {
                    scope.onAccept({ weight: weight });
                };
                
                if (attrs.awfWeightIndicator)
                    scope.config = scope.mConfig;
                else 
                    scope.config = {};
                setConfigDefaults(scope.config);
                getConfigAttributes(attrs, scope.config);
            }
        };

        return directive;
    })
    .directive('awfLabelPrinter', function (awfAcf) {

        var configDefaults = {
            darkBackground: true,
            allowConfigure: false,
            showStatus: true,
            showConfig: true,
        };

        function setConfigDefaults(config) {
            Object.keys(configDefaults).forEach(function (key) {
                if (config[key] == undefined)
                    config[key] = configDefaults[key];
            });
        }

        function getConfigAttributes(attrs, config) {
            angular.forEach([
                       'darkBackground',
                       'showStatus',
                       'showConfig',
                       'allowConfigure'
            ], function (key) {
                if (angular.isDefined(attrs[key]))
                    config[key] = attrs[key];
            });
        }

        var printStatus = {
            Idle: 0,
            Printing: 1,
            PrintError: 2,
            NonConnected: 3
        };

        function initDevices(scope) {
            //TODO: S'ha d'agafar el del codi.
            scope.defaultPrinterConfig = awfAcf.printersConfig[0];
            console.log("Printer Config", scope.defaultPrinterConfig);
            scope.printStatus = printStatus.Idle;
            
            scope.ledIndicatorOn = true; //Temporal
        }

        var directive = {
            restrict: 'A',
            scope: {
                code: '=',
                mConfig: '=awfLabelPrinter'
            },
            templateUrl: '/awf-directives/label-printer.tpl.html',
            link: function (scope, element, attrs) {

                scope.printStatus = printStatus.NonConnected;
                
                scope.$on('onDevicesInitialized', function () {
                    initDevices(scope);
                });


                if (attrs.awfLabelPrinter)
                    scope.config = scope.mConfig;
                else
                    scope.config = {};
                setConfigDefaults(scope.config);
                getConfigAttributes(attrs, scope.config);
            }
        };

        return directive;
    })
    .directive('awfReportParameterEditor', function ($compile, $http, $templateCache) {
        var getTemplate = function (metadata) {
            var templateLoader, baseUrl = '/awf-directives/parameter-editor/';
            console.log("Got parameter of type", metadata.type); 
            var templateMap = {                
                TypeDescription: 'text.tpl.html',
                TypePk : 'text.tpl.html',
                TypeCode : 'text.tpl.html',
                TypeDate: 'datetime.tpl.html',
                TypeDateTime : 'datetime.tpl.html',
                TypeTime : 'datetime.tpl.html',
                TypeText : 'text.tpl.html',
                TypeLongString : 'text.tpl.html',
                TypeString : 'text.tpl.html',
                TypeShortString : 'text.tpl.html',
                TypeChar : 'text.tpl.html',
                TypeBoolean : 'boolean.tpl.html',
                TypeInt : 'numeric-int.tpl.html',
                TypeDecimal : 'numeric-double.tpl.html',
                TypeCurrency : 'numeric-currency.tpl.html',
                TypePercent : 'percent.tpl.html',
                TypeCcc : 'ccc.tpl.html',
                TypeImage : 'image.tpl.html',
                TypeContentImage : 'image.tpl.html',
                TypeColor : 'color.tpl.html',
                TypeBinary : 'boolean.tpl.html',
                TypeLink: 'link.tpl.html',
                TypeWww: 'text.tpl.html',
                TypeEmail: 'text.tpl.html',
                TypeFkJer: 'fk.tpl.html',
                TypeFkDomain : 'fk-domain.tpl.html',
                TypeEnum: 'text.tpl.html',
                TypeContentDocument: 'document.tpl.html',
                TypeRating : 'rating.tpl.html'
            };

            var templateUrl = baseUrl + templateMap[metadata.type];
            templateLoader = $http.get(templateUrl, { cache: $templateCache });
            return templateLoader;
        };

        var linker = function(scope, element, attrs) {
            scope.parameter.value = scope.parameter.defaultValue; 
            var loader = getTemplate(scope.parameter.element);

            var promise = loader.success(function(html) {
                element.html(html);
            }).then(function(response) {
                element.replaceWith($compile(element.html())(scope));
            });
        };

        var directive = {
            restrict: 'E',
            scope: {
                parameter: '=',
                parameterChanged: "&onChanged"
            },
            link: linker
        };
        return directive; 

    });


