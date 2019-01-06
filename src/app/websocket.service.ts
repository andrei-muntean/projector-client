import { Injectable, EventEmitter  } from '@angular/core';

/**
 * Service used to create and connect to web sockets, it utilizes Subject and Observables from rxjs
 * send and receive data
 */
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  
  private url = 'http://localhost:8080';

  private socket: WebSocket;
  private listener: EventEmitter<any> = new EventEmitter();

  public constructor() {
      this.socket = new WebSocket("ws://localhost:8080/control");
      this.socket.onopen = event => {
        this.listener.emit({"type": "open", "data": event});
      }
      this.socket.onclose = event => {
        this.listener.emit({"type": "open", "data": event});
      }
      this.socket.onmessage = event => {
          this.listener.emit({"type": "message", "data": JSON.parse(event.data)});
      }
  }

  public send(data: string) {
      this.socket.send(data);
  }

  public close() {
      this.socket.close();
  }

  public getEventListener() {
      return this.listener;
  }
}
