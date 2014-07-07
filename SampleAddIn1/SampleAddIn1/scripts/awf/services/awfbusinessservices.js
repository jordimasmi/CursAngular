/****************************************************************************
**
** Copyright (C) 2008-2014 Delsys ADA, S.L. Todos los derechos reservados.
**
** Este archivo es parte de la suite Delsys ADA.
**
** Este código es propiedad de Delsys ADA, S.L y queda prohibida su distribución
** copia o modificación sin el permiso expreso de Delsys ADA, S.L.
**
** Autor: jfernandez@delsys.net, qpascual@delsys.net, qfeixas@delsys.net
**
****************************************************************************/
'use strict';

var awfBusinessModule = angular.module('awfBusiness', ['restangular']);

// --------------------------------------------------
// -                  Diet services                 -
// --------------------------------------------------

awfBusinessModule.factory('menusService', function ($resource, $q, $rootScope, Restangular) {

    var service = {};

    service.rest = Restangular.withConfig(function (restangularConfigurer) {
        restangularConfigurer.setBaseUrl('api/BusinessDiet');
    });

    function copyItem(destination, copyArticles) {
        return this.post("Copy", destination, { CopiarArticulos: copyArticles });
    };

    function updateItemsOrden(childItems) {
        return this.post("UpdateItemsOrden", childItems);
    };

    function articuloMenu(pkMenuItemArticulo) {
        var res = this.one('Articulo', pkMenuItemArticulo);
        return res;
    }

    function tipoPlatoMenu(pkTipoPlato) {
        var res = this.one('TipoPlato', pkTipoPlato);
        res.articulos = res.all('Articulos');
        res.articulo = articuloMenu;
        res.copyTo = copyItem;
        return res;
    }

    function ingestaMenu(pkIngesta) {
        var res = this.one('Ingesta', pkIngesta);
        res.tiposPlato = res.all('TiposPlato');
        res.tipoPlato = tipoPlatoMenu;
        res.copyTo = copyItem;
        res.updateItemsOrden = updateItemsOrden;
        return res;
    }

    function dietaDia(pkDieta) {
        var res = this.one('Dieta', pkDieta);
        res.ingestas = res.all('Ingestas');
        res.ingesta = ingestaMenu;
        res.updateItemsOrden = updateItemsOrden;
        return res;
    }

    function diaMenu(pkDia) {
        var res = this.one('Dia', pkDia);
        res.dieta = dietaDia;
        res.copyTo = copyItem;
        return res;
    }

    function dietaMenu(pkDieta) {
        var res = this.one('Dieta', pkDieta);
        res.copyTo = copyItem;
        return res;
    }

    service.menu = function (pkMenu) {
        var res = service.rest.one('Menu', pkMenu);
        res.dias = res.all('Dias');
        res.dia = diaMenu;
        res.dietas = res.all('Dietas');
        res.dieta = dietaMenu;
        res.copyTo = copyItem;
        return res;
    };

    //TODO: Pillar-ho de resources.
    service.menus = service.rest.all('Menus');
    service.dietas = service.rest.all('Dietas');
    service.dias = service.rest.all('Dias');
    service.ingestas = service.rest.all('Ingestas');
    service.articulos = service.rest.all('Articulos');
    service.tiposPlato = service.rest.all('TiposPlato');

    return service;
});

// --------------------------------------------------
// -                Core services                -
// --------------------------------------------------

awfBusinessModule.factory('coreService', function ($resource, $q, awfCoreConfig, Restangular) {

    var service = {};
    service.rest = Restangular.withConfig(function (restangularConfigurer) {
        restangularConfigurer.setBaseUrl('api/BusinessCore');
    });

    service.escritorios = service.rest.all('Escritorios');
    service.setActiveEscritorio = function(codigo) {
        return service.escritorios.post({ codigo: codigo });
    };

    return service;
});


