import { map, catchError } from 'rxjs/operators';
import { WebsocketService } from './../websocket.service';
import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../requests.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projector-control-page',
  templateUrl: './projector-control-page.component.html',
  styleUrls: ['./projector-control-page.component.css']
})
export class ProjectorControlPageComponent implements OnInit {

  isLoading = true;
  presentationName = 'Presentation Name';
  currentSlide = 0;
  totalSlides = 0;
  ussersOnline = 0;

  messages: Array<any>;

  constructor(private _wsService: WebsocketService,
    private _requestService: RequestsService,
    private _router: Router) {
    this.messages = [];
  }

  ngOnInit() {

    this._requestService.getStats().pipe(
      map((response: Response) => {
        return [{ status: response.status, json: response }];
      }),
      catchError(error => of([{ status: error.status, json: error }]))
    ).subscribe(
      res => {
        console.log(res);
        if (res[0].status === 200) {
          this.isLoading = false;
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
        else {
          this.redirectToHomePage();
        }
      }, err => {
        console.log(err);
        if (err[0].status === 404) {
          this.redirectToHomePage();
        }
      });
  }

  /**
   * Redirect To Home Page
   */
  redirectToHomePage() {
    this._router.navigate(['/home']);
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
