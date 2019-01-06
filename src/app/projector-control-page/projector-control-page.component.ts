import { WebsocketService } from './../websocket.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-projector-control-page',
  templateUrl: './projector-control-page.component.html',
  styleUrls: ['./projector-control-page.component.css']
})
export class ProjectorControlPageComponent implements OnInit {

  presentationName = 'Presentation Name';
  currentSlide = 0;
  totalSlides = 0;
  ussersOnline = 0;

  messages: Array<any>;

  constructor(private _wsService: WebsocketService) {
    this.messages = [];
  }

  ngOnInit() {
    this._wsService.getEventListener().subscribe(event => {
      if (event.type == "message") {
        console.log(event.data);
        let data = event.data.content;
        if (event.data.sender) {
          data = event.data.sender + ": " + data;
        }
        this.messages.push(data);
      }
      if (event.type == "close") {
        this.messages.push("/The socket connection has been closed");
      }
      if (event.type == "open") {
        this.messages.push("/The socket connection has been established");
      }
    });
  }

  /**
   * send json with:
   * {command: 'transition_next'}
   * to websocket
   */
  nextSlide() {

  }

  /**
   * send json with:
   * {command: 'transition_previous'}
   * to websocket
   */
  prevSlide() {

  }

  /**
  * send json with:
  * {command: 'presentation_stop'}
  * to websocket
  */
  stopSlide() {

  }

}
