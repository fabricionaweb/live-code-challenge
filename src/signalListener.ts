import { SIGNAL_R_URL } from "./constants";
import * as signalR from "@microsoft/signalr";

const DEFAULTS = {
  endpoint: SIGNAL_R_URL,
  events: [{}],
};

class SignalListener {
  options: any;
  connection: signalR.HubConnection;

  constructor(options: Partial<any>) {
    this.options = { ...DEFAULTS, ...options };
  }

  init() {
    this.start();
    this.bindListeners();
  }

  start() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNAL_R_URL, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();
  }

  destroy() {
    this.connection.stop();
  }

  bindListeners() {
    Object.entries(this.options.events).forEach(
      ([eventName, eventCallback]: [string, any]) => {
        this.connection.on(eventName, eventCallback);
      }
    );

    this.connection.start().catch((err) => document.write(err));
  }
}

export { SignalListener };
