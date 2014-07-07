/****************************************************************************
**
** Copyright (C) 2008-2011 Delsys ADA, S.L. Todos los derechos reservados.
**
** Este archivo es parte de la suite Delsys ADA.
**
** Este código es propiedad de Delsys ADA, S.L y queda prohibida su distribución
** copia o modificación sin el permiso expreso de Delsys ADA, S.L.
**
** Autor: jfernandez@delsys.net
**
****************************************************************************/

// Ada ACF Javascript client using webSockets. Requires modernizr and Alchemy
//TODO: 
// Device default ports: 
// - Ohaus Navigator XT: 9761
// - GiroPes: 3001
// - Printers: 9100 
// - Kbs LightsController: R 4100, W 4101

// Controlar errors.

AdaACF = {};

AdaACF.EnPortType = {
    SerialPort: 0,
    TcpIpPort: 1,
    VirtualInputPort: 2,
    FileChannelPort: 3,
    FtpChannelPort: 4
};

AdaACF.PortTypes = [
    { id: AdaACF.EnPortType.SerialPort, name: "Serial Port" },
    { id: AdaACF.EnPortType.TcpIpPort, name: "TcpIpPort" },
    { id: AdaACF.EnPortType.VirtualInputPort, name: "Virtual Input Port" },
    { id: AdaACF.EnPortType.FileChannelPort, name: "File Channel Port" },
    { id: AdaACF.EnPortType.FtpChannelPort, name: "Ftp Channel Port" }
];

AdaACF.EnRequestType = {
    OpenDevice: 0,
    CloseDevice: 1,
    PrePrintLabel: 2,
    PrintLabel: 3, 
    DisplayStatus: 4,
    DisplayKeyCodes: 5,
    RawDeviceWrite: 6
};

AdaACF.EnResponseType = {
    WeightReaded: 0, 
    KeyPressed : 1,
    BarcodeReaded: 2,
    RawDeviceRead : 3,
    Error : 255
};


/* Devices  */

AdaACF.EnDeviceType = {
    Printer: 0,
    Scanner: 1,
    WeightIndicator: 2,
    LightsController: 3,
    RawDevice : 4
};

AdaACF.EnPrinterType = {
    Intermec501: 0,
    IntermecPM4: 1,
    IntermecPF8: 2,
    CapA4Plus: 3,
    Z6MPlus: 4,
    DataMax: 5,
    Dummy: 6,
    GenericDirectProtocol: 7,
    GenericESimProtocol: 8,
    GenericJScriptProtocol: 9,
    GenericZPLIIProtocol: 10,
    GenericDPLProtocol: 11,
    DelsysDsPassthrough: 12
};

AdaACF.PrinterModels = [
    { id: AdaACF.EnPrinterType.Intermec501, name: "Intermec501" },
    { id: AdaACF.EnPrinterType.IntermecPM4, name: "IntermecPM4" },
    { id: AdaACF.EnPrinterType.IntermecPF8, name: "IntermecPF8" },
    { id: AdaACF.EnPrinterType.CapA4Plus, name: "CapA4Plus" },
    { id: AdaACF.EnPrinterType.Z6MPlus, name: "Z6MPlus" },
    { id: AdaACF.EnPrinterType.DataMax, name: "DataMax" },
    { id: AdaACF.EnPrinterType.Dummy, name: "Dummy" },
    { id: AdaACF.EnPrinterType.GenericDirectProtocol, name: "GenericDirectProtocol" },
    { id: AdaACF.EnPrinterType.GenericESimProtocol, name: "GenericESimProtocol" },
    { id: AdaACF.EnPrinterType.GenericJScriptProtocol, name: "GenericJScriptProtocol" },
    { id: AdaACF.EnPrinterType.GenericZPLIIProtocol, name: "GenericZPLIIProtocol" },
    { id: AdaACF.EnPrinterType.GenericDPLProtocol, name: "GenericDPLProtocol" },
    { id: AdaACF.EnPrinterType.DelsysDsPassthrough, name: "DelsysDsPassthrough" }
];

