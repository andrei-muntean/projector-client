import { CookieService } from 'ngx-cookie-service';
import { Injectable, EventEmitter } from '@angular/core';

/**
 * Service used to create and connect to web sockets, it utilizes Subject and Observables from rxjs
 * send and receive data
 */
@Injectable({
    providedIn: 'root'
})
export class WebsocketService {

    private ownerUUID: string;
    private socket: WebSocket;
    private listener: EventEmitter<any> = new EventEmitter();

    public constructor() {
        this.socket = new WebSocket("ws://192.168.4.1//control");
        this.socket.onopen = event => {
            this.listener.emit({ "type": "open", "data": event });
        }
        this.socket.onclose = event => {
            this.listener.emit({ "type": "close", "data": event });
        }
        this.socket.onmessage = event => {
            this.listener.emit({ "type": "message", "data": event.data });
        }
    }

    connect() {

    }

    send(data: string) {
        this.socket.send(data);
    }

    close() {
        this.socket.close();
    }

    getEventListener() {
        return this.listener;
    }
}
