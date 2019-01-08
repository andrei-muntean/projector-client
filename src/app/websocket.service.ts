import { Injectable, EventEmitter } from '@angular/core';
import * as AppConfig from '../assets/app-config.json'

/**
 * Service used to create and connect to web sockets, it utilizes Subject and Observables from rxjs
 * send and receive data
 */
@Injectable({
    providedIn: 'root'
})
export class WebsocketService {

    private socket: WebSocket;
    private listener: EventEmitter<any> = new EventEmitter();

    public constructor() {
        this.socket = new WebSocket(AppConfig.default['websocketUrl'] + "/control");
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
    /**
     * Send data to socket
     * @param data 
     */
    send(data: string) {
        this.socket.send(data);
    }
    /**
     * Close socket
     */
    close() {
        this.socket.close();
    }
    /**
     * Socket event listeners
     */
    getEventListener() {
        return this.listener;
    }
}
