import { RouterServer } from "../routerserver";
import * as ws from "ws";
import { IServerConfig, IServiceConfig } from "../types/";
import * as rpcServer from "@sourcegraph/vscode-ws-jsonrpc/lib/server";
import * as rpc from "@sourcegraph/vscode-ws-jsonrpc";

function toSocket(webSocket: ws): rpc.IWebSocket {
  return {
    send: (content) => webSocket.send(content),
    onMessage: (cb) => (webSocket.onmessage = (event) => cb(event.data)),
    onError: (cb) =>
      (webSocket.onerror = (event) => {
        if ("message" in event) {
          cb((event as any).message);
        }
      }),
    onClose: (cb) =>
      (webSocket.onclose = (event) => cb(event.code, event.reason)),
    dispose: () => webSocket.close()
  };
}
export class WebSocketServer extends RouterServer {
  private server: ws.Server;
  constructor(config: IServerConfig, services: IServiceConfig[]) {
    super();
    this.server = new ws.Server(
      {
        port: config.port,
        perMessageDeflate: false
      },
      () => {
        console.log(
          `router: websocket server is listening to ws request on ${config.port}`
        );
      }
    );
    this.server.on("connection", (client: ws, request) => {
      const serviceName = (request.url && request.url.split("/")[1]) || "";
      if (serviceName.length) {
        const service = services.find((s) => s.name === serviceName);
        if (service) {
          const localConnection = rpcServer.createServerProcess(
            serviceName,
            service.bin,
            service.param
          );
          const socket: rpc.IWebSocket = toSocket(client);
          const connection = rpcServer.createWebSocketConnection(socket);
          rpcServer.forward(connection, localConnection);
          console.log(`Forwarding new client`);
          socket.onClose((code, reason) => {
            console.log("Client closed", reason);
            localConnection.dispose();
          });
        } else {
          console.log("unsupport service:" + serviceName);
          client.close();
        }
      } else {
        client.close();
      }
    });
  }
}
