#!/usr/bin/env node
import { Config } from "./config";
import { WebSocketServer } from "./server";
const argv = process.argv.splice(2);
Config.LoadConfig(argv[0]);
switch (Config.getServerConfig().type) {
  case "websocket":
    new WebSocketServer(Config.getServerConfig(), Config.getServicesConfig());
    break;
}
