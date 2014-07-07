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

awfApp.controller('moduleGestioStockController', function ($scope, magatzemService, awfError) {


    function loadArticulos() {
        magatzemService.articulos.getList().then(function(articulos) {
            $scope.data.articulos = articulos;
            $scope.data.selectedArticles[0] = $scope.data.articulos[0];
        });
    }

    $scope.loadArticulosClick = function() {
        loadArticulos();
    };
    
    $scope.$watch('view.currentArticulo', function () {
        $scope.data.datosArticuloSeleccionado = _.find($scope.data.articulos, function(articuloSeleccionado) {
            return articuloSeleccionado.pk === $scope.view.currentArticulo;
        });
    });

   /*
    $scope.$watch('view.currentArticulo', function () {
        alert('hey, myVar has changed!');
    });
    */

    function init() {
        //Form Objects
        $scope.form = {
            title: 'Pantalla de Gestió Stock'
        };

        //Variables referents a la vista
        $scope.view = {
            activeTab: 0,
            currentArticulo: null
        };

        //Data Objects
        $scope.data = {
            selectedArticles: []
          
        };
        
        $scope.view.tabs = [
              {
                  "title": "Magatzems",
                  "template": "Content/app/views/magatzemTab.html"
              },
              {
                  "title": "Articles",
                  "template": "Content/app/views/articlesTab.html"
              },
              {
                  "title": "Inventari",
                  "template": "Content/app/views/inventariTab.html"
              }
        ];

        $scope.form.gridOptions = {
            data: 'data.articulos',
            multiSelect: false,
            selectedItems: $scope.data.selectedArticles,
            columnDefs: [
                { field: 'code', displayName: 'Código' },
                { field: 'description', displayName: 'Descripción' }
            ]
        };

        
        $scope.view.select2Options = {
            allowClear: true,
            width: '300px' //'300px' //'element'
        };

        $scope.data.range = [
            { value: "1", text: "One" },
            { value: "2", text: "Two" },
            { value: "3", text: "Three" }
        ];

    }
    init();
           
});