awfBusinessModule.factory('coreUserRolesService', function ($resource, $q, awfCoreConfig, Restangular) {

    var service = {};
    service.rest = Restangular.withConfig(function (restangularConfigurer) {
        restangularConfigurer.setBaseUrl('api/BusinessCore/Permisos');
    });
    
    function setUsuarioRole(pkRole) {
        return this.one('AppRol', pkRole).post(); 
    }
    
    function saveUsuarioRoles(pkRoleList) {
        return this.appRoles.post({ "AppRols": pkRoleList });
    }

    service.usuarios = service.rest.all('Usuarios');
    service.usuario = function(pkUsuario) {
        var res = service.rest.one('Usuario', pkUsuario);
        res.appRoles = res.all('AppRols');
        res.setRole = setUsuarioRole;
        res.saveRoles = saveUsuarioRoles;
        return res; 
    };
    service.appRoles = service.rest.all('AppRols');

    return service;
});


// --------------------------------------------------
// -                Common  Services                -
// --------------------------------------------------

awfBusinessModule.factory('commonService', function (Restangular) {
    var baseEntidades = Restangular.all('api/BusinessCommon').all('Entidades');
    var service = {};

    service.getProveedores = function () {
        return baseEntidades.one('Proveedores').get();
    };

    service.getOrigenesProveedor = function (pkProveedor) {
        return baseEntidades.one('Proveedor', pkProveedor).one('Origenes').get();
    };

    return service;
});

// --------------------------------------------------
// -                Trace   Services                -
// --------------------------------------------------

