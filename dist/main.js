#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var server_1 = require("./server");
var argv = process.argv.splice(2);
config_1.Config.LoadConfig(argv[0]);
switch (config_1.Config.getServerConfig().type) {
    case "websocket":
        new server_1.WebSocketServer(config_1.Config.getServerConfig(), config_1.Config.getServicesConfig());
        break;
}