AdaACF.EnWeightIndicatorType = {
    Generic : 0,
    Dummy : 1,
    Mobba501 : 2,
    BizerbaBT : 3,
    Smart: 4,
    OhausNavigator: 5,
    Sipi2: 6,
    OhausDefender: 7
};

AdaACF.WeightIndicatorTypes = [
    { id: AdaACF.EnWeightIndicatorType.Generic, name: "Generic (Same as Dummy)" },
    { id: AdaACF.EnWeightIndicatorType.Dummy, name: "Dummy" },
    { id: AdaACF.EnWeightIndicatorType.Mobba501, name: "Mobba501" },
    { id: AdaACF.EnWeightIndicatorType.BizerbaBT, name: "BizerbaBT" },
    { id: AdaACF.EnWeightIndicatorType.Smart, name: "Smart" },
    { id: AdaACF.EnWeightIndicatorType.OhausNavigator, name: "Ohaus Navigator" },
    { id: AdaACF.EnWeightIndicatorType.Sipi2, name: "Sipi II" },
    { id: AdaACF.EnWeightIndicatorType.OhausDefender, name: "Ohaus Defender" }
];


AdaACF.LightsControllerType = {
    Kbs: 0
};

AdaACF.LightsControllerTypes = [
    { id: AdaACF.LightsControllerType.Kbs, name: "KBS" },
];

AdaACF.RawDeviceType = {
    Generic: 0
};

AdaACF.RawDeviceTypes = [
    { id: AdaACF.RawDeviceType.Generic, name: "Generic" },
];


AdaACF.EnScannerType = {
    ScannerGeneric: 0,
    Dummy: 1,
    ScannerCrlf: 2
};

AdaACF.ScannerTypes = [
    { id: AdaACF.EnScannerType.Generic, name: "Generic"},
    { id: AdaACF.EnScannerType.Dummy, name: "Dummy"},
    { id: AdaACF.EnScannerType.ScannerCrlf, name: "ScannerCrlf"}
];


/* Serial Port Config */

AdaACF.EnSpeed = {
    VCustom: 0,
    V000075 : 75,
    V000110 : 110,
    V000134 : 134,
    V000150 : 150,
    V000300 : 300,
    V000600 : 600,
    V001200 : 1200,
    V001800 : 1800,
    V002400 : 2400,
    V004800 : 4800,
    V007200 : 7200,
    V009600 : 9600,
    V014400 : 14400,
    V019200 : 19200,
    V038400 : 38400,
    V057600 : 57600,
    V115200 : 115200,
    V128000 : 128000,
    V230400 : 230400,
    V256000 : 256000,
    V460800 : 460800,
    V921600 : 921600
};

AdaACF.Baudrates = [
    { id: AdaACF.EnSpeed.VCustom, name : "VCustom" },    
    { id: AdaACF.EnSpeed.V000075, name: "V000075" },
    { id: AdaACF.EnSpeed.V000110, name: "V000110" },
    { id: AdaACF.EnSpeed.V000134, name: "V000134" }, 
    { id: AdaACF.EnSpeed.V000150, name: "V000150" },
    { id: AdaACF.EnSpeed.V000300, name: "V000300" },
    { id: AdaACF.EnSpeed.V000600, name: "V000600" },
    { id: AdaACF.EnSpeed.V001200, name: "V001200" },
    { id: AdaACF.EnSpeed.V001800, name: "V001800" },
    { id: AdaACF.EnSpeed.V002400, name: "V002400" },
    { id: AdaACF.EnSpeed.V004800, name: "V004800" },
    { id: AdaACF.EnSpeed.V007200, name: "V007200" },
    { id: AdaACF.EnSpeed.V009600, name: "V009600" },
    { id: AdaACF.EnSpeed.V014400, name: "V014400" },
    { id: AdaACF.EnSpeed.V019200, name: "V019200" },
    { id: AdaACF.EnSpeed.V038400, name: "V038400" },
    { id: AdaACF.EnSpeed.V057600, name: "V057600" },
    { id: AdaACF.EnSpeed.V115200, name: "V115200" },
    { id: AdaACF.EnSpeed.V128000, name: "V128000" },
    { id: AdaACF.EnSpeed.V230400, name: "V230400" },
    { id: AdaACF.EnSpeed.V256000, name: "V256000" },
    { id: AdaACF.EnSpeed.V460800, name: "V460800" },
    { id: AdaACF.EnSpeed.V921600, name: "V921600" }
];

