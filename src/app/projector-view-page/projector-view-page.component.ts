import { WebsocketService } from './../websocket.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestsService } from '../requests.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
  isLoading = true;

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

}