awfBusinessModule.factory('recepcionsService', function (Restangular) {
    var base = Restangular.all('api/BusinessTrace').all('Recepciones');
    var service = {};

    service.getProveedores = function (startDate, endDate) {
        return base.one('Proveedores').get({ startDate: startDate, endDate: endDate });
    };

    service.getPedidosProveedor = function (pkProveedor, startDate, endDate) {
        return base.one('Pedidos').get({ pkProveedor: pkProveedor, startDate: startDate, endDate: endDate });
    };

    service.createRecepcion = function (pkDocumento) {
        return base.one('Pedido', pkDocumento).one('Recepciones').post();
    };

    service.updatePedido = function(pedido) {
        return base.one('Pedido', pedido.pk).patch(pedido);
    };

    service.updateRecepcion = function (recepcion) {
        return base.one('Pedido', recepcion.documentoOrigen.pk).one('Recepcion', recepcion.pk).patch(recepcion);
    };

    service.getRecepcionesPedido = function (pkDocumento) {
        return base.one('Pedido', pkDocumento).one('Recepciones').get();
    };

    service.getLineasPedido = function (pkDocumento) {
        return base.one('Pedido', pkDocumento).one('Lineas').get();
    };

    service.getLineasRecepcion = function (pkDocumento, pkRecepcion) {
        return base.one('Pedido', pkDocumento).one('Recepcion', pkRecepcion).one('Lineas').get();
    };

    service.getLineaRecepcion = function (pkDocumento, pkRecepcion, pkLinea) {
        return base.one('Pedido', pkDocumento).one('Recepcion', pkRecepcion).one('Lineas').get({ pkLinea: pkLinea });
    };

    service.newLoteCaducidadTeorica = function (pkArticulo) {
        return base.one('NewLoteCaducidadTeorico').get({ pkArticulo: pkArticulo });
    };

    service.newLote = function (fechaCaducidad) {
        return base.one('NewLote').get({ fechaCaducidad: fechaCaducidad });
    };

    service.createLineaRecepcion = function (pkDocumento, pkRecepcion, pkLineaPedido) {
        return base.one('Pedido', pkDocumento).one('Recepcion', pkRecepcion).one('Lineas').post('', { pkLineaPedido: pkLineaPedido });
    };

    service.updateLineaRecepcion = function (pkDocumento, pkRecepcion, lineaRecepcion) {
        return base.one('Pedido', pkDocumento).one('Recepcion', pkRecepcion).one('Linea', lineaRecepcion.pk).patch(lineaRecepcion);
    };

    service.deleteLineaRecepcion = function (pkDocumento, pkRecepcion, pkLineaRecepcion) {
        return base.one('Pedido', pkDocumento).one('Recepcion', pkRecepcion).one('Linea', pkLineaRecepcion).remove();
    };

    service.createPesada = function (pkDocumento, pkRecepcion, pkLinea, cantidadTransaccion, printJob) {
        return base.one('Pedido', pkDocumento).one('Recepcion', pkRecepcion).one('Linea', pkLinea).one('Pesadas').post('', { cantidadTransaccion: cantidadTransaccion, printJob: printJob });
    };

    service.deletePesada = function (pkDocumento, pkRecepcion, pkLinea, pkPesada) {
        return base.one('Pedido', pkDocumento).one('Recepcion', pkRecepcion).one('Linea', pkLinea).one('Pesada', pkPesada).remove();
    };

    service.getPesadas = function (pkDocumento, pkRecepcion, pkLineaRecepcion) {
        return base.one('Pedido', pkDocumento).one('Recepcion', pkRecepcion).one('Linea', pkLineaRecepcion).one('Pesadas').get();
    };

    service.cambioLote = function (pkDocumento, pkRecepcion, pkLineaPedido, fechaCaducidad, loteProveedor) {
        return base.one('Pedido', pkDocumento).one('Recepcion', pkRecepcion).one('CambioLote').post('', { pkLineaPedido: pkLineaPedido, fechaCaducidad: fechaCaducidad, loteProveedor: loteProveedor });
    };

    service.convertir = function (pkFormula, cantidad, unidadDeseada) {
        return Restangular.one('api/BusinessCore').one('Convertir').post('', { pkFormula: pkFormula, cantidad: cantidad, unidadDeseada: unidadDeseada });
    };

    service.finalizarLinea = function (pkDocumento, pkLinea) {
        return base.one('Pedido', pkDocumento).one('Linea', pkLinea).patch();
    };

    service.initPrintRecepcion = function (pkDocumento, pkRecepcion) {
        return base.one('Pedido', pkDocumento).one('Recepcion', pkRecepcion).post('InitPrint');
    };

    service.initPrintLinea = function (pkDocumento, pkRecepcion, pkLinea, printJob) {
        return base.one('Pedido', pkDocumento).one('Recepcion', pkRecepcion).one('Linea', pkLinea).post('InitPrint', { printJob: printJob });
    };

    service.endPrint = function (pkDocumento, pkRecepcion, printJob) {
        return base.one('Pedido', pkDocumento).one('Recepcion', pkRecepcion).post('EndPrint', { printJob: printJob });
    };

    service.reprint = function (pkDocumento, pkRecepcion, pkLinea, pkPesada, printJob) {
        return base.one('Pedido', pkDocumento).one('Recepcion', pkRecepcion).one('Linea', pkLinea).one('Pesada', pkPesada).post('Reprint', { printJob: printJob });
    };

    return service;
});