AdaACF.EnParity = {
    PNone: 0,
    PEven : 1,
    POdd : 2,
    PSpace : 3,
    PMark : 4
};

AdaACF.Parities = [
    { id: AdaACF.EnParity.PNone, name: "None" },
    { id: AdaACF.PEven, name: "Even" },
    { id: AdaACF.POdd, name: "Odd" },
    { id: AdaACF.PSpace, name: "Space" },
    { id: AdaACF.PMark, name: "Mark" }
];

AdaACF.EnStopBits = {
    S1Bits: 1,
    S15Bits: 5,
    S2Bits: 2
};

AdaACF.stopBits = [
    { id: AdaACF.EnStopBits.S1Bits, name: "1 Bits" },
    { id: AdaACF.EnStopBits.S15Bits, name: "1.5 Bits" },
    { id: AdaACF.EnStopBits.S2Bits, name: "2 Bits" }
];

AdaACF.EnLength = {
    L7Bits : 7,
    L8Bits : 8
};

AdaACF.Lengths = [
    { id: AdaACF.EnLength.L7Bits, name: "7 Bits" },
    { id: AdaACF.EnLength.L8Bits, name: "8 Bits" }
];

AdaACF.EnEnableRTS = {
    Enable: 0,
    Disable: 1
};

AdaACF.EnEnableDTR = {
    Enable: 0,
    Disable: 1
};

AdaACF.EnHardwareFlowControl = {
    None: 0,
    RTS : 1,
    RTSCTS : 2
};

AdaACF.HardwareFlowControls = [
    { id: AdaACF.EnHardwareFlowControl.None, name: "None" }, 
    { id: AdaACF.EnHardwareFlowControl.RTS, name: "RTS" },
    { id: AdaACF.EnHardwareFlowControl.RTSCTS, name: "RTSCTS" },
];

AdaACF.EnSoftwareFlowControl = {
    None: 0,
    XONXOFF: 1
};

AdaACF.SoftwareFlowControls = [
    { id: AdaACF.EnSoftwareFlowControl.None, name: "None" },
    { id: AdaACF.EnSoftwareFlowControl.XONXOFF, name: "XONXOFF" }
];


AdaACF.SerialPort = function (num) {
    this.portType = AdaACF.EnPortType.SerialPort;
    this.numPort = num;
    this.speed = AdaACF.EnSpeed.V009600;
    this.parity = AdaACF.EnParity.PNone;
    this.length = AdaACF.EnLength.L8Bits;
    this.stopBits = AdaACF.EnStopBits.S1Bits;
    this.hardwareFlowControl = AdaACF.EnHardwareFlowControl.None;
    this.softwareFlowControl = AdaACF.EnSoftwareFlowControl.None; 
};

AdaACF.TcpPort = function(ip, writePort, readPort) {
    this.portType = AdaACF.EnPortType.TcpIpPort;
    this.ip = ip;
    this.writePortNumber = writePort || 0;
    this.readPortNumber = readPort || 0; 
};

AdaACF.VirtualInputPort = function() {
    this.portType = AdaACF.EnPortType.VirtualInputPort;
    this.data = [];
    this.pollingInterval = 1000;
};

AdaACF.FilePort = function() {
    this.portType = AdaACF.EnPortType.FileChannelPort;
    this.fileName = "acfoutput.txt";
};

AdaACF.FtpPort = function(ip ) {
    this.portType = AdaACF.EnPortType.FtpChannelPort;
    this.userName = "anonymous";
    this.password = "guest";
    this.ip = ip;
    this.initialDir = "/";
};

AdaACF.Label = function(labelText, variables) {
    this.text = labelText;
    this.variables = variables; //TODO: methods to add variables...
    this.formatId = 1;
};

