"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServer = void 0;
var routerserver_1 = require("../routerserver");
var ws = __importStar(require("ws"));
var rpcServer = __importStar(require("@sourcegraph/vscode-ws-jsonrpc/lib/server"));
function toSocket(webSocket) {
    return {
        send: function (content) { return webSocket.send(content); },
        onMessage: function (cb) { return (webSocket.onmessage = function (event) { return cb(event.data); }); },
        onError: function (cb) {
            return (webSocket.onerror = function (event) {
                if ("message" in event) {
                    cb(event.message);
                }
            });
        },
        onClose: function (cb) {
            return (webSocket.onclose = function (event) { return cb(event.code, event.reason); });
        },
        dispose: function () { return webSocket.close(); }
    };
}
var WebSocketServer = /** @class */ (function (_super) {
    __extends(WebSocketServer, _super);
    function WebSocketServer(config, services) {
        var _this = _super.call(this) || this;
        _this.server = new ws.Server({
            port: config.port,
            perMessageDeflate: false
        }, function () {
            console.log("router: websocket server is listening to ws request on " + config.port);
        });
        _this.server.on("connection", function (client, request) {
            var serviceName = (request.url && request.url.split("/")[1]) || "";
            if (serviceName.length) {
                var service = services.find(function (s) { return s.name === serviceName; });
                if (service) {
                    var localConnection_1 = rpcServer.createServerProcess(serviceName, service.bin, service.param);
                    var socket = toSocket(client);
                    var connection = rpcServer.createWebSocketConnection(socket);
                    rpcServer.forward(connection, localConnection_1);
                    console.log("Forwarding new client");
                    socket.onClose(function (code, reason) {
                        console.log("Client closed", reason);
                        localConnection_1.dispose();
                    });
                }
                else {
                    console.log("unsupport service:" + serviceName);
                    client.close();
                }
            }
            else {
                client.close();
            }
        });
        return _this;
    }
    return WebSocketServer;
}(routerserver_1.RouterServer));
exports.WebSocketServer = WebSocketServer;
