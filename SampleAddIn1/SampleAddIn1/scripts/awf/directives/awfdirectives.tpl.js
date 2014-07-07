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


awfApp.run(['$templateCache', function($templateCache) {
    $templateCache.put('/awf-directives/weight-display.tpl.html',
        '<div class="weight-indicator"><div class="controls" ng-show="config.showTareControls"><button class="btn btn-success" >Tara</button><button class="btn btn-default">Man</button><span>{{currentTare | number:config.numDecimals}} {{config.units}}</span></div><div class="display"><span>{{weight.WeightValue | number:config.numDecimals}} {{config.units}}</span><button ng-click="onWeightAccepted()" ng-show="config.showAcceptButton" class="btn btn-primary btn-lg"><span class="glyphicon glyphicon-thumbs-up"></span></button></div></div>'
    );

    $templateCache.put('/awf-directives/device-config.tpl.html',
        '<div class="device-config" ><button type="button" data-placement="right" class="{{buttonClass}}" data-template="Content/awf/views/templates/device-config.html" data-animation="am-flip-x" bs-popover=""><span class="glyphicon glyphicon-th-list"></span></button></div>'
    );

    $templateCache.put('/awf-directives/led.tpl.html',
        '<span ng-class="ledClass()" ></span>'
    );

    $templateCache.put('/awf-directives/weight-indicator.tpl.html',
        '<div class="weight-indicator-container"><span ng-show="config.showConfig" style="margin:5px;float: left;" ng-model="defaultWeightIndicatorConfig" awf-device-config></span><span style="width:83%;display: inline-block;" on-accept="onWeightAccepted(weight)" ng-model="weight" awf-weight-display="config.display"></span><span ng-show="config.showStatus" style="float: right; margin-top:5px;margin-right: 5px;" ng-model="defaultWeightIndicator.isConnected" awf-led></span></div>'
    );

    $templateCache.put('/awf-directives/label-printer.tpl.html',
        '<div class="label-printer-container"><span ng-show="config.showConfig" style="margin:5px;float: left;" ng-model="defaultPrinterConfig" awf-device-config></span><span style="display: inline-block;" ><img src="/Content/awf/images/printer-icon.png" ></img> </span><span ng-show="config.showStatus" style="float: right; margin-top:5px;margin-right: 5px;" ng-model="ledIndicatorOn" awf-led></span></div>'
    );

    $templateCache.put('/awf-directives/parameter-editor/text.tpl.html',
        '<input ng-change="parameterChanged()" class="form-control" ng-model="parameter.value" type="text" >'
    );
    $templateCache.put('/awf-directives/parameter-editor/datetime.tpl.html',
        '<input ng-change="parameterChanged()"  class="form-control" ng-model="parameter.value" type="text" bs-datepicker>'
    );


}]);







