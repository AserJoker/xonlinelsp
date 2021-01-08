import { IConfig } from "./types";
import * as fs from "fs";
import * as path from "path";
import * as yaml2js from "js-yaml";
export class Config {
  private static config: IConfig = {
    services: [],
    server: { port: 3000, type: "websocket" }
  };
  private static path = path.resolve(process.cwd(), "config.yml");
  public static LoadConfig(configfile?: string) {
    if (configfile) {
      this.path = path.resolve(process.cwd(), configfile);
    }
    fs.access(this.path, (e) => {
      if (e && e.code === "ENOENT") {
        fs.writeFile(
          this.path,
          `
services: []
server:
 port: 3000
 type: websocket
            `,
          (e) => {
            if (e) console.log(e);
          }
        );
      }
    });
    this.config = {
      ...(yaml2js.load(fs.readFileSync(this.path, "utf-8")) as object)
    } as IConfig;
  }
  public static getServerConfig() {
    return this.config.server;
  }
  public static getServicesConfig() {
    return this.config.services;
  }
}
