export interface IServerConfig {
  port: number;
  type: "websocket" | "http" | "socket";
}