AdaACF.DisplayColor = function() {
    this.red = 0, 
    this.green = 0, 
    this.blue = 0, 
    this.blink = false
};

AdaACF.DisplayStatus = function() {
    this.text = "",
    this.color = new AdaACF.DisplayColor(),
    this.lightOn = true;
    this.arrowUp = false;
    this.arrowDown = false; 
};

AdaACF.DisplayAddressStatus = function(displayAddress, displayStatus) {
    this.address = displayAddress, 
    this.status = displayStatus
}

AdaACF.DisplayKeyCodes = function(displayAddress, displayKeyCodes) {
    this.address = displayAddress,
    this.keyCodes = displayKeyCodes
}

AdaACF.AcfDeviceClient = function(server, port, debugMode) {

    var alchemyClient = {};
    Modernizr.load({
        test: Modernizr.websockets,
        nope: 'js/web-socket-js/web_socket.js' //TODO: install https://github.com/gimite/web-socket-js
    });

    this.server = server;
    this.port = port;

    // Event Handlers
    this.Error = function (errorDescription) {
        console.log('ACF Error connecting device ' + errorDescription);
    };

    this.connected = function() {
    };
    
    // Set up the Alchemy client object
    alchemyClient = new Alchemy({
        Server: this.server,
        Port: this.port,
        Action: 'opendevice',
        Heartbeat: 400, //HeartBeat de 10 segons. TODO: Provoca error a la printer.
        DebugMode: debugMode
    });


    var parseResponse = function(response, receiveHandler, acfClientInstance) {
        var data = JSON.parse(response);
        if (data.Type == AdaACF.EnResponseType.WeightReaded) { //Weight
            receiveHandler(data.Data.weight);
        } else {
            if (data.Type == AdaACF.EnResponseType.RawDeviceRead) {
                receiveHandler(data.Data);
            } 
            else {
                if (data.Type == AdaACF.EnResponseType.KeyPressed || data.Type == AdaACF.EnResponseType.BarcodeReaded) {
                    receiveHandler(data.Type, data.Data);
                }
                else
                if (data.Type == AdaACF.EnResponseType.Error) {
                    //TODO: Error handler.
                    if (data.Data && data.Data.Message)
                        acfClientInstance.Error(data.Data.Message);
                    else
                        acfClientInstance.Error("Undefined Web ACF Error");
                }
            }
        }
    };
    
    var newId = function () {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    var openDevice = function(devicePort, deviceModel, deviceType, acfClientInstance) {
        alchemyClient.Start();
        this.currentSessionId = newId();
        acfClientInstance.currentSessionId = this.currentSessionId;
        alchemyClient.connected = function () {
            var openDeviceRequest = {
                SessionId: currentSessionId,
                Type : AdaACF.EnRequestType.OpenDevice,
                Port : devicePort,
                DeviceType : deviceType,
                DeviceModel : deviceModel
            };

            alchemyClient.Send(openDeviceRequest);
            acfClientInstance.currentOpenDeviceType = deviceType;
            acfClientInstance.isConnected = true;
            acfClientInstance.connected(this);
        };
        alchemyClient.Error = function () { acfClientInstance.Error('Communication error.'); };
    };

    /** Public methods **/ 
    this.openWeightDevice = function (devicePort, deviceModel, receiveHandler) {
        var acfInstance = this;
        alchemyClient.MessageReceived = function (event) {
            parseResponse(event.data, receiveHandler, acfInstance);
        };
        openDevice(devicePort, deviceModel, AdaACF.EnDeviceType.WeightIndicator, this);
    };

    this.openPrinterDevice = function(devicePort, deviceModel) {
        var acfInstance = this;
        alchemyClient.MessageReceived = function (event) {
            parseResponse(event.data, null, acfInstance);
        };
        openDevice(devicePort, deviceModel, AdaACF.EnDeviceType.Printer, this);
    };

    this.openScannerDevice = function (devicePort, deviceModel, receiveHandler) {
        var acfInstance = this;
        alchemyClient.MessageReceived = function (event) {
            parseResponse(event.data, receiveHandler, acfInstance);
        };
        openDevice(devicePort, deviceModel, AdaACF.EnDeviceType.Scanner, this);
    };
    
    this.openLightIndicatorDevice = function(devicePort, deviceModel, receiveHandler) {
        var acfInstance = this;
        alchemyClient.MessageReceived = function (event) {
            parseResponse(event.data, receiveHandler, acfInstance);
        };
        openDevice(devicePort, deviceModel, AdaACF.EnDeviceType.LightsController, this);
    }

    this.openRawDevice = function (devicePort, deviceModel, receiveHandler) {
        var acfInstance = this;
        alchemyClient.MessageReceived = function (event) {
            parseResponse(event.data, receiveHandler, acfInstance);
        };
        openDevice(devicePort, deviceModel, AdaACF.EnDeviceType.RawDevice, this);
    }


    this.getDescription = function () {
        var deviceTypeName = "Unknown Device";
        switch (this.currentOpenDeviceType) {
            case AdaACF.EnDeviceType.Scanner:
                deviceTypeName = "Scanner";
            break;
            case AdaACF.EnDeviceType.Printer:
                deviceTypeName = "Printer";
                break;
            case AdaACF.EnDeviceType.WeightIndicator:
                deviceTypeName = "WeightIndicator";
                break;
            case AdaACF.EnDeviceType.LightsController:
                deviceTypeName = "LightsController";
                break;
            case AdaACF.EnDeviceType.RawDevice:
                deviceTypeName = "Raw";
                break;
            default:
        }
        
        return deviceTypeName + " (" + this.currentSessionId +  ")";
    };

    //*** Printer Controller *** 

    this.printLabel = function (acfLabel, numCopies) {
        //var label = new AdaACF.Label(labelText, variables);
        if (numCopies == undefined) numCopies = 1;
        var printLabelRequest = {
            SessionId: this.currentSessionId,
            Type: AdaACF.EnRequestType.PrintLabel,
            Label: acfLabel,
            Copies: numCopies
        };
        alchemyClient.Send(printLabelRequest);
    };

    this.prePrintLabel = function (acfLabel) {
        //var label = new AdaACF.Label(labelText, variables);
        var printLabelRequest = {
            SessionId: this.currentSessionId,
            Type: AdaACF.EnRequestType.PrePrintLabel,
            Label: acfLabel
        };
        alchemyClient.Send(printLabelRequest);
    };
    
    //*** Lights Controller *** 

    this.setDisplayStatus = function(status) {
        var displayRequest = {
            SessionId: this.currentSessionId,
            Type: AdaACF.EnRequestType.DisplayStatus,
            DisplayStatus: status
        };
        alchemyClient.Send(displayRequest);
    };
    
    // keyCodes  <- AdaACF.DisplayKeyCodes
    this.configDisplayKeyCodes = function(keyCodes) {
        var displayRequest = {
            SessionId: this.currentSessionId,
            Type: AdaACF.EnRequestType.DisplayKeyCodes,
            DisplayKeyCodes: keyCodes
        };
        alchemyClient.Send(displayRequest);
    };

    this.rawDeviceWrite = function(dataToWrite) {
        if (!dataToWrite) return;
        var rawDeviceRequest = {
            SessionId: this.currentSessionId,
            Type: AdaACF.EnRequestType.RawDeviceWrite,
            Data: dataToWrite
        };
        alchemyClient.Send(rawDeviceRequest);
    };

    this.close = function () {
        if (alchemyClient.SocketState == Alchemy.prototype.SocketStates.Open) {
            var closeDeviceRequest = {
                SessionId: this.currentSessionId,
                Type: AdaACF.EnRequestType.CloseDevice,
            };
            alchemyClient.Send(closeDeviceRequest);
        }
        alchemyClient.Stop();
    };
};

/*AdaACF.AcfDeviceClient.prototype = {
    Error: function () { },
    _ACFError: function () {
        console.log('Error from ACF.');
        //this.Error();
    },
};*/