awfBusinessModule.factory('traceComprasService', function (Restangular) {
    var base = Restangular.all('api/BusinessTrace').all('Compras');
    var service = {};

    // ***** DOCUMENTO *****
    service.getDocumentosCompra = function (startDate, endDate) {
        return base.one('Pedidos').get({ startDate: startDate, endDate: endDate });
    };

    service.createDocumentoCompra = function (pkProveedor, pkOrigen, fechaPrevista) {
        return base.one('Pedidos').post('', { pkProveedor: pkProveedor, pkOrigen: pkOrigen, fechaPrevista: fechaPrevista });
    };

    service.getDocumentoCompra = function (pkDocumento) {
        return base.one('Pedido', pkDocumento).get();
    };

    service.updateDocumentoCompra = function (documento) {
        return base.one('Pedido', documento.pk).patch(documento);
    };

    service.borrarDocumentoCompra = function (pkDocumento) {
        return base.one('Pedido', pkDocumento).remove();
    };


    // ***** LINEAS DOCUMENTO *****
    service.getLineasDocumento = function (pkDocumento) {
        return base.one('Pedido', pkDocumento).one('Lineas').get();
    };

    service.createLineaDocumento = function (pkDocumento, pkArticulo, cantidad) {
        return base.one('Pedido', pkDocumento).one('Lineas').post('', { pkArticulo: pkArticulo, cantidad: cantidad });
    };

    service.borrarLineaDocumento = function (pkDocumento, pkLinea) {
        return base.one('Pedido', pkDocumento).one('Linea', pkLinea).remove();
    };

    service.borrarLineasDocumento = function (pkDocumento) {
        return base.one('Pedido', pkDocumento).one('Lineas').remove();
    };

    service.updateLineaDocumento = function (pkDocumento, linea) {
        return base.one('Pedido', pkDocumento).one('Linea', linea.pk).patch(linea);
    };

    service.getLineaDocumento = function (pkDocumento, pkLinea) {
        return base.one('Pedido', pkDocumento).one('Linea', pkLinea).get();
    };

    return service;
});

// --------------------------------------------------
// -                Trade   Services                -
// --------------------------------------------------

awfBusinessModule.factory('tradeService', function (Restangular) {
    var base = Restangular.all('api/BusinessTrade');
    var service = {};

    service.getCentros = function () {
        return base.one('CentrosCoste').get();
    };

    service.getArticulosProveedor = function (pkProveedor) {
        return base.one('Compras').one('Articulos').get({ pkProveedor: pkProveedor });
    };

    return service;
});

awfApp.factory('awfBusinessTrade', function (Restangular) {
    
    var service = {};
    service.rest = Restangular.withConfig(function (restangularConfigurer) {
        restangularConfigurer.setBaseUrl('api/BusinessTrade');
    });
    
    service.centros = service.rest.all('CentrosCoste');

    return service;
});

awfApp.factory('awfBusinessDiet', function (Restangular) {

    var service = {};
    service.rest = Restangular.withConfig(function (restangularConfigurer) {
        restangularConfigurer.setBaseUrl('api/BusinessDiet');
    });
    var serviceCommon = {};
    serviceCommon.rest = Restangular.withConfig(function (restangularConfigurer) {
        restangularConfigurer.setBaseUrl('api/BusinessDiet/Common');
    });

    service.dietas = service.rest.all('Dietas');
    service.dias = service.rest.all('Dias');
    service.ingestas = service.rest.all('Ingestas');
    
    service.common = {};
    service.common.tipoDietas = serviceCommon.rest.all('TipoDietas');

    return service;
});

awfApp.factory('awfBusinessTradeModelos', function (Restangular) {
    
    var service = {};

    service.rest = Restangular.withConfig(function (restangularConfigurer) {
        restangularConfigurer.setBaseUrl('api/BusinessTrade/Modelos');
    });

    service.modelos = service.rest.all('Modelos');
    service.modelo = function(pkModelo) {
        var res = service.rest.one('Modelo', pkModelo);
        res.items = res.all('Items'); //.get({ pkDia: pkDia, pkIngesta: pkIngesta, pkCentro: pkCentro });
        res.item = res.one('Item');
        return res;
    };

    return service;
});

awfApp.factory('awfBusinessCoreEstructuras', function (Restangular) {

    var service = {};

    service.rest = Restangular.withConfig(function (restangularConfigurer) {
        restangularConfigurer.setBaseUrl('/api/BusinessCore/Estructuras');
    });

    service.fisicas = service.rest.all('Fisicas');
    service.logicas = service.rest.all('Logicas');
    service.fisica = function (pkFisica) {
        var res = service.rest.one('Fisica', pkFisica);
        res.logicas = res.all('Logicas');
        return res;
    };
    service.logica = function (pkLogica) {
        var res = service.rest.one('Logica', pkLogica);
        res.fisicas = res.all('Fisicas');
        return res;
    };

    return service;
});