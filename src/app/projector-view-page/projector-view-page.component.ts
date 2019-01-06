import { WebsocketService } from './../websocket.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-projector-view-page',
  templateUrl: './projector-view-page.component.html',
  styleUrls: ['./projector-view-page.component.css']
})
export class ProjectorViewPageComponent implements OnInit {

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

}
