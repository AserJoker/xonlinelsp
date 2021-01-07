import { IConfig } from "./types";
import * as fs from "fs";
import * as path from "path";
import * as yaml2js from "js-yaml";
export class Config {
  private static config: IConfig = {
    services: [],
    server: { port: 3000, type: "websocket" }
  };
  public static LoadConfig(configfile?: string) {
    fs.access(
      (configfile && path.resolve(process.cwd(), configfile)) ||
        path.resolve("~", "config.yml"),
      (e) => {
        if (e && e.code === "ENOENT") {
          fs.writeFile(
            (configfile && path.resolve(process.cwd(), configfile)) ||
              path.resolve("~", "config.yml"),
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
      }
    );
    this.config = {
      ...(yaml2js.load(
        fs.readFileSync(path.resolve(process.argv[1], "config.yml"), "utf-8")
      ) as object)
    } as IConfig;
  }
  public static getServerConfig() {
    return this.config.server;
  }
  public static getServicesConfig() {
    return this.config.services;
  }
}
