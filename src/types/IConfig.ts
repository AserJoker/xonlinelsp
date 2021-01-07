import { IServerConfig } from "./IServerConfig";
import { IServiceConfig } from "./IServiceConfig";

export interface IConfig {
  server: IServerConfig;
  services: IServiceConfig[];
}
